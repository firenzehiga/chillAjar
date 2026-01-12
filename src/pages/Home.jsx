import { useState } from "react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { CourseCarousel } from "@/components/CourseCarousel";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { CarouselSkeleton } from "@/components/ui/Skeleton/CarouselSkeleton";
import { CourseSkeletonCard } from "@/components/ui/Skeleton/CourseSkeletonCard";
import { getImageUrl } from "@/utils/getImageUrl";
import { EmptyMentorsState } from "@/components/Fallback/EmptyMentorsState";
import useAppStore from "@/stores/useAppStore";

export function Home({
	courses,
	filteredCourses,
	handleCourseClick,
	userRole,
}) {
	const [visibleCourses, setVisibleCourses] = useState(6);

	const {
		searchQuery,
		setSearchQuery,
		courseFilters,
		resetCourseFilters,
		applyFilters,
	} = useAppStore();

	const handleShowMore = () => {
		setVisibleCourses(finalFilteredCourses.length);
	};

	const handleShowLess = () => {
		setVisibleCourses(6);
	};

	// Filter hanya kursus dengan mentor aktif
	const activeCourses = courses.filter((course) => {
		return course.mentor && course.mentor.status === "active";
	});

	// Aplikasikan filter dari Zustand store untuk display
	const finalFilteredCourses = applyFilters(
		filteredCourses,
		searchQuery,
		courseFilters
	);

	// Check filtering state
	const hasActiveFilters = Object.values(courseFilters).some((value) => {
		if (value === "" || value === 0) return false;
		if (Array.isArray(value) && value[0] === 0 && value[1] === 100000)
			return false;
		return true;
	});
	const hasSearchQuery = searchQuery?.trim();
	const isFiltering = hasSearchQuery || hasActiveFilters;

	// --- Mapping agar field dan struktur course konsisten dengan frontend ---
	// Untuk setiap course:
	// - courseName: diambil dari namaKursus (backend) atau courseName (fallback)
	// - courseDescription: diambil dari deskripsi (backend) atau courseDescription (fallback)
	// - courseImage: diambil dari fotoKursus (backend) atau courseImage (fallback), default jika tidak ada
	// - price_per_hour: diambil dari mentor.biayaPerSesi (backend) atau price_per_hour (fallback)
	// - jadwal_kursus: hasil mapping dari jadwal_kursus (backend) atau jadwalKursus (backend),
	//   agar konsisten dipakai di seluruh komponen frontend (CourseCarousel, dsb)

	const mappedCourses = activeCourses.map((course) => {
		// Pastikan field nama dan gambar konsisten
		return {
			...course,
			courseName: course.namaKursus || course.courseName || "",
			courseDescription: course.deskripsi || course.courseDescription || "",
			courseImage:
				course.fotoKursus ||
				getImageUrl(course.courseImage, "/foto_kursus/default.jpg"),
			price_per_hour: course.mentor?.biayaPerSesi || course.price_per_hour || 0,
			jadwal_kursus: Array.isArray(course.jadwal_kursus)
				? course.jadwal_kursus
				: Array.isArray(course.jadwalKursus)
					? course.jadwalKursus
					: [],
		};
	});

	// // Debug logging
	// console.log("Home component - Debug info:", {
	// 	isLoading,
	// 	coursesLength: courses.length,
	// 	activeCoursesLength: activeCourses.length,
	// 	filteredCoursesLength: filteredCourses.length,
	// 	searchQuery: searchQuery.trim(),
	// 	mappedCoursesLength: mappedCourses.length,
	// });

	return (
		<div className="space-y-8">
			{/* Carousel Section - Di luar dari Your Sessions */}
			{!activeCourses || activeCourses.length === 0 ? (
				// Kondisi: tidak ada kursus dengan mentor aktif (bukan karena search)
				<EmptyMentorsState context="courses" />
			) : finalFilteredCourses.length === 0 && isFiltering ? (
				// Kondisi: ada kursus tapi hasil search/filter kosong
				<>
					<CourseCarousel
						courses={mappedCourses}
						onCourseClick={handleCourseClick}
					/>
					<div className="py-8 min-h-screen">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Semua Kursus
						</h2>
						{userRole !== "admin" && userRole !== "mentor" && (
							<div className="relative py-4 w-full lg:w-2/3 mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<input
										type="text"
										placeholder="Cari nama kursus..."
										value={searchQuery || ""}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
									/>
								</div>
								<SearchFilter />
							</div>
						)}

						{/* Empty search results */}
						<div className="flex flex-col items-center justify-center h-64 text-gray-500 mb-6">
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
							<div className="flex gap-2">
								{hasSearchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
										Hapus Pencarian
									</button>
								)}
								{hasActiveFilters && (
									<button
										onClick={resetCourseFilters}
										className="px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
										Reset Filter
									</button>
								)}
							</div>
						</div>
					</div>
				</>
			) : (
				// Kondisi normal: ada kursus dan ada hasil (bisa ada atau tidak ada search query)
				<>
					<CourseCarousel
						courses={mappedCourses}
						onCourseClick={handleCourseClick}
					/>
					<div className="px-4">
						<h2 className="text-2xl font-bold text-gray-900 ">
							Semua Kursus
						</h2>
						{userRole !== "admin" && userRole !== "mentor" && (
							<div className="relative py-4 mb-4 w-full lg:w-2/3 flex flex-col sm:flex-row gap-3 sm:gap-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
									<input
										type="text"
										placeholder="Cari nama kursus..."
										value={searchQuery || ""}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
									/>
								</div>
								<SearchFilter />
							</div>
						)}

						{/* Show filter info */}
						{isFiltering && (
							<div className="mb-4 text-sm text-gray-600">
								Menampilkan {finalFilteredCourses.length} kursus dari{" "}
								{filteredCourses.length} total kursus
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
							{finalFilteredCourses.slice(0, visibleCourses).map((course) => (
								<CourseCard
									key={course.id}
									course={course}
									onClick={handleCourseClick}
								/>
							))}
						</div>
						<div className="flex items-center justify-end mb-8">
							{visibleCourses < finalFilteredCourses.length ? (
								<button
									onClick={handleShowMore}
									className="text-blue-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none">
									View all →
								</button>
							) : finalFilteredCourses.length > 6 ? (
								<button
									className="text-blue-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none"
									onClick={handleShowLess}>
									View less
								</button>
							) : null}
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Home;
