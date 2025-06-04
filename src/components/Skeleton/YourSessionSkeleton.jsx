import react from "react";

export function YourSessionSkeleton() {
	return (
		<>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
				<div className="bg-gray-200 h-16"></div>
				<div className="p-6">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 rounded-full bg-gray-200"></div>
						<div className="ml-4 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
				<div className="bg-gray-200 h-16"></div>
				<div className="p-6">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 rounded-full bg-gray-200"></div>
						<div className="ml-4 space-y-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
						<div className="flex items-center">
							<div className="w-5 h-5 bg-gray-200 rounded mr-3"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
