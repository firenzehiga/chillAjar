import React from "react";

export function MentorProfileSkeleton() {
	return (
		<div className="py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="h-48 bg-gradient-to-r from-yellow-400 to-yellow-600 relative">
						<div className="absolute -bottom-16 left-8">
							<div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 animate-pulse" />
						</div>
					</div>
					<div className="pt-20 px-8 pb-8">
						<div className="flex justify-between items-start mb-6">
							<div>
								<div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
								<div className="flex items-center space-x-4">
									<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
									<div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
								</div>
							</div>
							<div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
						</div>
						<div className="grid grid-cols-2 gap-6 mb-8">
							<div className="bg-yellow-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-16 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>
							<div className="bg-yellow-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-16 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>
						</div>
						<div className="bg-gray-50 rounded-xl p-6 space-y-4">
							<div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
								<div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
							</div>
						</div>
						<div className="bg-gray-50 rounded-xl p-6 mt-6 space-y-4">
							<div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
							<div className="h-5 w-72 bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
