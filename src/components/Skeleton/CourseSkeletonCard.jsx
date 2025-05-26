import React from "react";

export function CourseSkeletonCard() {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 mb-8 animate-pulse">
			<div className="relative overflow-hidden">
				<div className="w-full h-48 bg-gray-200" />
				<div className="absolute top-3 right-3 bg-gray-300 px-8 py-2 rounded-full" />
			</div>
			<div className="p-5">
				<div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
				<div className="h-4 bg-gray-200 rounded w-full mb-4" />
				<div className="flex items-center justify-between">
					<div className="h-4 bg-gray-200 rounded w-1/3" />
					<div className="h-4 bg-gray-200 rounded w-1/4" />
				</div>
			</div>
		</div>
	);
}
