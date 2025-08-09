import React from "react";
import { Search } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { CourseCarousel } from "../components/CourseCarousel";
import { CarouselSkeleton } from "../components/Skeleton/CarouselSkeleton";
import { CourseSkeletonCard } from "../components/Skeleton/CourseSkeletonCard";
import { getImageUrl } from "../utils/getImageUrl";
import { EmptyMentorsState } from "../components/EmptyState/EmptyMentorsState";
export function Home({
	courses,
	filteredCourses,
	searchQuery,
	setSearchQuery,
	handleCourseClick,
	userRole,
	isLoading,
}) {
	const [visibleCourses, setVisibleCourses] = React.useState(6);

	const handleShowMore = () => {
		setVisibleCourses(activeCourses.length);
	};

	const handleShowLess = () => {
		setVisibleCourses(6);
	};

	// --- Mapping agar field dan struktur course konsisten dengan frontend ---
	// Untuk setiap course:
	// - courseName: diambil dari namaKursus (backend) atau courseName (fallback)
	// - courseDescription: diambil dari deskripsi (backend) atau courseDescription (fallback)
	// - courseImage: diambil dari fotoKursus (backend) atau courseImage (fallback), default jika tidak ada
	// - price_per_hour: diambil dari mentor.biayaPerSesi (backend) atau price_per_hour (fallback)
	// - jadwal_kursus: hasil mapping dari jadwal_kursus (backend) atau jadwalKursus (backend),
	//   agar konsisten dipakai di seluruh komponen frontend (CourseCarousel, dsb)

	// Filter hanya kursus dengan mentor aktif
	const activeCourses = courses.filter((course) => {
		return course.mentor && course.mentor.status === "active";
	});

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
		<div className="space-y-8 ">
			{/* Section "Your Sessions" dihapus */}
			{/* Carousel Section - Di luar dari Your Sessions */}
			{isLoading ? (
				<>
					<CarouselSkeleton />
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Semua Kursus
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
							{Array.from({ length: 6 }).map((_, idx) => (
								<CourseSkeletonCard key={idx} />
							))}
						</div>
					</div>
				</>
			) : !activeCourses || activeCourses.length === 0 ? (
				// Kondisi: tidak ada kursus dengan mentor aktif (bukan karena search)
				<EmptyMentorsState context="courses" />
			) : filteredCourses.length === 0 && searchQuery.trim() ? (
				// Kondisi: ada kursus tapi hasil search kosong
				<>
					<CourseCarousel
						courses={mappedCourses}
						onCourseClick={handleCourseClick}
					/>
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Semua Kursus
						</h2>
						{userRole !== "admin" && userRole !== "mentor" && (
							<div className="relative py-4 w-1/2 mb-4">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									type="text"
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
								/>
							</div>
						)}

						{/* Empty search results */}
						<div className="flex flex-col items-center justify-center h-64 text-gray-500">
							<Search className="w-16 h-16 text-gray-300 mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								Tidak Ada Hasil Ditemukan
							</h3>
							<p className="text-gray-600 mb-4 text-center max-w-md">
								Tidak ada kursus yang cocok dengan pencarian "{searchQuery}".
								Coba kata kunci yang berbeda.
							</p>
							<button
								onClick={() => setSearchQuery("")}
								className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
								Lihat Semua Kursus
							</button>
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
					<div>
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Semua Kursus
						</h2>
						{userRole !== "admin" && userRole !== "mentor" && (
							<div className="relative py-4 w-1/2">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									type="text"
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
								/>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
							{filteredCourses.slice(0, visibleCourses).map((course) => (
								<CourseCard
									key={course.id}
									course={course}
									onClick={handleCourseClick}
								/>
							))}
						</div>
						<div className="flex items-center justify-end mb-8">
							{visibleCourses < filteredCourses.length ? (
								<button
									onClick={handleShowMore}
									className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none">
									View all →
								</button>
							) : filteredCourses.length > 6 ? (
								<button
									className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none"
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
