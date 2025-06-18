import React from "react";

export function MentorEditProfileSkeleton() {
	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<div className="flex items-center space-x-4 mb-6">
				<div className="p-2 bg-gray-100 rounded-full">
					<div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
				</div>
				<div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
			</div>
			<form className="bg-white p-6 rounded-lg shadow space-y-6">
				<div className="flex justify-center">
					<div className="relative w-32 h-32">
						<div className="rounded-full w-full h-full bg-gray-200 border-2 border-gray-300 animate-pulse" />
						<div className="absolute bottom-0 right-0 bg-gray-300 p-2 rounded-full animate-pulse" />
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col space-y-2">
						<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
						<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
					</div>
					<div className="flex flex-col space-y-2">
						<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
						<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
					</div>
				</div>
				<div className="flex flex-col space-y-2">
					<div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="flex flex-col space-y-2">
					<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="flex flex-col space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
					<div className="h-16 w-full bg-gray-200 rounded animate-pulse" />
				</div>
				<div className="flex justify-end space-x-4 mt-4">
					<div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
					<div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
				</div>
			</form>
		</div>
	);
}
