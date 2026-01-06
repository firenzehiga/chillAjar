import React, { useState, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import idLocale from "date-fns/locale/id";
import Swal from "sweetalert2";
import { showToast } from "../customToast";

// gunakan locale Bahasa Indonesia
const locales = { id: idLocale };
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

// Full calendar-first implementation with modal-based create/edit/delete
export default function ScheduleCalendar({
	schedules = [],
	setSchedules,
	mentorName,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null); // null => creating new
	const [form, setForm] = useState({
		tanggal: "",
		waktu: "",
		gayaMengajar: "online",
		tempat: "",
		keterangan: "",
	});

	const events = useMemo(
		() =>
			schedules.map((s, idx) => {
				const start = s.tanggal
					? new Date(`${s.tanggal}T${s.waktu || "00:00"}`)
					: new Date(); // kalau baru buat data kosong aja
				const end = new Date(start.getTime() + 60 * 60 * 1000);
				const title = s.gayaMengajar
					? `${s.gayaMengajar}`
					: s.keterangan || "Sesi";
				return { title, start, end, _idx: idx, locked: !!s.locked };
			}),
		[schedules]
	);

	const openCreateModal = ({ start }) => {
		const tanggal = format(start, "yyyy-MM-dd");
		const waktu = format(start, "HH:mm");
		setEditingIndex(null);
		setForm({
			tanggal,
			waktu,
			gayaMengajar: "online",
			tempat: "",
			keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
		});
		setIsOpen(true);
	};

	const openEditModal = (event) => {
		const idx = event._idx;
		const s = schedules[idx];
		if (!s) return;
		if (s.locked) {
			showToast({
				type: "warning",
				title: "Jadwal Terkunci",
				message: "Jadwal ini terkunci karena sudah dipesan.",
				duration: 2000,
			});
			return;
		}
		setEditingIndex(idx);
		setForm({
			tanggal: s.tanggal || "",
			waktu: s.waktu || "00:00",
			gayaMengajar: s.gayaMengajar || "online",
			tempat: s.tempat || "",
			keterangan:
				s.keterangan || (mentorName ? `Kursus dengan ${mentorName}` : ""),
		});
		setIsOpen(true);
	};

	const handleSave = () => {
		const payload = { ...form };

		// validasi wajib: tanggal & waktu
		if (!payload.tanggal || !payload.waktu) {
			showToast({
				type: "warning",
				title: "Validasi Gagal",
				message: "Tanggal dan waktu harus diisi.",
				duration: 2000,
			});
			return;
		}

		// validasi tempat untuk mode offline (cek terpisah agar selalu berlaku)
		if (
			payload.gayaMengajar === "offline" &&
			(!payload.tempat || payload.tempat.trim() === "")
		) {
			showToast({
				type: "warning",
				title: "Validasi Gagal",
				message: "Tempat harus diisi untuk sesi offline.",
				duration: 2000,
			});
			return;
		}

		if (editingIndex === null) {
			setSchedules((prev) => [...prev, payload]);
		} else {
			setSchedules((prev) =>
				prev.map((s, i) => (i === editingIndex ? { ...s, ...payload } : s))
			);
		}

		setIsOpen(false);
	};
	const handleDelete = () => {
		if (editingIndex === null) return;
		const s = schedules[editingIndex];
		if (s && s.locked) {
			alert("Jadwal terkunci tidak dapat dihapus.");
			return;
		}
		Swal.fire({
			title: "Hapus Jadwal?",
			text: "Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.",
			icon: "warning",
			iconColor: "#DC2626",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-red-600 hover:bg-red-700 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				setSchedules((prev) => prev.filter((_, i) => i !== editingIndex));
				showToast({
					type: "success",
					title: "Terhapus",
					message: "Jadwal berhasil dihapus.",
					duration: 2000,
				});
			}
		});
		setIsOpen(false);
	};

	// atur jam tampilan: mulai dari 06:00 hingga 23:00 (sembunyikan 00:00-05:59)
	const minTime = new Date();
	minTime.setHours(6, 0, 0, 0);
	const maxTime = new Date();
	maxTime.setHours(23, 0, 0, 0);

	// pesan Bahasa Indonesia untuk kontrol kalender
	const messages = {
		allDay: "Sehari penuh",
		previous: "Sebelumnya",
		next: "Selanjutnya",
		today: "Hari ini",
		month: "Bulan",
		week: "Minggu",
		day: "Hari",
		agenda: "Agenda",
		date: "Tanggal",
		time: "Waktu",
		event: "Acara",
		noEventsInRange: "Tidak ada acara",
		showMore: (count) => `+${count} lainnya`,
	};

	// paksa format 24-jam dan header tanggal/bulan dalam Bahasa Indonesia
	const formats = {
		timeGutterFormat: "HH:mm",
		agendaTimeFormat: "HH:mm",
		// event range displayed as 24-hour
		eventTimeRangeFormat: ({ start, end }) =>
			`${format(start, "HH:mm", { locale: idLocale })} - ${format(
				end,
				"HH:mm",
				{ locale: idLocale }
			)}`,
		// column header (weekday) full name, month name in full
		weekdayFormat: "EEEE",
		dayHeaderFormat: "EEEE, d MMMM yyyy",
		monthHeaderFormat: "MMMM yyyy",
	};

	return (
		<div className="border border-gray-200 rounded-lg p-2 bg-white">
			<BigCalendar
				localizer={localizer}
				events={events}
				defaultView="week"
				views={["month", "week", "day"]}
				culture={"id"}
				formats={formats}
				selectable
				onSelectSlot={openCreateModal}
				onSelectEvent={openEditModal}
				min={minTime}
				max={maxTime}
				messages={messages}
				style={{ height: 520 }}
			/>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div
						className="absolute inset-0 bg-black opacity-40"
						onClick={() => setIsOpen(false)}
					/>
					<div className="relative bg-white rounded-lg shadow max-w-md w-full p-4 z-10">
						<h3 className="text-lg font-medium mb-2">
							{editingIndex === null ? "Tambah Jadwal" : "Edit Jadwal"}
						</h3>

						<div className="space-y-2 text-sm">
							<div>
								<label className="block text-xs text-gray-600">Tanggal</label>
								<input
									type="date"
									className="w-full p-2 border rounded"
									value={form.tanggal}
									onChange={(e) =>
										setForm((f) => ({ ...f, tanggal: e.target.value }))
									}
								/>
							</div>

							<div>
								<label className="block text-xs text-gray-600">Waktu</label>
								{/* Gunakan dua select: jam (06-23) dan menit (00,15,30,45) supaya selalu 24-jam (WIB) */}
								<div className="flex gap-2">
									{/** helper parse waktu (safe) */}
									{/* eslint-disable-next-line no-undef */}
									{(() => {
										const parts = (form.waktu || "06:00").split(":");
										const curH = parts[0] || "06";
										const curM = parts[1] || "00";
										return (
											<>
												<select
													className="p-2 border rounded"
													value={curH}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															waktu: `${e.target.value}:${
																(f.waktu || "00:00").split(":")[1] || "00"
															}`,
														}))
													}>
													{Array.from({ length: 18 }).map((_, i) => {
														const hour = i + 6; // 6..23
														const hh = String(hour).padStart(2, "0");
														return (
															<option key={hh} value={hh}>
																{hh}
															</option>
														);
													})}
												</select>

												<select
													className="p-2 border rounded"
													value={curM}
													onChange={(e) =>
														setForm((f) => ({
															...f,
															waktu: `${
																(f.waktu || "06:00").split(":")[0] || "06"
															}:${e.target.value}`,
														}))
													}>
													{["00", "15", "30", "45"].map((m) => (
														<option key={m} value={m}>
															{m}
														</option>
													))}
												</select>
											</>
										);
									})()}
								</div>
								<div className="text-xs text-gray-500 mt-1">
									Waktu dalam format 24-jam (WIB)
								</div>
							</div>

							<div>
								<label className="block text-xs text-gray-600">
									Gaya Mengajar
								</label>
								<select
									className="w-full p-2 border rounded"
									value={form.gayaMengajar}
									onChange={(e) =>
										setForm((f) => ({ ...f, gayaMengajar: e.target.value }))
									}>
									<option value="online">Online</option>
									<option value="offline">Offline</option>
								</select>
							</div>

							{form.gayaMengajar === "offline" && (
								<div>
									<label className="block text-xs text-gray-600">Tempat</label>
									<input
										type="text"
										className="w-full p-2 border rounded"
										value={form.tempat}
										onChange={(e) =>
											setForm((f) => ({ ...f, tempat: e.target.value }))
										}
									/>
								</div>
							)}

							<div>
								<label className="block text-xs text-gray-600">
									Keterangan (opsional)
								</label>
								<input
									type="text"
									className="w-full p-2 border rounded"
									value={form.keterangan}
									onChange={(e) =>
										setForm((f) => ({ ...f, keterangan: e.target.value }))
									}
								/>
							</div>
						</div>

						<div className="mt-4 flex justify-end gap-2">
							{editingIndex !== null && (
								<button
									type="button"
									onClick={handleDelete}
									className="px-3 py-1 bg-red-600 text-white rounded">
									Hapus
								</button>
							)}
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-3 py-1 bg-gray-200 rounded">
								Batal
							</button>
							<button
								type="button"
								onClick={handleSave}
								className="px-3 py-1 bg-blue-600 text-white rounded">
								Simpan
							</button>
						</div>
					</div>
				</div>
			)}

			<p className="text-xs text-gray-500 mt-2">
				Klik area kosong untuk menambah jadwal. Klik event untuk mengedit atau
				menghapus.
			</p>
		</div>
	);
}
