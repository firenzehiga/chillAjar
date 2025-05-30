import React, { useState } from "react";
import {
	Book,
	Users,
	Clock,
	Laptop,
	Building,
	FileQuestion,
} from "lucide-react";

export function CourseCard({ course, onClick }) {
	const [imgLoaded, setImgLoaded] = useState(false);
	// const filteredSchedules = course?.mentors?.[0]?.schedules || [];

	// console.log("Course in CourseCard:", course);
	// console.log("Filtered Schedules:", filteredSchedules);
	return (
		<div
			onClick={() => onClick(course)}
			className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group mb-8">
			<div className="relative overflow-hidden">
				{!imgLoaded && (
					<div className="absolute inset-0 bg-gray-200 animate-pulse" />
				)}
				<img
					loading="lazy"
					src={course.courseImage}
					alt={course.courseName}
					className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
					onLoad={() => setImgLoaded(true)}
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = "/foto_kursus/kursus_dummy_1.png"; // Jika gagal memuat gambar(path ada di db tapi file gaada di folder), gunakan gambar default
						setImgLoaded(true);
					}}
				/>
				<div className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105">
					Rp{course.price_per_hour}/sesi
				</div>
			</div>
			<div className="p-5">
				<h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
					{course.courseName}
				</h3>
				<p className="text-gray-800 text-sm mb-4 line-clamp-2">
					{course.courseDescription}
				</p>
				<div className="flex items-center justify-between text-sm text-gray-500">
					<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
						{course.learnMethod === "Online Learning" ? (
							<Laptop className="w-4 h-4 mr-1 text-blue-800" />
						) : course.learnMethod === "Offline Learning" ? (
							<Building className="w-4 h-4 mr-1 text-blue-800" />
						) : (
							<FileQuestion className="w-4 h-4 mr-1 text-blue-800" />
						)}
						{course.learnMethod}
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
