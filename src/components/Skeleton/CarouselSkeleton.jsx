import React from "react";

export function CarouselSkeleton() {
	return (
		<div className="mb-12 w-full flex justify-center px-2">
			<div className="max-w-7xl w-[90vw] h-[400px] bg-gradient-to-br from-blue-100 via-orange-50 to-blue-50 rounded-xl animate-pulse relative overflow-hidden shadow-lg">
				{/* Educational background elements */}
				<div className="absolute inset-0 opacity-20">
					{/* Floating books */}
					<div
						className="absolute top-8 left-12 w-8 h-6 bg-blue-400 rounded transform -rotate-12 animate-bounce"
						style={{ animationDelay: "0s" }}
					/>
					<div
						className="absolute top-16 left-20 w-6 h-4 bg-orange-400 rounded transform rotate-12 animate-bounce"
						style={{ animationDelay: "0.5s" }}
					/>
					<div
						className="absolute top-12 right-16 w-7 h-5 bg-blue-400 rounded transform -rotate-6 animate-bounce"
						style={{ animationDelay: "1s" }}
					/>

					{/* Pencils */}
					<div className="absolute top-20 left-1/3">
						<div className="w-1 h-16 bg-chill-blue rounded-full transform rotate-45 animate-pulse" />
						<div className="w-2 h-2 bg-pink-400 rounded-full transform rotate-45 -mt-1 ml-0.5" />
					</div>

					{/* Mathematical symbols */}
					<div className="absolute bottom-20 left-8 text-2xl font-bold text-blue-400 animate-pulse">
						+
					</div>
					<div className="absolute bottom-16 left-16 text-xl font-bold text-green-400 animate-pulse">
						×
					</div>
					<div className="absolute bottom-24 right-20 text-2xl font-bold text-purple-400 animate-pulse">
						∑
					</div>

					{/* Graduation caps */}
					<div className="absolute top-24 right-8">
						<div className="w-8 h-6 bg-gray-400 rounded-t-full" />
						<div className="w-10 h-2 bg-gray-400 rounded-full -mt-1 -ml-1" />
					</div>
				</div>

				{/* Navigation arrows with educational styling */}
				<div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center shadow-md">
					<div className="w-6 h-6 bg-white rounded-full animate-pulse" />
				</div>
				<div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center shadow-md">
					<div className="w-6 h-6 bg-white rounded-full animate-pulse" />
				</div>

				{/* Content area overlay */}
				<div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/80 via-white/40 to-transparent" />

				{/* Central content placeholder */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="w-32 h-32 bg-white/60 rounded-full mx-auto animate-pulse flex items-center justify-center">
							<div className="w-16 h-16 bg-blue-400/60 rounded-full animate-spin" />
						</div>
						<div className="space-y-2">
							<div className="w-48 h-6 bg-white/60 rounded-full mx-auto animate-pulse" />
							<div className="w-32 h-4 bg-white/40 rounded-full mx-auto animate-pulse" />
						</div>
					</div>
				</div>

				{/* Dots indicator */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
					{[...Array(5)].map((_, i) => (
						<div
							key={i}
							className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
							style={{ animationDelay: `${i * 0.2}s` }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
