import React, { useState } from "react";
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
	const [visibleCourses, setVisibleCourses] = useState(6);

	const handleShowMore = () => {
		setVisibleCourses(courses.length);
	};

	const handleShowLess = () => {
		setVisibleCourses(6);
	};
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
					) : (
						<button
							className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none"
							onClick={handleShowLess}>
							View less
						</button>
					)}
				</div>
			</div>
			<div className="container px-4 mx-auto">
				<h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
					Your Upcoming Sessions
				</h2>

				<div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-7">
					{[
						{
							day: "Mon",
							date: "Jun 3",
							title: "Advanced JavaScript Concepts",
							time: "10:00 AM - 11:30 AM",
							instructor: "Prof. Robert Chen",
							experience: "10+ years experience",
							color: "emerald",
						},
						{
							day: "Wed",
							date: "Jun 5",
							title: "Database Design Principles",
							time: "2:00 PM - 3:30 PM",
							instructor: "Dr. Lisa Wang",
							experience: "8+ years experience",
							color: "blue",
						},
					].map((session, index) => (
						<div
							key={index}
							className="p-6 border-b border-gray-200/50 last:border-b-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-gray-50/50 transition-all duration-200">
							<div
								className={`${
									session.color === "emerald"
										? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800"
										: "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800"
								} p-4 rounded-xl text-center min-w-[90px] shadow-sm`}>
								<div className="font-bold text-lg">{session.day}</div>
								<div className="text-sm opacity-80">{session.date}</div>
							</div>

							<div className="flex-grow">
								<h3 className="font-semibold text-lg mb-1">{session.title}</h3>
								<p className="text-gray-500">{session.time}</p>
							</div>

							<div className="flex items-center gap-4">
								<div className="flex items-center gap-3">
									<div>
										<div className="font-medium">{session.instructor}</div>
										<div className="text-xs text-gray-500">
											{session.experience}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Home;
