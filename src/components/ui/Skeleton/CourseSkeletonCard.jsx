import React from "react";

export function CourseSkeletonCard() {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 mb-8 animate-pulse hover:shadow-xl">
			{/* Image placeholder with educational elements */}
			<div className="relative overflow-hidden">
				<div className="w-full h-48 bg-gradient-to-br from-blue-200 via-blue-100 to-chill-blue-dark relative">
					{/* Book stack illustration */}
					<div className="absolute top-4 left-4">
						<div className="w-8 h-6 bg-blue-400 rounded-sm transform -rotate-12 opacity-60" />
						<div className="w-8 h-6 bg-chill-blue-dark rounded-sm transform -rotate-6 -mt-1 opacity-70" />
						<div className="w-8 h-6 bg-blue-300 rounded-sm -mt-1 opacity-80" />
					</div>

					{/* Pencil illustration */}
					<div className="absolute top-6 right-6">
						<div className="w-1 h-12 bg-blue-600 rounded-full transform rotate-45" />
						<div className="w-2 h-2 bg-pink-400 rounded-full transform rotate-45 -mt-1 ml-0.5" />
					</div>

					{/* Graduation cap */}
					<div className="absolute bottom-4 right-4">
						<div className="w-6 h-4 bg-gray-400 rounded-t-full" />
						<div className="w-8 h-1 bg-gray-400 rounded-full -mt-0.5 -ml-1" />
						<div className="w-2 h-4 bg-gray-500 rounded-full absolute top-0 right-0 transform rotate-12" />
					</div>
				</div>

				{/* Category tag */}
				<div className="absolute top-3 right-3 bg-gradient-to-r from-blue-300 to-chill-blue-dark px-4 py-1.5 rounded-full">
					<div className="w-16 h-3 bg-white/50 rounded animate-pulse" />
				</div>
			</div>

			{/* Content area */}
			<div className="p-5">
				{/* Title with book icon */}
				<div className="flex items-center gap-2 mb-3">
					<div className="w-4 h-4 bg-blue-400 rounded opacity-60" />
					<div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3 animate-pulse" />
				</div>

				{/* Description */}
				<div className="space-y-2 mb-4">
					<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full animate-pulse" />
					<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 animate-pulse" />
				</div>

				{/* Bottom section with educational icons */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse" />
						<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20 animate-pulse" />
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 bg-green-300 rounded-full animate-pulse" />
						<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 animate-pulse" />
					</div>
				</div>

				{/* Learning progress bar */}
				<div className="mt-4 pt-3 border-t border-gray-100">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
						<div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
							<div className="h-full bg-gradient-to-r from-blue-400 to-chill-blue-dark rounded-full animate-pulse w-1/3" />
						</div>
						<div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
}
