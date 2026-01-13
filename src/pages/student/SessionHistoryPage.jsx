import { useMemo, useState, useEffect } from "react";
import { usePelangganSessionsQuery } from "@/hooks/useSessions";
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
	Eye,
	User,
} from "lucide-react";
import { MdRateReview } from "react-icons/md";
import useAppStore from "@/stores/useAppStore";
import { BookLoader } from "@/components/ui/BookLoader";
import { formatDateDay } from "@/utils/dateFormatter";
import Pagination from "@/components/ui/Pagination";
import {
	getSessionEndTime,
	getSessionStatusStyle,
	getSessionStatusText,
} from "@/utils/helpers";


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
					className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
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
									className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 ${value === option.value
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

export default function SessionHistoryPage({ userData, onNavigate }) {
	// use global updatingSessionId from store so other components (modal/handlers) can set it
	const updatingSessionId = useAppStore((s) => s.updatingSessionId);
	const setUpdatingSessionId = useAppStore((s) => s.setUpdatingSessionId);
	const [filters, setFilters] = useState({
		status: "",
		mode: "",
		dateRange: "",
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 5;

	// Handler to navigate to session detail page
	const handleViewDetail = (sessionId) => {
		onNavigate(`session-detail/${sessionId}`);
	};

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
	const pelangganId = userData?.pelanggan?.id;

	const {
		data: sessions = [],
		isLoading: loadingSessions,
		error: errorSessions,
	} = usePelangganSessionsQuery(pelangganId);

	// NOTE: backend now returns only sesi yang memiliki transaksi dengan status 'accepted'
	// jadi kita tidak perlu lagi melakukan fetch /transaksi dan filter ulang di frontend.

	// 3. Mapping & transform data sesi untuk kebutuhan tampilan (history)
	// Di sini juga bisa dibilang "filter", karena hanya sesi hasil filter di atas yang di-mapping
	const history = useMemo(() => {
		if (!sessions.length) return [];
		// Backend already filters sesi to those with accepted transaksi. If the backend
		// also includes transaksi data inside setiap sesi (sesi.transaksi), prefer that.
		return sessions.map((sesi) => {
			// sesi.transaksi mungkin disertakan oleh backend. Karena backend sudah
			// mem-filter sesi yang memiliki transaksi dengan status 'accepted', kita
			// cukup ambil transaksi pertama jika berupa array atau gunakan objeknya
			// langsung. Jika tidak disertakan, transaksi akan null.

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
				paymentDate: sesi.transaksi?.tanggalPembayaran || null,
				transaksiId: sesi.transaksi?.id || null,
				sudahTestimoni,
				statusSesi,
				created_at: sesi.transaksi?.created_at || sesi.created_at || "-",
			};
		});
	}, [sessions]);

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

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, filters]);

	// Sorting
	const sortedFilteredHistory = [...filteredHistory].sort((a, b) => {
		const dateA = new Date(a.created_at || a.date);
		const dateB = new Date(b.created_at || b.date);
		return dateB - dateA;
	});

	// Pagination
	const totalPages = Math.ceil(sortedFilteredHistory.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedHistory = sortedFilteredHistory.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

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

	const handleOpenTestimoni = (session) => {
		const testimoniData = {
			id: session.id,
			sesi_id: session.id, // untuk jaga-jaga
			pelanggan_id: userData?.pelanggan?.id,
			mentor_id: session.mentor_id,
		};
		openTestimoniModal(testimoniData);
	};

	// updatingSessionId is managed by the action that performs the update (submit/payment).
	// SessionHistoryPage only reads it to show the "Memperbarui..." indicator.

	useEffect(() => {
		if (!updatingSessionId) return;
		const updatedSession = history.find((s) => s.id === updatingSessionId);
		// If the session now has a testimoni or statusSesi is 'reviewed', consider update finished
		if (
			updatedSession &&
			(updatedSession.sudahTestimoni ||
				updatedSession.statusSesi === "reviewed")
		) {
			setUpdatingSessionId(null);
			return;
		}
		// As a fallback, if the session is not present in history anymore, clear the flag
		if (!updatedSession) {
			setUpdatingSessionId(null);
		}
	}, [history, updatingSessionId, setUpdatingSessionId]);

	const isLoading = loadingSessions;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600 mb-10">
				<BookLoader message="Memuat sesi" />
			</div>
		);
	}

	if (errorSessions) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-red-600">
				<p>Gagal memuat data. Silakan coba lagi.</p>
			</div>
		);
	}

	if (history.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<Calendar className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Tidak Ada Riwayat Sesi</h3>
				<p className="text-gray-500 mb-4 text-center">
					Anda belum memiliki riwayat sesi. Pesan sesi untuk memulai!
				</p>
			</div>
		);
	}

	return (
		<div className="py-8 min-h-screen space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
						className={`outline-none focus:outline-blue-500 relative flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-300 ${showFilters
							? "bg-blue-50 border-blue-400 text-blue-700"
							: "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
							}`}>
						<Filter className="w-4 h-4" />
						<span>Filter</span>
						{activeFiltersCount > 0 && (
							<span className="absolute -top-2 -right-2 w-5 h-5 bg-chill-blue text-white text-xs rounded-full flex items-center justify-center animate-pulse">
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
						name="search"
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
					paginatedHistory.map((session) => (
						<div
							key={session.id}
							className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 border-chill-blue">
							<div className="p-6">
								{/* Header with Course and Status */}
								<div className="flex justify-between items-start mb-4">
									<div className="flex-1">
										<h3 className="text-xl font-bold text-gray-900 mb-1">
											{session.course}
										</h3>
										<p className="text-gray-600 flex items-center gap-2">
											<User className="w-4 h-4" />
											<span>dengan {session.mentor}</span>
										</p>
									</div>
									<div className="flex flex-col items-end gap-2">
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
										) : session.status === "started" ? (
											<span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-red-600 rounded-full text-sm font-medium shadow-sm border border-red-200">
												<span className="relative flex h-3 w-3">
													<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
													<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
												</span>
												On Going
											</span>
										) : (
											<span
												className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${getSessionStatusStyle(
													session.status
												)}`}>
												{getSessionStatusText(session.status)}
											</span>
										)}
									</div>
								</div>

								{/* Session Details Grid */}
								<div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<Calendar className="w-5 h-5 text-blue-600" />
											</div>
											<div>
												<p className="text-xs text-gray-500 font-medium">
													Tanggal
												</p>
												<p className="font-semibold text-gray-900 text-sm">
													{formatDateDay(session.date)}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
												<Clock className="w-5 h-5 text-purple-600" />
											</div>
											<div>
												<p className="text-xs text-gray-500 font-medium">
													Waktu Sesi
												</p>
												<p className="font-semibold text-gray-900 text-sm">
													{session.time} - {getSessionEndTime(session.time)} WIB
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
												{session.mode === "online" ? (
													<Monitor className="w-5 h-5 text-green-600" />
												) : (
													<MapPin className="w-5 h-5 text-green-600" />
												)}
											</div>
											<div>
												<p className="text-xs text-gray-500 font-medium">
													Metode Belajar
												</p>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${session.mode === "online"
														? "bg-blue-100 text-blue-800"
														: "bg-red-100 text-red-800"
														}`}>
													{session.mode === "online" ? "Online" : "Offline"}
												</span>
											</div>
										</div>

										{session.mode === "offline" && session.location && (
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
													<MapPin className="w-5 h-5 text-orange-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-xs text-gray-500 font-medium">
														Lokasi
													</p>
													<p className="font-semibold text-gray-900 text-sm truncate">
														{session.location}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
									{/* View Detail Button */}
									<button
										onClick={() => handleViewDetail(session.id)}
										className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group">
										<Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
										<span className="font-medium">Lihat Detail</span>
									</button>

									{/* Testimoni Button */}
									{!session.sudahTestimoni &&
										session.statusSesi === "end" &&
										updatingSessionId !== session.id && (
											<button
												className={`px-4 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 ${isSubmittingTestimoni
													? "bg-blue-200 cursor-not-allowed"
													: "bg-yellow-500 hover:bg-yellow-600"
													}`}
												onClick={() => handleOpenTestimoni(session)}
												disabled={isSubmittingTestimoni}>
												{isSubmittingTestimoni ? (
													<>
														<Loader2 className="animate-spin h-4 w-4" />
														<span>Sedang mengirim...</span>
													</>
												) : (
													<>
														<MdRateReview className="w-4 h-4" />
														<span className="font-medium">Beri Testimoni</span>
													</>
												)}
											</button>
										)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination */}
			{sortedFilteredHistory.length > 0 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			)}
		</div>
	);
}
