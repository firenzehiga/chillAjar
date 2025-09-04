import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
	BookOpen,
	AlertCircle,
	XCircle,
	PlayCircle,
	StopCircle,
	Loader2,
} from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookLoader } from "../../../components/User/BookLoader";
export function MentorSchedulePage() {
	const [startingSessionId, setStartingSessionId] = useState(null);
	const [endingSessionId, setEndingSessionId] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	// Query 1: Fetch daftar sesi mentor
	const {
		data: sessions = [],
		isLoading: isLoadingSessions,
		error: errorSessions,
	} = useQuery({
		queryKey: ["mentorSessions"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/mentor/daftar-sesi", {
				headers: { Authorization: `Bearer ${token}` },
			});
			// console.log("Fetched sessions:", response.data);
			return response.data;
		},
		enabled: isAuthenticated,
		onError: (err) => {
			console.error("Error fetching sessions:", err);
		},
	});

	// Query 2: Fetch transaksi
	const {
		data: transactions = [],
		isLoading: isLoadingTransactions,
		error: errorTransactions,
	} = useQuery({
		queryKey: ["mentorTransactions"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/transaksi", {
				headers: { Authorization: `Bearer ${token}` },
			});
			// console.log("Fetched transactions:", response.data);
			return response.data;
		},
		enabled: isAuthenticated,
		onError: (err) => {
			console.error("Error fetching transactions:", err);
		},
	});

	// Mutasi untuk memulai sesi
	const startSessionMutation = useMutation({
		mutationFn: async (sessionId) => {
			await api.post(
				`/mentor/mulai-sesi/${sessionId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		},
		onSuccess: async () => {
			// 🔄 Refetch queries dan tunggu selesai
			await queryClient.refetchQueries(["mentorSessions"]);

			// 🔄 Transaksi refresh tanpa await (gak penting di halaman ini)
			queryClient.refetchQueries(["mentorTransactions"]);

			// ✅ Success message setelah data fresh
			toast.success("Sesi berhasil dimulai!");
		},
		onError: () => {
			Swal.fire("Gagal", "Terjadi kesalahan saat memulai sesi.", "error");
		},
	});
	const handleStartSession = (sessionId) => {
		setStartingSessionId(sessionId);
		Swal.fire({
			title: "Mulai Sesi",
			text: "Apakah Anda yakin ingin memulai sesi ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, mulai!",
		}).then((result) => {
			if (result.isConfirmed) {
				startSessionMutation.mutate(sessionId);
			} else {
				setStartingSessionId(null);
			}
		});
	};

	// Mutasi untuk mengakhiri sesi
	const endSessionMutation = useMutation({
		mutationFn: async (sessionId) => {
			await api.post(
				`/mentor/selesai-sesi/${sessionId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		},
		onSuccess: async () => {
			// 🔄 Tunggu data sesi refresh selesai (yang penting)
			await queryClient.refetchQueries(["mentorSessions"]);

			// 🔄 Transaksi refresh tanpa await (gak penting di halaman ini)
			queryClient.refetchQueries(["mentorTransactions"]);

			// ✅ Success message setelah data sesi fresh
			toast.success("Sesi berhasil diakhiri!");
		},
		onError: () => {
			Swal.fire("Gagal", "Terjadi kesalahan saat mengakhiri sesi.", "error");
		},
	});
	const handleEndSession = (sessionId) => {
		setEndingSessionId(sessionId);
		Swal.fire({
			title: "Apakah Anda yakin ingin mengakhiri sesi ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, akhiri!",
		}).then((result) => {
			if (result.isConfirmed) {
				endSessionMutation.mutate(sessionId);
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
			class:
				"inline-flex items-center rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-green-600/20 ring-inset",
		},
		pending: {
			label: "Pending",
			class:
				"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
		},
		started: {
			label: "Sedang Dimulai",
			class:
				"inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
		},
		end: {
			label: "Selesai",
			class:
				"inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
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
					<span className={`${status.class}`}>{status.label}</span>
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
					isLoadingSessions ||
					isLoadingTransactions ||
					!!endingSessionId ||
					(!!startingSessionId && startingSessionId !== row.id);
				const disableEnd =
					isLoadingSessions ||
					isLoadingTransactions ||
					!!startingSessionId ||
					(!!endingSessionId && endingSessionId !== row.id);

				// styles untuk tombol
				const btnBase =
					"flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-all min-w-[110px]";
				const startClasses = `${btnBase} bg-green-600 hover:bg-green-700 text-white`;
				const endClasses = `${btnBase} bg-red-600 hover:bg-red-700 text-white`;
				const disabledClass = "opacity-50 cursor-not-allowed";

				return (
					<div className="gap-2">
						{(row.statusSesi === "booked" || row.statusSesi === "pending") && (
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
						{row.statusSesi === "started" && (
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
					</div>
				);
			},
			width: "180px",
		},
	];

	const [previewImg, setPreviewImg] = React.useState(null);

	if (errorSessions || errorTransactions) {
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

	// Filter transaksi yang statusPembayaran === "accepted"
	const acceptedTransactions = transactions.filter(
		(transaction) => transaction.statusPembayaran === "accepted"
	);

	// Filter sesi yang memiliki transaksi dengan status "accepted"
	const filteredSessions = sessions.filter((session) =>
		acceptedTransactions.some(
			(transaction) => transaction.sesi_id === session.id
		)
	);

	// Sorting sesi terbaru di paling atas
	const sortedSessions = [...filteredSessions].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	// filter pencarian dengan filteredSessions
	const filteredData = sortedSessions.filter((session) => {
		const lower = searchTerm.toLowerCase();
		const mode = session.jadwal_kursus?.gayaMengajar || "";
		return (
			session.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
			session.kursus?.namaKursus?.toLowerCase().includes(lower) ||
			mode.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
					My Sessions Schedules
				</h1>
				<p className="text-gray-600">Daftar Jadwal Sesi Saya</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Sesi</h2>
				</div>
				{isLoadingSessions || isLoadingTransactions ? (
					<div className="flex justify-center py-20">
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
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>
						<DataTable
							columns={columns}
							data={filteredData}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-3 bg-gray-50 rounded-md">
									<p className="flex">
										<span className="w-10 font-medium text-gray-900 mb-2">
											Topik:
										</span>
										<span className="text-gray-500 ml-2">
											{data.detailKursus || "-"}
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Jadwal:
										</span>
										<span className="capitalize">
											{data.jadwal_kursus?.tanggal || "-"}
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">Jam:</span>
										<span className="capitalize">
											{data.jadwal_kursus?.waktu?.slice(0, 5) || "-"} WIB
										</span>
									</p>
									{data.jadwal_kursus?.gayaMengajar === "offline" && (
										<p className="flex">
											<span className="w-48 font-medium text-gray-900">
												Lokasi:
											</span>
											<span className="capitalize mb-5">
												{data.jadwal_kursus?.tempat || "-"}
											</span>
										</p>
									)}

									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Paket Belajar:
										</span>
										<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
											{data.paket?.nama || "-"}
										</span>
									</p>

									{/* Tampilkan item-item dari paket jika ada (paket.items) */}
									{data.paket?.items && data.paket.items.length > 0 ? (
										<div className="mt-2">
											<span className="w-48 font-medium text-gray-900 block mb-2">
												Layanan yang termasuk:
											</span>
											<ul className="list-disc list-inside text-gray-600 space-y-1">
												{data.paket.items.map((item, idx) => {
													const label = item.nama || "-";
													const desc = item.deskripsi || null;
													return (
														<li key={idx} className="text-sm">
															<span className="font-medium text-gray-800">
																{label}
															</span>
															{desc ? (
																<span className="ml-2 text-gray-500">
																	— {desc}
																</span>
															) : null}
														</li>
													);
												})}
											</ul>
										</div>
									) : (
										<div className="mt-2 text-gray-500 text-sm">
											Tidak ada item di paket ini
										</div>
									)}
								</div>
							)}
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
