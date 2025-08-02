import React from "react";

export function CarouselSkeleton() {
	return (
		<div className="mb-12 w-full flex justify-center px-2">
			<div className=" max-w-7xl w-[90vw] h-[400px] bg-gray-200 rounded-xl animate-pulse relative overflow-hidden">
				<div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-300 rounded-full" />
				<div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-300 rounded-full" />
				<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-300 to-transparent" />
			</div>
		</div>
	);
}
