import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
	X,
	MapPinIcon,
	Monitor,
	MonitorX,
	CalendarX,
	BookOpen,
	Phone,
	Mail,
} from "lucide-react";
import { AsyncImage } from "loadable-image";
import { FaWhatsapp } from "react-icons/fa";

export default function DetailMentorModal({
	open,
	onClose,
	mentor,
	allSchedules = [],
	validModes = [],
	onSchedule,
}) {
	const [tab, setTab] = useState("about");

	useEffect(() => {
		if (open) setTab("about");
	}, [open]);

	if (!open) return null;

	console.log("Mentor:", mentor);

	const offlineSchedules = allSchedules.filter(
		(s) => s.gayaMengajar === "offline" && s.tempat
	);
	const schedulesByLocation = offlineSchedules.reduce((acc, s) => {
		const key = s.tempat;
		if (!acc[key]) acc[key] = [];
		acc[key].push(s);
		return acc;
	}, {});
	const uniqueLocations = Object.keys(schedulesByLocation);

	const formatSchedulePart = (val) => {
		if (!val && val !== 0) return null;
		const s = String(val).trim();
		// ISO datetime e.g. 2025-12-23T18:00:00 or 2025-12-23 18:00:00
		const isoMatch = s.match(
			/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}):(\d{2})(?::\d{2})?/
		);
		if (isoMatch) return `${isoMatch[1]} • ${isoMatch[2]}:${isoMatch[3]} WIB`;
		// Time only HH:MM:SS or HH:MM
		const timeMatch = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
		if (timeMatch)
			return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]} WIB`;
		// Date only YYYY-MM-DD
		const dateMatch = s.match(/^(\d{4}-\d{2}-\d{2})$/);
		if (dateMatch) return dateMatch[1];
		return s;
	};

	const describeSchedule = (sch) => {
		const parts = [];
		// prefer readable labels: hari/day, then date/time fields
		if (sch.hari) parts.push(String(sch.hari));
		if (sch.day) parts.push(String(sch.day));

		// collect possible date/time fields
		const candidates = [
			sch.tanggal,
			sch.date,
			sch.waktu,
			sch.time,
			sch.startTime,
			sch.start_time,
		];
		for (const c of candidates) {
			const f = formatSchedulePart(c);
			if (f) parts.push(f);
		}

		if (parts.length) return parts.slice(0, 4).join(" • ");
		return null;
	};

	const content = (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/40" onClick={onClose} />
			<div className="relative bg-white w-full max-w-3xl mx-4 my-8 rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
				<div className="flex items-center justify-between px-6 py-3 border-b">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
							<AsyncImage
								src={mentor.mentorImage}
								alt={mentor.mentorName}
								className="w-full h-full object-cover"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_mentor/default.png";
								}}
							/>
						</div>
						<div>
							<h3 className="text-lg font-semibold">{mentor.mentorName} </h3>
							<div className="text-sm text-yellow-400">
								{typeof mentor.mentorRating === "number" &&
								!isNaN(mentor.mentorRating)
									? mentor.mentorRating.toFixed(1)
									: Number(mentor.mentorRating) &&
									  !isNaN(Number(mentor.mentorRating))
									? Number(mentor.mentorRating).toFixed(1)
									: "0.0"}
							</div>
						</div>
					</div>
					<button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>

				<div className="px-6 py-4 overflow-auto flex-1">
					<div className="flex gap-3 border-b mb-4">
						<button
							onClick={() => setTab("about")}
							className={`py-2 px-3 focus:outline-none  ${
								tab === "about"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600"
							}`}>
							Tentang Saya
						</button>
						{/* <button
							onClick={() => setTab("courses")}
							className={`py-2 px-3 ${
								tab === "courses"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600"
							}`}>
							Kursus
						</button> */}
						<button
							onClick={() => setTab("location")}
							className={`py-2 px-3 focus:outline-none ${
								tab === "location"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600"
							}`}>
							Lokasi & Ketersediaan
						</button>
						<button
							onClick={() => setTab("contact")}
							className={`py-2 px-3 ${
								tab === "contact"
									? "border-b-2 border-blue-600 text-blue-600"
									: "text-gray-600"
							}`}>
							Kontak
						</button>
					</div>

					<div className="min-h-[140px]">
						{tab === "about" && (
							<div>
								<p className="text-gray-700 text-sm whitespace-pre-line text-justify">
									{mentor.mentorAbout}
								</p>
							</div>
						)}

						{tab === "courses" && (
							<div className="space-y-3">
								{(mentor.courses || []).length === 0 ? (
									<p className="text-sm text-gray-500">
										Belum ada kursus terdaftar.
									</p>
								) : (
									(mentor.courses || []).map((c) => (
										<div
											key={c.id || c.courseId || c.courseName}
											className="flex items-start justify-between gap-3">
											<div>
												<div className="text-sm font-medium text-gray-900">
													{c.courseName}
												</div>
												<div className="text-xs text-gray-500">
													{c.courseShortDescription ||
														(c.courseDescription || "").slice(0, 120) +
															(c.courseDescription &&
															c.courseDescription.length > 120
																? "..."
																: "")}
												</div>
											</div>
											<div className="flex-shrink-0">
												<button
													onClick={() => onSchedule && onSchedule(mentor, c)}
													className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded">
													Pilih
												</button>
											</div>
										</div>
									))
								)}
							</div>
						)}

						{tab === "location" && (
							<div className="space-y-4">
								{/* General description */}
								<p className="text-sm text-gray-600">
									Informasi lokasi dan ketersediaan sesi mentor. Silahkan pilih
									sesuai dengan kenginanmu. Jika metode yang diinginkan
									tersedia, tunggu aja ya.
								</p>

								{/* Sesi Online highlight */}
								<div className="rounded-md border-l-4 border-blue-600 bg-blue-50 p-3">
									<div className="flex items-start gap-3">
										<Monitor className="w-5 h-5 text-blue-600 mt-0.5" />
										<div>
											<div className="text-sm font-medium text-gray-900">
												Sesi Online
											</div>
											<div className="text-xs text-gray-700">
												{validModes && validModes.includes("online")
													? "Tersedia — sesi dilakukan via video/meeting online. Silakan pilih kursus untuk melihat jadwal online yang tersedia."
													: "Belum tersedia — mentor belum menyediakan sesi online saat ini."}
											</div>
										</div>
									</div>
								</div>

								{/* Sesi Offline section */}
								<div>
									<div className="mb-2">
										<div className="text-sm font-medium text-gray-900">
											Sesi Offline
										</div>
										<div className="text-xs text-gray-500">
											Lokasi offline yang tercatat pada jadwal mentor.
										</div>
									</div>

									{uniqueLocations.length > 0 ? (
										uniqueLocations.map((loc) => (
											<div
												key={loc}
												className="p-3 rounded border bg-gray-50 mb-3">
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<MapPinIcon className="w-5 h-5 mr-3 text-blue-600" />
														<div>
															<div className="text-sm font-medium text-gray-900">
																{loc}
															</div>
															<div className="text-xs text-gray-500">
																{schedulesByLocation[loc].length} jadwal terkait
															</div>
														</div>
													</div>
												</div>

												<div className="mt-2 text-xs text-gray-600 space-y-1">
													{schedulesByLocation[loc].slice(0, 3).map((s, i) => (
														<div key={i} className="flex items-center gap-2">
															<CalendarX className="w-3 h-3 text-gray-400" />
															<span>
																{describeSchedule(s) ||
																	"Detail jadwal tersedia setelah memilih kursus"}
															</span>
														</div>
													))}
													{schedulesByLocation[loc].length > 3 && (
														<div className="text-xs text-gray-500">
															dan {schedulesByLocation[loc].length - 3} lainnya
														</div>
													)}
												</div>
											</div>
										))
									) : (
										<div className="p-3 rounded border bg-gray-50 text-sm text-gray-500">
											Tidak ada lokasi offline tersedia untuk mentor ini.
										</div>
									)}
								</div>

								{/* Final fallback if no methods at all */}
								{(!validModes || validModes.length === 0) &&
									uniqueLocations.length === 0 && (
										<div className="mt-2 p-3 rounded border bg-yellow-50 text-sm text-yellow-800">
											Belum ada metode sesi yang tersedia untuk mentor ini.
										</div>
									)}
							</div>
						)}

						{tab === "contact" && (
							<div className="space-y-3">
								<p className="text-sm text-gray-600">
									Kontak di bawah dapat digunakan untuk menghubungi mentor
									secara langsung jika dibutuhkan. Gunakan etika yang baik saat
									menghubungi ya!
								</p>

								<div className="grid grid-cols-1 gap-3">
									<div className="flex items-start gap-3 p-3 rounded border bg-gray-50">
										<Phone className="w-5 h-5 text-blue-600 mt-1" />
										<div>
											<div className="text-sm font-medium text-gray-900">
												Telepon / WhatsApp
											</div>
											<div className="text-xs text-gray-600 mt-1">
												{mentor.mentorPhone ? (
													<div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
														<a
															href={`tel:${mentor.mentorPhone.replace(
																/\s+/g,
																""
															)}`}
															className="text-sm text-blue-600 underline">
															{mentor.mentorPhone}
														</a>
														<a
															href={(() => {
																const raw = mentor.mentorPhone || "";
																const digits = raw.replace(/\D/g, "");
																const normalized = digits.startsWith("0")
																	? `62${digits.slice(1)}`
																	: digits;
																return normalized
																	? `https://wa.me/${normalized}`
																	: "#";
															})()}
															target="_blank"
															rel="noreferrer noopener"
															className="inline-flex items-center gap-2 px-3 py-1 mt-2 sm:mt-0 bg-green-600 text-white rounded-md text-xs">
															<FaWhatsapp className="w-3 h-3" /> WhatsApp
														</a>
													</div>
												) : (
													<div className="text-sm text-gray-500">
														Nomor telepon belum tersedia
													</div>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-start gap-3 p-3 rounded border bg-gray-50">
										<Mail className="w-5 h-5 text-blue-600 mt-1" />
										<div>
											<div className="text-sm font-medium text-gray-900">
												Email
											</div>
											<div className="text-xs text-gray-600 mt-1">
												{mentor.email ? (
													<a
														href={`mailto:${mentor.email}`}
														className="text-sm text-blue-600 underline">
														{mentor.email}
													</a>
												) : (
													<div className="text-sm text-gray-500">
														Email belum tersedia
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="px-6 py-4 border-t flex justify-end gap-3">
					<button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
						Tutup
					</button>
					{/* <button
						onClick={() => onSchedule && onSchedule(mentor)}
						className="px-4 py-2 rounded bg-blue-600 text-white">
						Pilih Kursus
					</button> */}
				</div>
			</div>
		</div>
	);

	// Render into document.body so modal isn't constrained by card/container
	if (typeof document !== "undefined") {
		return createPortal(content, document.body);
	}
	return content;
}
