import React from "react";
import { Search, ArrowLeft } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { CourseCarousel } from "../components/CourseCarousel";

export function Home({
	courses,
	filteredCourses,
	searchQuery,
	setSearchQuery,
	handleCourseClick,
	userRole,
}) {
	return (
		<div className="space-y-8">
			{userRole !== "admin" && userRole !== "mentor" && (
				<div className="relative py-4">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
					<input
						type="text"
						placeholder="Search courses..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
					/>
				</div>
			)}

			<CourseCarousel courses={courses} onCourseClick={handleCourseClick} />
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{filteredCourses.map((course) => (
						<CourseCard
							key={course.id}
							course={course}
							onClick={handleCourseClick}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default Home;
