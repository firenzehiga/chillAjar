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
	onNavigate,
	isLoading,
}) {
	const [visibleCourses, setVisibleCourses] = React.useState(6);

	const handleShowMore = () => {
		setVisibleCourses(courses.length);
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
	const mappedCourses = courses.map((course) => {
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

	return (
		<div className="space-y-8 ">
			{/* Section "Your Sessions" dihapus */}
			{/* Carousel Section - Di luar dari Your Sessions */}
			{filteredCourses.length > 0 ? (
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
							{visibleCourses < courses.length ? (
								<button
									onClick={handleShowMore}
									className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none">
									View all →
								</button>
							) : courses.length > 6 ? (
								<button
									className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none"
									onClick={handleShowLess}>
									View less
								</button>
							) : null}
						</div>
					</div>
				</>
			) : (
				<EmptyMentorsState />
			)}
		</div>
	);
}

export default Home;
