import React from "react";
import { Book, Users, Clock } from "lucide-react";

export function CourseCard({ course, onClick }) {
	return (
		<div
			onClick={() => onClick(course)}
			className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group mb-8">
			<div className="relative overflow-hidden">
				<img
					src={course.image}
					alt={course.title}
					className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105">
					{course.price_per_hour}k/sesi
				</div>
			</div>
			<div className="p-5">
				<h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
					{course.title}
				</h3>
				<p className="text-gray-800 text-sm mb-4 line-clamp-2">
					{course.description}
				</p>
				<div className="flex items-center justify-between text-sm text-gray-500">
					<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
						<Book className="w-4 h-4 mr-1 text-blue-800" />
						{course.category}
					</span>
					<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
						<Users className="w-4 h-4 mr-1 text-blue-800" />
						{course.mentors.length} mentors
					</span>
				</div>
			</div>
		</div>
	);
}
