import React from "react";
import { CourseCard } from "../components/CourseCard";

import { Search } from "lucide-react";
export function CoursesPage({
	courses,
	onCourseClick,
	searchQuery,
	setSearchQuery,
	filteredCourses,
	loading,
	userRole,
}) {
	return (
		<div className="py-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-3">
				Available Courses
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
