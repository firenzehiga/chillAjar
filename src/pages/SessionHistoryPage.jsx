import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Calendar,
	Clock,
	MapPin,
	Loader2,
	ChevronDown,
	CheckCircle,
	AlertCircle,
	XCircle,
	Filter,
	Search,
	X,
	Monitor,
} from "lucide-react";
import { MdRateReview } from "react-icons/md";
import api from "../api";
import useAppStore from "../stores/useAppStore";

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

export function SessionHistoryPage({ userData }) {
	const [updatingSessionId, setUpdatingSessionId] = useState(null);
	const [filters, setFilters] = useState({
		status: "",
		mode: "",
		dateRange: "",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	// Filter options
	const statusOptions = [
		{ value: "", label: "Semua Status", icon: null },
		{ value: "pending", label: "Belum Dimulai", icon: Clock },
		{ value: "started", label: "Sedang Berlangsung", icon: AlertCircle },
		{ value: "end", label: "Selesai", icon: CheckCircle },
		{ value: "reviewed", label: "Sudah Direview", icon: XCircle },
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

	// Get testimoni state from store
	const { openTestimoniModal, isSubmittingTestimoni } = useAppStore();

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

	// 1. Filter transaksi yang statusnya "accepted"
	// Hanya ambil transaksi yang sudah pembayaran diterima
	const acceptedTransactions = transactions.filter(
		(trx) => trx.statusPembayaran === "accepted"
	);

	// 2. Filter sesi yang hanya punya transaksi accepted
	// Hanya ambil sesi yang sudah dibayar (sudah ada transaksi accepted)
	const filteredSessions = sessions.filter((sesi) =>
		acceptedTransactions.some((trx) => trx.sesi_id === sesi.id)
	);

	// 3. Mapping & transform data sesi untuk kebutuhan tampilan (history)
	// Di sini juga bisa dibilang "filter", karena hanya sesi hasil filter di atas yang di-mapping
	const history = useMemo(() => {
		if (!sessions.length) return [];
		// Ulangi filter accepted agar data selalu sinkron
		const acceptedTransactions = transactions.filter(
			(trx) => trx.statusPembayaran === "accepted"
		);
		const filteredSessions = sessions.filter((sesi) =>
			acceptedTransactions.some((trx) => trx.sesi_id === sesi.id)
		);
		// Mapping ke bentuk yang siap dipakai di UI
		return filteredSessions.map((sesi) => {
			const transaksi = transactions.find((t) => t.sesi_id === sesi.id);
			const jadwal = sesi.jadwal_kursus || sesi.jadwalKursus;
			const sudahTestimoni = sesi.testimoni || sesi.statusSesi === "reviewed";
			const statusSesi = sesi.statusSesi || "-";
			const mode = jadwal?.gayaMengajar || "-";
			return {
				id: sesi.id,
				course: sesi.kursus?.namaKursus || "-",
				mentor: sesi.mentor?.user?.nama || "-",
				mentor_id: sesi.mentor?.id || null,
				date: jadwal?.tanggal || "-",
				time: jadwal?.waktu?.slice(0, 5) || "-",
				mode: mode,
				topic: sesi.detailKursus || "No Topic Specified",
				location: jadwal?.tempat || "-",
				status: statusSesi,
				amount: sesi.mentor?.biayaPerSesi || 0,
				paymentDate: transaksi?.tanggalPembayaran || null,
				transaksiId: transaksi?.id,
				sudahTestimoni,
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
		const dateA = new Date(a.created_at || a.date);
		const dateB = new Date(b.created_at || b.date);
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
				return "Reviewed";
			default:
				return status;
		}
	};

	const handleOpenTestimoni = (session) => {
		const testimoniData = {
			id: session.id,
			sesi_id: session.id, // untuk jaga-jaga
			pelanggan_id: userData?.pelanggan?.id,
			mentor_id: session.mentor_id,
		};
		openTestimoniModal(testimoniData);
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
		<div className="py-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						Riwayat Sesi
					</h2>
					<p className="text-gray-600 mt-1">
						Kelola dan lihat riwayat sesi pembelajaran Anda
					</p>
				</div>

				<div className="flex items-center space-x-3">
					<div className="text-sm text-gray-500">
						{sortedFilteredHistory.length} dari {history.length} sesi
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
								Filter Sesi
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
									Status
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

			{/* Session Cards */}
			<div className="space-y-4">
				{sortedFilteredHistory.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Calendar className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							Tidak ada sesi ditemukan
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
									) : session.mode === "online" ? (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											Sesi Online
										</span>
									) : (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											Data mode tidak valid
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
										{!session.sudahTestimoni &&
											session.statusSesi === "end" && (
												<button
													className={`ml-4 px-4 py-2 rounded-lg text-white transition-colors ${
														isSubmittingTestimoni
															? "bg-yellow-200 cursor-not-allowed"
															: "bg-yellow-500 hover:bg-yellow-600"
													}`}
													onClick={() => handleOpenTestimoni(session)}
													disabled={isSubmittingTestimoni}>
													{isSubmittingTestimoni ? (
														<span className="flex items-center">
															<Loader2 className="animate-spin h-4 w-4 mr-2" />
															Sedang mengirim...
														</span>
													) : (
														<span>
															Beri Testimoni
															<MdRateReview className="inline-block ml-1 mb-1" />
														</span>
													)}
												</button>
											)}
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
