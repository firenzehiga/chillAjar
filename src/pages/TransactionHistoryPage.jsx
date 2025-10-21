import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePelangganSessionsTransactionQuery } from "@/hooks/useSessions"; // Import hook baru
import {
	Calendar,
	Clock,
	Monitor,
	MapPin,
	DollarSign,
	ChevronDown,
	CheckCircle,
	AlertCircle,
	XCircle,
	Filter,
	Search,
	X,
	Loader2,
} from "lucide-react";
import api from "@/api";
import { PaymentModal } from "@/components/PaymentModal";
import { BookLoader } from "@/components/User/BookLoader";

import useAppStore from "@/stores/useAppStore";

// Custom Select Component
const CustomSelect = ({
	value,
	onChange,
	options,
	placeholder,
	icon: Icon,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 group">
				<div className="flex items-center space-x-3">
					{Icon && (
						<Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
					)}
					<span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
				</div>
				<ChevronDown
					className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
						<div className="max-h-60 overflow-y-auto">
							{options.map((option) => (
								<button
									key={option.value}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
									className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 ${
										value === option.value
											? "bg-blue-50 text-blue-600 font-medium"
											: "text-gray-700"
									}`}>
									{option.icon && <option.icon className="w-4 h-4" />}
									<span>{option.label}</span>
									{value === option.value && (
										<CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
									)}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default function TransactionHistoryPage({ userData, onPaymentSubmit }) {
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedSession, setSelectedSession] = useState(null);
	const updatingSessionId = useAppStore((s) => s.updatingSessionId);
	const setUpdatingSessionId = useAppStore((s) => s.setUpdatingSessionId);
	const [filters, setFilters] = useState({
		status: "",
		mode: "",
		dateRange: "",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	// Filter options for transaction history
	const statusOptions = [
		{ value: "", label: "Semua Status", icon: null },
		{ value: "pending_payment", label: "Menunggu Pembayaran", icon: Clock },
		{
			value: "waiting_verification",
			label: "Menunggu Verifikasi",
			icon: AlertCircle,
		},
		{ value: "accepted", label: "Disetujui", icon: CheckCircle },
		{ value: "rejected", label: "Ditolak", icon: XCircle },
	];

	const modeOptions = [
		{ value: "", label: "Semua Mode", icon: null },
		{ value: "online", label: "Online", icon: Monitor },
		{ value: "offline", label: "Offline", icon: MapPin },
	];

	const dateRangeOptions = [
		{ value: "", label: "Semua Waktu", icon: null },
		{ value: "today", label: "Hari Ini", icon: Calendar },
		{ value: "week", label: "7 Hari Terakhir", icon: Calendar },
		{ value: "month", label: "30 Hari Terakhir", icon: Calendar },
		{ value: "year", label: "Tahun Ini", icon: Calendar },
	];

	const queryClient = useQueryClient();

	const pelangganId = userData?.pelanggan?.id;

	const {
		data: sessions = [],
		isLoading: loadingSessions,
		error: errorSessions,
	} = usePelangganSessionsTransactionQuery(pelangganId);

	const {
		data: transactions = [],
		isLoading: loadingTransactions,
		error: errorTransactions,
	} = useQuery({
		queryKey: ["transactions", pelangganId],
		queryFn: async () => {
			const res = await api.get("/transaksi");
			return res.data.filter((t) => t.pelanggan_id === pelangganId);
		},
		enabled: !!pelangganId,
	});

	const history = useMemo(() => {
		if (!sessions.length) return [];
		return sessions.map((sesi) => {
			const transaksi = transactions.find((t) => t.sesi_id === sesi.id);
			const jadwal = sesi.jadwal_kursus || sesi.jadwalKursus;
			// Ambil status sesi (bukan status pembayaran)
			const statusSesi = sesi.status || sesi.statusSesi || "-";
			// Gunakan gayaMengajar dari jadwal_kursus
			const mode = jadwal?.gayaMengajar || "-";
			return {
				id: sesi.id,
				course: sesi.kursus?.namaKursus || "-",
				mentor: sesi.mentor?.user?.nama || "-",
				mentor_id: sesi.mentor?.id || null,
				paketNama: transaksi?.paket?.nama || sesi.paket?.nama || "-",
				paket: transaksi?.paket || sesi.paket || null,
				biayaPerSesi: sesi.mentor?.biayaPerSesi || 0,
				date: jadwal?.tanggal || "-",
				time: jadwal?.waktu.slice(0, 5) || "-",
				mode: mode,
				topic: sesi.detailKursus || "No Topic Specified",
				location: jadwal?.tempat || "-",
				status: transaksi
					? transaksi.statusPembayaran === "menunggu_verifikasi"
						? "waiting_verification"
						: transaksi.statusPembayaran === "accepted"
						? "accepted"
						: transaksi.statusPembayaran === "rejected"
						? "rejected"
						: "pending_payment"
					: "pending_payment",
				// Untuk status 'pending_payment', gunakan jumlahSementara dari sesi (hasil perhitungan backend).
				// Jika transaksi sudah ada, gunakan transaksi.jumlah.
				// Jika transaksi sudah ada, gunakan transaksi.jumlah.
				amount: (() => {
					// Prioritas 1: Gunakan jumlah dari transaksi jika ada (Kepake kalau transaksi udah dilakukan)
					if (transaksi?.jumlah !== undefined) {
						return transaksi.jumlah;
					}

					// Prioritas 2: Gunakan jumlahSementara jika ada dan valid (kepake kalau bayarnya nanti)
					if (sesi.jumlahSementara && sesi.jumlahSementara > 0) {
						return sesi.jumlahSementara;
					}
				})(),
				// preserve backend temporary amount if present on sesi
				jumlahSementara: sesi.jumlahSementara ?? null,
				// preserve paket id if available so payment flow can send paket_id
				paket_id:
					sesi.paket_id ?? transaksi?.paket_id ?? sesi.paket?.id ?? null,
				paymentDate: transaksi?.tanggalPembayaran || null,
				transaksiId: transaksi?.id,
				statusSesi,
				created_at: transaksi?.created_at || sesi.created_at || "-",
			};
		});
	}, [sessions, transactions]);

	// Comprehensive filtering with search and multiple filters
	const filteredHistory = useMemo(() => {
		return history.filter((session) => {
			const matchesSearch =
				session.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
				session.mentor.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus =
				!filters.status || session.status === filters.status;
			const matchesMode = !filters.mode || session.mode === filters.mode;

			// Simple date filtering
			let matchesDate = true;
			if (filters.dateRange) {
				const sessionDate = new Date(session.date);
				const now = new Date();

				switch (filters.dateRange) {
					case "today":
						matchesDate = sessionDate.toDateString() === now.toDateString();
						break;
					case "week":
						const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
						matchesDate = sessionDate >= weekAgo;
						break;
					case "month":
						const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
						matchesDate = sessionDate >= monthAgo;
						break;
					case "year":
						matchesDate = sessionDate.getFullYear() === now.getFullYear();
						break;
				}
			}

			return matchesSearch && matchesStatus && matchesMode && matchesDate;
		});
	}, [history, searchQuery, filters]);

	// Sorting
	const sortedFilteredHistory = [...filteredHistory].sort((a, b) => {
		const dateA = new Date(a.created_at);
		const dateB = new Date(b.created_at);
		return dateB - dateA;
	});

	// Filter change handlers
	const handleFilterChange = (filterType, value) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value,
		}));
	};

	const clearAllFilters = () => {
		setFilters({
			status: "",
			mode: "",
			dateRange: "",
		});
		setSearchQuery("");
	};

	const activeFiltersCount =
		Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

	const getStatusStyle = (status) => {
		switch (status) {
			case "waiting_verification":
				return "bg-yellow-100 text-yellow-800";
			case "accepted":
				return "bg-green-100 text-green-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			case "pending_payment":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case "waiting_verification":
				return "Menunggu Verifikasi";
			case "accepted":
				return "Disetujui";
			case "rejected":
				return "Ditolak";
			case "pending_payment":
				return "Menunggu Pembayaran";
			default:
				return status;
		}
	};

	const handleContinuePayment = (session) => {
		setSelectedSession(session);
		setShowPaymentModal(true);
	};

	const handlePaymentFromHistory = async (data) => {
		setUpdatingSessionId(selectedSession.id);
		await onPaymentSubmit({
			...data,
			transaksiId: selectedSession.transaksiId, // Sertakan transaksiId untuk update
		});
		setShowPaymentModal(false);
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
	}, [history, updatingSessionId, setUpdatingSessionId]);

	const isLoading = loadingTransactions || loadingSessions;
	const isError = errorTransactions || errorSessions;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600 mb-10">
				<BookLoader message="Memuat transaksi" />
			</div>
		);
	}

	if (isError) {
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
				<h3 className="text-lg font-semibold mb-2">
					Tidak Ada Riwayat Transaksi
				</h3>
				<p className="text-gray-500 mb-4 text-center">
					Anda belum memiliki riwayat transaksi. Silakan lakukan pemesanan sesi
					untuk memulai!
				</p>
			</div>
		);
	}

	return (
		<div className="py-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						Riwayat Transaksi
					</h2>
					<p className="text-gray-600 mt-1">
						Kelola dan lihat riwayat transaksi pembayaran Anda
					</p>
				</div>

				<div className="flex items-center space-x-3">
					<div className="text-sm text-gray-500">
						{sortedFilteredHistory.length} dari {history.length} transaksi
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`outline-none focus:outline-yellow-500 relative flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
							showFilters
								? "bg-yellow-50 border-yellow-400 text-yellow-700"
								: "bg-white border-gray-200 text-gray-700 hover:border-yellow-300"
						}`}>
						<Filter className="w-4 h-4" />
						<span>Filter</span>
						{activeFiltersCount > 0 && (
							<span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
								{activeFiltersCount}
							</span>
						)}
					</button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="space-y-4">
				{/* Search Bar */}
				<div className="relative">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
					<input
						type="text"
						placeholder="Cari berdasarkan nama kursus atau mentor..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
							<X className="h-5 w-5" />
						</button>
					)}
				</div>

				{/* Filter Panel */}
				{showFilters && (
					<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-900">
								Filter Transaksi
							</h3>
							{activeFiltersCount > 0 && (
								<button
									onClick={clearAllFilters}
									className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
									Hapus Semua Filter
								</button>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Status Pembayaran
								</label>
								<CustomSelect
									value={filters.status}
									onChange={(value) => handleFilterChange("status", value)}
									options={statusOptions}
									placeholder="Pilih Status"
									icon={AlertCircle}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Mode Sesi
								</label>
								<CustomSelect
									value={filters.mode}
									onChange={(value) => handleFilterChange("mode", value)}
									options={modeOptions}
									placeholder="Pilih Mode"
									icon={Monitor}
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Periode
								</label>
								<CustomSelect
									value={filters.dateRange}
									onChange={(value) => handleFilterChange("dateRange", value)}
									options={dateRangeOptions}
									placeholder="Pilih Periode"
									icon={Calendar}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Active Filters Display */}
			{activeFiltersCount > 0 && (
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-sm text-gray-600">Filter aktif:</span>
					{searchQuery && (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Pencarian: "{searchQuery}"
							<button
								onClick={() => setSearchQuery("")}
								className="ml-2 hover:text-blue-600">
								<X className="w-3 h-3" />
							</button>
						</span>
					)}
					{Object.entries(filters).map(([key, value]) => {
						if (!value) return null;
						const option = (
							key === "status"
								? statusOptions
								: key === "mode"
								? modeOptions
								: dateRangeOptions
						).find((opt) => opt.value === value);
						return (
							<span
								key={key}
								className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								{option?.label}
								<button
									onClick={() => handleFilterChange(key, "")}
									className="ml-2 hover:text-blue-600">
									<X className="w-3 h-3" />
								</button>
							</span>
						);
					})}
				</div>
			)}

			{/* Transaction Cards */}
			<div className="space-y-4">
				{sortedFilteredHistory.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<DollarSign className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Tidak ada transaksi ditemukan
						</h3>
						<p className="text-gray-500 mb-4">
							Coba ubah filter atau kata kunci pencarian Anda
						</p>
						{activeFiltersCount > 0 && (
							<button
								onClick={clearAllFilters}
								className="text-blue-600 hover:text-blue-700 font-medium">
								Hapus semua filter
							</button>
						)}
					</div>
				) : (
					sortedFilteredHistory.map((session) => (
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
									<div
										className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100 shadow-sm"
										role="status"
										aria-live="polite">
										<Loader2 className="animate-spin h-4 w-4 text-blue-600" />
										<span className="text-sm font-medium">
											Memperbarui status
										</span>
									</div>
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
									{session.mode === "online" ? (
										<Monitor className="w-4 h-4 mr-2 text-blue-600" />
									) : session.mode === "offline" ? (
										<MapPin className="w-4 h-4 mr-2 text-blue-600" />
									) : (
										<MapPin className="w-4 h-4 mr-2 text-blue-600" />
									)}
									{session.mode === "online"
										? "Sesi Online"
										: session.mode === "offline"
										? "Sesi Offline"
										: "Data mode tidak valid"}
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
									<div className="flex items-center">
										<DollarSign className="w-4 h-4 mr-2 text-blue-600" />
										Total Harga: Rp
										{(session.amount || 0).toLocaleString("id-ID")} |{" "}
										{session.paketNama}{" "}
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm">
											Tanggal Pembayaran:{" "}
											{session.paymentDate
												? new Date(session.paymentDate).toLocaleDateString(
														"id-ID",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														}
												  )
												: "-"}
										</span>
									</div>
								</div>
								{session.status === "waiting_verification" && (
									<div className="mt-4 bg-yellow-50 p-4 rounded-lg">
										<p className="text-yellow-800 text-sm">
											Pembayaran Anda sedang diverifikasi. Proses ini biasanya
											memakan waktu 1-2 jam kerja. Kami akan memberi notifikasi
											setelah verifikasi selesai.
										</p>
									</div>
								)}
								{session.status === "accepted" && (
									<div className="mt-4 bg-green-50 p-4 rounded-lg">
										<p className="text-green-800 text-sm">
											Pembayaran Anda diterima. Silakan tunggu mentor untuk
											memulai sesi.
										</p>
									</div>
								)}

								{session.status === "rejected" &&
									updatingSessionId !== session.id && (
										<div className="mt-4 bg-red-50 p-4 rounded-lg">
											<p className="text-red-800 text-sm mb-3">
												Pembayaran Anda ditolak. Silakan kirim ulang bukti
												pembayaran yang valid.
											</p>
											<button
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
												onClick={() => handleContinuePayment(session)}>
												Kirim Ulang Bukti
											</button>
										</div>
									)}
								{session.status === "pending_payment" &&
									updatingSessionId !== session.id && (
										<div className="mt-4">
											<button
												className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
												onClick={() => handleContinuePayment(session)}>
												Selesaikan Pembayaran
											</button>
										</div>
									)}
							</div>
						</div>
					))
				)}
			</div>

			{/* Simulasi PaymentModal */}
			{showPaymentModal && selectedSession && (
				<PaymentModal
					booking={{
						course: {
							courseName: selectedSession.course,
							price_per_hour: selectedSession.amount,
						},
						mentor: { mentorName: selectedSession.mentor },
						date: selectedSession.date,
						time: selectedSession.time,
						mode: selectedSession.mode,
						location: selectedSession.location,
						topic: selectedSession.topic,
						paket: selectedSession.paket
							? {
									...selectedSession.paket,
									// Pastikan data paket lengkap dari session
									id: selectedSession.paket.id,
									name: selectedSession.paket.nama,
									diskon: selectedSession.paket.diskon ?? 0,
									items: Array.isArray(selectedSession.paket.items)
										? selectedSession.paket.items.map((item) => ({
												...item,
												diskon: item.diskon ?? 0, // fallback ke 0 jika undefined/null
										  }))
										: [],
							  }
							: null,
						// prefer explicit paket_id from session (history mapping) if available
						paket_id:
							(selectedSession.paket_id ?? selectedSession.paket?.id) || null,
						// Gunakan jumlahSementara dari sesi jika ada, jika tidak fallback ke amount
						jumlahSementara:
							selectedSession.jumlahSementara ?? selectedSession.amount,
						sesi: {
							// tambahkan sesi jika perlu id untuk transaksi
							id: selectedSession.id,
							pelanggan_id: userData?.pelanggan?.id,
							mentor_id: selectedSession.mentor_id, // pastikan ada
						},
					}}
					mentor={{
						mentorName: selectedSession?.mentor || "-",
						biayaPerSesi: selectedSession?.biayaPerSesi || 0,
					}}
					onClose={() => setShowPaymentModal(false)}
					onSubmit={handlePaymentFromHistory}
				/>
			)}
		</div>
	);
}
