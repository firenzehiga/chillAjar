import { CourseCard } from "../components/CourseCard";
import { EmptyMentorsState } from "../components/Fallback/EmptyMentorsState";
import { Search } from "lucide-react";
import { SearchFilter } from "../components/User/SearchFilter";
import useAppStore from "../stores/useAppStore";

export function CoursesPage({ onCourseClick, filteredCourses, userRole }) {
	const {
		searchQuery,
		setSearchQuery,
		courseFilters,
		resetCourseFilters,
		applyFilters,
	} = useAppStore();

	// Aplikasikan filter dari Zustand store
	const finalFilteredCourses = applyFilters(
		filteredCourses,
		searchQuery,
		courseFilters
	);

	const hasActiveFilters = Object.values(courseFilters).some((value) => {
		if (value === "" || value === 0) return false;
		if (Array.isArray(value) && value[0] === 0 && value[1] === 100000)
			return false;
		return true;
	});

	const hasSearchQuery = searchQuery?.trim();
	const isFiltering = hasSearchQuery || hasActiveFilters;

	// // Debug logging
	// console.log("CoursesPage - Debug info:", {
	// 	isLoading,
	// 	coursesLength: courses?.length || 0,
	// 	activeCoursesLength: activeCourses.length,
	// 	filteredCoursesLength: filteredCourses.length,
	// 	searchQuery: searchQuery.trim(),
	// });

	// Prioritaskan loading, lalu cek filteredCourses

	// Tidak ada kursus sama sekali atau tidak ada kursus dengan mentor aktif
	if (!filteredCourses || filteredCourses.length === 0) {
		return <EmptyMentorsState context="courses" />;
	}

	// Ada kursus tapi hasil search/filter kosong
	if (finalFilteredCourses.length === 0 && isFiltering) {
		return (
			<div className="py-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Kursus Yang Tersedia
				</h2>
				{userRole !== "admin" && userRole !== "mentor" && (
					<div className="relative py-4 w-1/2 mb-4 flex gap-4 ">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<input
								type="text"
								placeholder="Cari nama kursus..."
								value={searchQuery || ""}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 focus:outline-none"
							/>
						</div>
						<SearchFilter />
					</div>
				)}

				{/* Empty search results */}
				<div className="flex flex-col items-center justify-center h-64 text-gray-500">
					<Search className="w-16 h-16 text-gray-300 mb-4" />
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Tidak Ada Hasil Ditemukan
					</h3>
					<p className="text-gray-600 mb-4 text-center max-w-md">
						{hasSearchQuery
							? `Tidak ada kursus yang cocok dengan pencarian "${searchQuery}" dan filter yang dipilih.`
							: "Tidak ada kursus yang cocok dengan filter yang dipilih."}
						<br />
						Coba kata kunci yang berbeda atau ubah filter.
					</p>
					<div className="flex gap-2 ">
						{hasSearchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
								Hapus Pencarian
							</button>
						)}
						{hasActiveFilters && (
							<button
								onClick={resetCourseFilters}
								className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
								Reset Filter
							</button>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-3">
				Kursus Yang Tersedia
			</h2>
			{userRole !== "admin" && userRole !== "mentor" && (
				<div className="relative py-4 w-1/2 mb-4 flex gap-4 ">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
						<input
							type="text"
							placeholder="Cari nama kursus..."
							value={searchQuery || ""}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
						/>
					</div>
					<SearchFilter />
				</div>
			)}

			{/* Show active filters count */}
			{isFiltering && (
				<div className="mb-4 text-sm text-gray-600">
					Menampilkan {finalFilteredCourses.length} kursus dari{" "}
					{filteredCourses.length} total kursus
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{finalFilteredCourses.map((course) => (
					<CourseCard key={course.id} course={course} onClick={onCourseClick} />
				))}
			</div>
		</div>
	);
}
