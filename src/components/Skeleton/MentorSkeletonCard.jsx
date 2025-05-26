import React from "react";

export function MentorSkeletonCard() {
	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 mb-4 animate-pulse">
			{/* Header Profil Mentor */}
			<div className="relative">
				<div className="h-32 bg-gradient-to-r from-yellow-400 to-yellow-500" />
				<div className="absolute -bottom-12 left-6">
					<div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200" />
				</div>
			</div>
			{/* Informasi Utama Mentor */}
			<div className="pt-14 px-6 pb-6">
				<div className="flex justify-between items-start mb-4">
					<div>
						<div className="h-6 bg-gray-200 rounded w-40 mb-2" />
						<div className="flex items-center mt-1 gap-2">
							<div className="w-4 h-4 bg-gray-200 rounded-full" />
							<div className="h-4 bg-gray-200 rounded w-10" />
							<div className="h-4 bg-gray-100 rounded w-16 ml-2" />
						</div>
					</div>
					<div className="h-4 w-20 bg-gray-200 rounded" />
				</div>
				{/* Tag Keahlian Mentor */}
				<div className="flex flex-wrap gap-2 mb-4">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="bg-gray-200 h-6 w-20 rounded-full" />
					))}
				</div>
				{/* Tombol */}
				<div className="w-full mt-6 py-2 rounded-lg bg-gray-200 h-10" />
			</div>
		</div>
	);
}
