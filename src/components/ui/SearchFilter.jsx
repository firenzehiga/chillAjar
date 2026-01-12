import React, { useState, useEffect } from "react";
import {
	Filter,
	X,
	DollarSign,
	Star,
	Clock,
	MapPin,
	Monitor,
	User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "../../stores/useAppStore";

export function SearchFilter({ filterType = "course" }) {
	const [isOpen, setIsOpen] = useState(false);

	const isCourseFilter = filterType === "course";

	const {
		courseFilters,
		updateCourseFilter,
		resetCourseFilters,
		mentorFilters,
		updateMentorFilter,
		resetMentorFilters,
	} = useAppStore();

	// Use appropriate filters based on filterType
	const filters = isCourseFilter ? courseFilters : mentorFilters;
	const updateFilter = isCourseFilter ? updateCourseFilter : updateMentorFilter;
	const resetFilters = isCourseFilter ? resetCourseFilters : resetMentorFilters;
	const filterLabel = isCourseFilter ? "Filter Kursus" : "Filter Mentor";

	// Local state for price slider to prevent glitching
	const [localPriceRange, setLocalPriceRange] = useState(filters.priceRange);

	// Sync local state with store when filters change from outside
	useEffect(() => {
		setLocalPriceRange(filters.priceRange);
	}, [filters.priceRange]);

	// Debounce price filter update
	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				localPriceRange[0] !== filters.priceRange[0] ||
				localPriceRange[1] !== filters.priceRange[1]
			) {
				handleFilterChange("priceRange", localPriceRange);
			}
		}, 300); // 300ms debounce

		return () => clearTimeout(timer);
	}, [localPriceRange]);

	// Kategori yang umum untuk kursus
	// const categories = [
	// 	"Matematika",
	// 	"Fisika",
	// 	"Kimia",
	// 	"Biologi",
	// 	"Bahasa Inggris",
	// 	"Bahasa Indonesia",
	// 	"Sejarah",
	// 	"Geografi",
	// 	"Ekonomi",
	// 	"Akuntansi",
	// 	"Komputer",
	// 	"Programming",
	// 	"Desain",
	// 	"Musik",
	// ];

	const handleFilterChange = (key, value) => {
		updateFilter(key, value);
	};

	const clearFilters = () => {
		resetFilters();
	};

	const activeFiltersCount = Object.values(filters).filter((value) => {
		if (value === "" || value === 0) return false;
		if (Array.isArray(value) && value[0] === 0 && value[1] === 100000)
			return false;
		return true;
	}).length;

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="focus:ring-2 focus:ring-blue-500 focus:border-transparent  focus:outline-none flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
				<Filter className="w-4 h-4 text-gray-600" />
				<span className="text-sm font-medium text-gray-700">{filterLabel}</span>
				{activeFiltersCount > 0 && (
					<span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
						{activeFiltersCount}
					</span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
						{/* Header */}
						<div className="p-4 bg-gradient-to-r  from-blue-50 to-orange-50 border-b">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-gray-900">{filterLabel}</h3>
								<div className="flex items-center space-x-2">
									{activeFiltersCount > 0 && (
										<button
											onClick={clearFilters}
											className="text-xs text-blue-600 hover:text-blue-700 font-medium">
											Hapus Semua
										</button>
									)}
									<button
										onClick={() => setIsOpen(false)}
										className="text-gray-400 hover:text-gray-600">
										<X className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>

						{/* Filters */}
						<div className="p-4 space-y-6">
							{/* Price Range */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									<DollarSign className="w-4 h-4 inline mr-1" />
									Rentang Harga: Rp {localPriceRange[0].toLocaleString("id-ID")} - Rp {localPriceRange[1].toLocaleString("id-ID")}
								</label>
								<div className="flex items-center space-x-3">
									<span className="text-xs text-gray-500">0</span>
									<input
										type="range"
										min="0"
										max="100000"
										step="5000"
										value={localPriceRange[1]}
										onChange={(e) => setLocalPriceRange([0, parseInt(e.target.value)])}
										className="flex-1 focus:outline-none outline-none"
									/>
									<span className="text-xs text-gray-500">100k</span>
								</div>
							</div>

							{/* Mentor Rating */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<User className="w-4 h-4 inline mr-1" />
									Rating Mentor Minimal
								</label>
								<div className="flex items-center space-x-2">
									{[1, 2, 3, 4, 5].map((rating) => (
										<button
											key={rating}
											onClick={() => handleFilterChange("mentorRating", rating)}
											className="transition-all duration-200 hover:scale-110 focus:outline-none outline-none">
											<Star
												className={`w-6 h-6 ${rating <= filters.mentorRating
													? "text-yellow-400 fill-current"
													: "text-gray-300"
													}`}
											/>
										</button>
									))}
									{filters.mentorRating > 0 && (
										<button
											onClick={() => handleFilterChange("mentorRating", 0)}
											className="text-xs text-blue-600 hover:text-blue-700 ml-2 focus:outline-none outline-none">
											Reset
										</button>
									)}
								</div>
							</div>

							{/* Learning Mode */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<Monitor className="w-4 h-4 inline mr-1" />
									Mode Pembelajaran
								</label>
								<div className="grid grid-cols-2 gap-2">
									<button
										onClick={() =>
											handleFilterChange(
												"mode",
												filters.mode === "online" ? "" : "online"
											)
										}
										className={`focus:ring-2 focus:ring-blue-600 focus:outline-none focus:outline-transparent  flex items-center justify-center p-3 rounded-lg border transition-all duration-300 ${filters.mode === "online"
											? "bg-blue-600 text-white border-blue-600 "
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											}`}>
										<Monitor className="w-4 h-4 mr-2" />
										Online
									</button>
									<button
										onClick={() =>
											handleFilterChange(
												"mode",
												filters.mode === "offline" ? "" : "offline"
											)
										}
										className={`focus:ring-2 focus:ring-blue-600 focus:outline-none focus:outline-transparent flex items-center justify-center p-3 rounded-lg border transition-all duration-300 ${filters.mode === "offline"
											? "bg-blue-600 text-white border-blue-600"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											}`}>
										<MapPin className="w-4 h-4 mr-2" />
										Offline
									</button>
								</div>
							</div>

							{/* Availability */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									<Clock className="w-4 h-4 inline mr-1" />
									Ketersediaan Jadwal
								</label>
								<div className="grid grid-cols-2 gap-2">
									<button
										onClick={() =>
											handleFilterChange(
												"availability",
												filters.availability === "today" ? "" : "today"
											)
										}
										className={`focus:ring-2 focus:ring-blue-600 focus:outline-none focus:outline-transparent flex items-center justify-center p-3 rounded-lg border transition-all duration-300 ${filters.availability === "today"
											? "bg-blue-600 text-white border-blue-600"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											}`}>
										<Clock className="w-4 h-4 mr-2" />
										Hari Ini
									</button>
									<button
										onClick={() =>
											handleFilterChange(
												"availability",
												filters.availability === "week" ? "" : "week"
											)
										}
										className={`focus:ring-2 focus:ring-blue-600 focus:outline-none focus:outline-transparent  flex items-center justify-center p-3 rounded-lg border transition-all duration-300 ${filters.availability === "week"
											? "bg-blue-600 text-white border-blue-600"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											}`}>
										<Clock className="w-4 h-4 mr-2" />
										Minggu Ini
									</button>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

