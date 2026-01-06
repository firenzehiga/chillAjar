import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
	AlertCircle,
	XCircle,
	PlayCircle,
	StopCircle,
	Loader2,
	CalendarDays,
} from "lucide-react";
import Swal from "sweetalert2";
import { BookLoader } from "@/components/ui/BookLoader";
import { formatDate } from "@/utils/dateFormatter";
import {
	useMentorSessionsQuery,
	useStartSessionMutation,
	useEndSessionMutation,
} from "@/hooks/useSessions";

export function MentorSchedulePage() {
	const [startingSessionId, setStartingSessionId] = useState(null);
	const [endingSessionId, setEndingSessionId] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");

	// Query 1: Fetch daftar sesi mentor
	const {
		data: sessions = [],
		isLoading: isLoading,
		error: error,
	} = useMentorSessionsQuery();

	// Mutasi untuk memulai sesi
	const startSessionMutation = useStartSessionMutation();

	const handleStartSession = (sessionId) => {
		setStartingSessionId(sessionId);
		Swal.fire({
			title: "Mulai Sesi",
			text: "Apakah Anda yakin ingin memulai sesi ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, mulai!",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-chill-blue hover:bg-blue-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				startSessionMutation.mutate(sessionId, {
					onSuccess: () => {
						toast.success("Sesi berhasil dimulai!");
					},
					onError: () => {
						Swal.fire("Gagal", "Terjadi kesalahan saat memulai sesi.", "error");
					},
				});
			} else {
				setStartingSessionId(null);
			}
		});
	};

	// Mutasi untuk mengakhiri sesi
	const endSessionMutation = useEndSessionMutation();

	const handleEndSession = (sessionId) => {
		setEndingSessionId(sessionId);
		Swal.fire({
			title: "Akhiri Sesi",
			text: "Apakah Anda yakin ingin mengakhiri sesi ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, akhiri!",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-chill-blue hover:bg-blue-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				endSessionMutation.mutate(sessionId, {
					onSuccess: () => {
						toast.success("Sesi berhasil diakhiri!");
					},
					onError: () => {
						Swal.fire(
							"Gagal",
							"Terjadi kesalahan saat mengakhiri sesi.",
							"error"
						);
					},
				});
			} else {
				setEndingSessionId(null);
			}
		});
	};

	// ini untuk mengatur loading state per sesi
	useEffect(() => {
		if (!startSessionMutation.isPending) {
			setStartingSessionId(null);
		}
	}, [startSessionMutation.isPending]);

	useEffect(() => {
		if (!endSessionMutation.isPending) {
			setEndingSessionId(null);
		}
	}, [endSessionMutation.isPending]);

	const statusCheck = {
		reviewed: {
			label: "Reviewed",
			title: "Sesi telah direview oleh pelanggan",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
		},
		pending: {
			label: "Pending",
			title: "Menunggu Sesi dimulai",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
		},
		started: {
			label: "Sedang Dimulai",
			title: "Sesi sedang berlangsung",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
		},
		end: {
			label: "Selesai",
			title: "Sesi telah selesai dilaksanakan",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Pelanggan",
			selector: (row) => row.pelanggan?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Kursus",
			selector: (row) => row.kursus?.namaKursus || "-",
			sortable: true,
			width: "280px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) => {
				const mode = row.jadwal_kursus?.gayaMengajar;
				if (mode === "online") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Online
						</span>
					);
				} else if (mode === "offline") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
							Offline
						</span>
					);
				} else {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Data mode tidak valid
						</span>
					);
				}
			},

			width: "200px",
		},
		{
			name: "Status",
			selector: (row) => {
				const status = statusCheck[row.statusSesi];
				return status ? (
					<span className={`${status.class}`} title={status.title}>
						{status.label}
					</span>
				) : (
					<span className="text-gray-400 text-sm">-</span>
				);
			},
			width: "200px",
		},
		{
			name: "Aksi",
			cell: (row) => {
				// KONDISI BUTTON AKSI
				// Saat verifikasi atau tolak yang dilakukan
				const isSessionStarting =
					startSessionMutation.isPending && startingSessionId === row.id;
				const isSessionEnding =
					endSessionMutation.isPending && endingSessionId === row.id;

				// Apakah salah satu tombol ditekan
				const disableStart =
					isLoading ||
					!!endingSessionId ||
					(!!startingSessionId && startingSessionId !== row.id);
				const disableEnd =
					isLoading ||
					!!startingSessionId ||
					(!!endingSessionId && endingSessionId !== row.id);

				// styles untuk tombol
				const btnBase =
					"flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-all min-w-[110px]";
				const startClasses = `${btnBase} bg-green-600 hover:bg-green-700 text-white`;
				const endClasses = `${btnBase} bg-red-600 hover:bg-red-700 text-white`;
				const disabledClass = "opacity-50 cursor-not-allowed";

				const hasStartAction =
					row.statusSesi === "booked" || row.statusSesi === "pending";
				const hasEndAction = row.statusSesi === "started";

				return (
					<div className="gap-2">
						{hasStartAction && (
							<button
								type="button"
								className={`${startClasses} ${
									disableStart ? disabledClass : ""
								}`}
								disabled={disableStart || isSessionStarting}
								onClick={() => {
									setStartingSessionId(row.id);
									handleStartSession(row.id);
								}}>
								{isSessionStarting ? (
									<>
										<Loader2 className="animate-spin w-4 h-4 inline mb-1" />{" "}
										Memulai...
									</>
								) : (
									<>
										<PlayCircle className="w-4 h-4 inline mb-1" /> Mulai Sesi
									</>
								)}{" "}
							</button>
						)}
						{hasEndAction && (
							<button
								type="button"
								className={`${endClasses} ${disableEnd ? disabledClass : ""}`}
								disabled={disableEnd || isSessionEnding}
								onClick={() => {
									setEndingSessionId(row.id);
									handleEndSession(row.id);
								}}>
								{isSessionEnding ? (
									<>
										<Loader2 className="animate-spin w-4 h-4 inline mb-1" />{" "}
										Mengakhiri...
									</>
								) : (
									<>
										<StopCircle className="w-4 h-4 inline mb-1" /> Akhiri Sesi
									</>
								)}{" "}
							</button>
						)}
						{!hasStartAction && !hasEndAction && (
							<span className="italic text-gray-500">Tidak ada aksi</span>
						)}
					</div>
				);
			},
			width: "180px",
		},
	];

	const [previewImg, setPreviewImg] = useState(null);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data sesi atau transaksi
				</p>
			</div>
		);
	}
	//GAK KEPAKE LAGI KARENA LOGIKANYA UDAH DARI BACKEND
	// // Filter transaksi yang statusPembayaran === "accepted"
	// const acceptedTransactions = transactions.filter(
	// 	(transaction) => transaction.statusPembayaran === "accepted"
	// );

	// // Filter sesi yang memiliki transaksi dengan status "accepted"
	// const filteredSessions = sessions.filter((session) =>
	// 	acceptedTransactions.some(
	// 		(transaction) => transaction.sesi_id === session.id
	// 	)
	// );

	// // Sorting sesi terbaru di paling atas
	// const sortedSessions = [...filteredSessions].sort(
	// 	(a, b) => new Date(b.created_at) - new Date(a.created_at)
	// );

	// filter pencarian dengan filteredSessions
	const filteredData = sessions
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		.filter((session) => {
			const lower = searchTerm.toLowerCase();
			const mode = session.jadwal_kursus?.gayaMengajar || "";
			return (
				session.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
				session.mentor?.user?.nama?.toLowerCase().includes(lower) ||
				session.statusSesi.toLowerCase().includes(lower) ||
				session.kursus?.namaKursus?.toLowerCase().includes(lower) ||
				mode.toLowerCase().includes(lower)
			);
		});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<CalendarDays className="w-6 h-6 mr-2 text-blue-600" />
					My Sessions Schedules
				</h1>
				<p className="text-gray-600">Daftar Jadwal Sesi Saya</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Sesi</h2>
				</div>
				{isLoading ? (
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading sessions" />
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau metode..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{/* Main DataTable (single, tidy expandable) */}
						<DataTable
							columns={columns}
							data={filteredData}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => {
								return (
									<div className="p-5 text-sm text-gray-700 bg-gray-50 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Topik:
												</span>
												<span className="text-gray-500 ml-2 text-justify">
													{data.detailKursus || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Jadwal:
												</span>
												<span className="capitalize">
													{formatDate(data.jadwal_kursus?.tanggal) || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Jam:
												</span>
												<span className="capitalize">
													{(data.jadwal_kursus?.waktu || "").slice(0, 5) || "-"}{" "}
													WIB
												</span>
											</p>

											{data.jadwal_kursus?.gayaMengajar === "offline" && (
												<p className="flex">
													<span className="w-20 font-medium text-gray-900">
														Lokasi:
													</span>
													<span className="capitalize mb-5">
														{data.jadwal_kursus?.tempat || "-"}
													</span>
												</p>
											)}
										</div>

										<div className="space-y-2">
											<p className="flex items-center">
												<span className="w-44 font-medium text-gray-900">
													Paket Belajar:
												</span>
												<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset">
													{data.paket?.nama || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-44 font-medium text-gray-900">
													Catatan Paket:
												</span>
												<span className="text-gray-600">
													{data.paket?.deskripsi || "-"}
												</span>
											</p>

											<span className="w-44 font-medium text-gray-900 block mb-2">
												Layanan yang termasuk:
											</span>
											<div className="mt-2 max-h-48 overflow-auto pr-2">
												{data.paket?.items && data.paket.items.length > 0 ? (
													<>
														<ul className="divide-y divide-gray-100 bg-white rounded-md shadow-sm overflow-hidden">
															{data.paket.items.map((item, idx) => (
																<li
																	key={idx}
																	className="px-3 py-3 text-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
																	<div className="flex-1 min-w-0">
																		<div className="font-semibold text-gray-800 truncate">
																			{item.nama || "-"}
																		</div>
																		{item.deskripsi ? (
																			<div className="mt-1 text-gray-500 text-xs leading-relaxed">
																				{item.deskripsi}
																			</div>
																		) : (
																			<div className="mt-1 text-gray-400 text-xs">
																				Tidak ada deskripsi
																			</div>
																		)}
																	</div>
																</li>
															))}
														</ul>
													</>
												) : (
													<div className="text-gray-500 text-sm">
														Tidak ada item di paket ini
													</div>
												)}
											</div>
										</div>
									</div>
								);
							}}
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Schedules
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada Schedules yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Schedules Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Belum ada data sesi
											</p>
										</div>
									)}
								</>
							}
						/>
					</>
				)}
			</div>
			{previewImg && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="relative bg-white rounded-lg shadow-lg p-7">
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-red-500 z-10 pointer-events-auto outline-none focus:outline-none"
							onClick={() => setPreviewImg(null)}
							style={{ zIndex: 10 }}>
							<XCircle className="w-6 h-6" />
						</button>
						<img
							src={previewImg}
							alt="Preview"
							className="max-w-[70vw] max-h-[70vh] rounded-lg shadow"
							style={{ display: "block" }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default MentorSchedulePage;
