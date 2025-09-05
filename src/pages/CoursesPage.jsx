import { CourseCard } from "../components/CourseCard";
import { EmptyMentorsState } from "../components/Fallback/EmptyMentorsState";
import { Search } from "lucide-react";
export function CoursesPage({
	onCourseClick,
	searchQuery,
	setSearchQuery,
	filteredCourses,
	courses,
	userRole,
}) {
	// Filter hanya kursus dengan mentor aktif
	const activeCourses =
		courses?.filter((course) => {
			return course.mentor && course.mentor.status === "active";
		}) || [];

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
	if (!activeCourses || activeCourses.length === 0) {
		return <EmptyMentorsState context="courses" />;
	}

	// Ada kursus tapi hasil search kosong
	if (filteredCourses.length === 0 && searchQuery.trim()) {
		return (
			<div className="py-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-3">
					Kursus Yang Tersedia
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
						Tidak ada kursus yang cocok dengan pencarian "{searchQuery}". Coba
						kata kunci yang berbeda.
					</p>
					<button
						onClick={() => setSearchQuery("")}
						className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
						Lihat Semua Kursus
					</button>
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredCourses.map((course) => (
					<CourseCard key={course.id} course={course} onClick={onCourseClick} />
				))}
			</div>
		</div>
	);
}
