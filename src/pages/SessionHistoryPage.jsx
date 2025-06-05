import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, Monitor, MapPin, DollarSign } from "lucide-react";
import api from "../api";
import { TestimoniModal } from "../components/TestimoniModal";

export function SessionHistoryPage({ userData, onPaymentSubmit }) {
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedSession, setSelectedSession] = useState(null);
	const [updatingSessionId, setUpdatingSessionId] = useState(null);
	const [showTestimoniModal, setShowTestimoniModal] = useState(false);
	const [testimoniSession, setTestimoniSession] = useState(null);
	const queryClient = useQueryClient();

	const pelangganId = userData?.pelanggan?.id;

	const {
		data: sessions = [],
		isLoading: loadingSessions,
		error: errorSessions,
	} = useQuery({
		queryKey: ["pelangganSessions", pelangganId],
		queryFn: async () => {
			const res = await api.get("/pelanggan/daftar-sesi");
			return res.data;
		},
		enabled: !!pelangganId,
	});

	const {
		data: transactions = [],
		isLoading: loadingTransactions,
		error: errorTransactions,
	} = useQuery({
		queryKey: ["pelangganTransactions", pelangganId],
		queryFn: async () => {
			const res = await api.get("/transaksi");
			return res.data.filter((t) => t.pelanggan_id === pelangganId);
		},
		enabled: !!pelangganId,
	});

	// Ambil transaksi yang statusnya "accepted"
	const acceptedTransactions = transactions.filter(
		(trx) => trx.statusPembayaran === "accepted"
	);

	// Filter sesi yang hanya punya transaksi accepted
	const filteredSessions = sessions.filter((sesi) =>
		acceptedTransactions.some((trx) => trx.sesi_id === sesi.id)
	);

	const history = useMemo(() => {
		if (!sessions.length) return [];
		// Filter hanya sesi yang sudah pembayaran accepted
		const acceptedTransactions = transactions.filter(
			(trx) => trx.statusPembayaran === "accepted"
		);
		const filteredSessions = sessions.filter((sesi) =>
			acceptedTransactions.some((trx) => trx.sesi_id === sesi.id)
		);
		return filteredSessions.map((sesi) => {
			const transaksi = transactions.find((t) => t.sesi_id === sesi.id);
			const jadwal = sesi.jadwal_kursus || sesi.jadwalKursus;
			const sudahTestimoni = sesi.testimoni || sesi.statusSesi === "reviewed";
			const statusSesi = sesi.statusSesi || "-";
			return {
				id: sesi.id,
				course: sesi.kursus?.namaKursus || "-",
				mentor: sesi.mentor?.user?.nama || "-",
				mentor_id: sesi.mentor?.id || null,
				date: jadwal?.tanggal || "-",
				time: jadwal?.waktu?.slice(0, 5) || "-",
				mode: sesi.kursus?.gayaMengajar || "-",
				topic: sesi.detailKursus || "No Topic Specified",
				location: jadwal?.tempat || "-",
				status: statusSesi,
				amount: sesi.mentor?.biayaPerSesi || 0,
				paymentDate: transaksi?.tanggalPembayaran || null,
				transaksiId: transaksi?.id,
				sudahTestimoni,
				statusSesi,
			};
		});
	}, [sessions, transactions]);
	const getStatusStyle = (status) => {
		switch (status) {
			case "pending":
				return "bg-gray-200 text-gray-700"; // sesi belum dimulai
			case "started":
				return "bg-blue-100 text-blue-800"; // sesi sedang berlangsung
			case "end":
				return "bg-yellow-100 text-yellow-800"; // sesi telah selesai
			case "reviewed":
				return "bg-green-100 text-green-800"; // sesi telah direview
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "pending":
				return "Belum Dimulai";
			case "started":
				return "Sedang Berlangsung";
			case "end":
				return "Selesai";
			case "reviewed":
				return "Sudah Direview";
			default:
				return status;
		}
	};

	const handleOpenTestimoni = (session) => {
		setTestimoniSession({
			id: session.id,
			sesi_id: session.id, // untuk jaga-jaga
			pelanggan_id: userData?.pelanggan?.id,
			mentor_id: session.mentor_id,
		});
		setShowTestimoniModal(true);
	};

	const handleSubmitTestimoni = async ({ rating, komentar }) => {
		// Hanya kirim request, biar modal yang handle SweetAlert
		await api.post(`/pelanggan/beri-testimoni/${testimoniSession.id}`, {
			rating,
			komentar,
		});
		// Refetch sessions & transactions agar tombol langsung hilang
		queryClient.invalidateQueries(["pelangganSessions", pelangganId]);
		queryClient.invalidateQueries(["pelangganTransactions", pelangganId]);
		setShowTestimoniModal(false);
		setTestimoniSession(null);
	};

	useEffect(() => {
		if (!updatingSessionId) return;
		const updatedSession = history.find((s) => s.id === updatingSessionId);
		if (
			updatedSession &&
			updatedSession.status !== "pending_payment" &&
			updatedSession.status !== "rejected"
		) {
			setUpdatingSessionId(null);
		}
	}, [history, updatingSessionId]);

	const isLoading = loadingSessions || loadingTransactions;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<Calendar className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
				<h3 className="text-lg font-semibold mb-2 animate-pulse">
					Memuat riwayat...
				</h3>
			</div>
		);
	}

	if (errorSessions || errorTransactions) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-red-600">
				<p>Gagal memuat data. Silakan coba lagi.</p>
			</div>
		);
	}

	if (history.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<Calendar className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Tidak Ada Riwayat Sesi</h3>
				<p className="text-gray-500 mb-4 text-center">
					Anda belum memiliki riwayat sesi. Pesan sesi untuk memulai!
				</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Sesi</h2>
			<div className="space-y-4">
				{history.map((session) => (
					<div
						key={session.id}
						className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
						<div className="flex justify-between items-start mb-4">
							<div>
								<h3 className="text-lg font-semibold text-gray-900">
									{session.course}
								</h3>
								<p className="text-gray-600">dengan {session.mentor}</p>
							</div>
							{updatingSessionId === session.id ? (
								<div className="flex items-center text-blue-500">
									<svg
										className="animate-spin h-5 w-5 mr-2"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v8z"></path>
									</svg>
									Memperbarui...
								</div>
							) : session.status === "started" ? (
								<span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-red-600 rounded-full text-sm font-medium">
									<span className="relative flex h-3 w-3">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
									</span>
									On Going
								</span>
							) : (
								<span
									className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
										session.status
									)}`}>
									{getStatusText(session.status)}
								</span>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<div className="flex items-center text-gray-600">
								<Calendar className="w-4 h-4 mr-2 text-blue-600" />
								{new Date(session.date).toLocaleDateString("id-ID", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}{" "}
							</div>
							<div className="flex items-center text-gray-600">
								<Clock className="w-4 h-4 mr-2 text-blue-600" />
								Jam Mulai: {session.time}
							</div>
							<div className="flex items-center text-gray-600">
								{session.mode === "offline" ? (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
										Sesi Offline
									</span>
								) : (
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
										Sesi Online
									</span>
								)}
							</div>
							{session.mode === "offline" && (
								<div className="flex items-center text-gray-600">
									<MapPin className="w-4 h-4 mr-2 text-blue-600" />
									Lokasi: {session.location}
								</div>
							)}
						</div>
						<div className="border-t pt-4 mt-4">
							<div className="flex items-center justify-between text-gray-600">
								<div className="flex items-center"></div>
								<div className="flex items-center gap-2">
									{!session.sudahTestimoni && session.statusSesi === "end" && (
										<button
											className="ml-4 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"
											onClick={() => handleOpenTestimoni(session)}>
											Beri Testimoni
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Hapus PaymentModal dari halaman ini, hanya TestimoniModal yang tersisa */}
			{showTestimoniModal && testimoniSession && (
				<TestimoniModal
					isOpen={showTestimoniModal}
					onClose={() => {
						setShowTestimoniModal(false);
						setTestimoniSession(null);
					}}
					onSubmit={handleSubmitTestimoni}
					session={testimoniSession}
				/>
			)}
		</div>
	);
}
