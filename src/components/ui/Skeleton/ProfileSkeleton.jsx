// src/components/Skeleton/ProfileSkeleton.jsx
import React from "react";

export function ProfileSkeletonMentor() {
	return (
		<div className="py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
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
							<div className="bg-blue-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-16 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>
							<div className="bg-blue-50 p-4 rounded-xl text-center">
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

export function ProfileSkeletonUser() {
	return (
		<div className="py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
						<div className="absolute -bottom-16 left-8">
							<div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 animate-pulse" />
						</div>
					</div>

					{/* header */}
					<div className="pt-20 px-8 pb-8">
						<div className="flex justify-between items-start mb-6">
							<div>
								<div className="h-8 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
								<div className="flex items-center space-x-4">
									<div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
									<div className="h-5 w-15 bg-gray-200 rounded animate-pulse" />
								</div>
							</div>
							<span
								className="inline-block h-7 w-24 rounded-full bg-gray-200 animate-pulse"
								aria-label="Loading tier badge"
							/>
							<div className="w-28 h-10 bg-gray-200 rounded-full animate-pulse" />
						</div>

						{/* stats: 2 on top, 1 full-width bawah */}
						<div className="grid grid-cols-2 gap-6 mb-8">
							<div className="bg-blue-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-16 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>

							<div className="bg-blue-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-16 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-24 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>

							{/* full width stat under */}
							<div className="col-span-2 bg-blue-50 p-4 rounded-xl text-center">
								<div className="w-6 h-6 mx-auto mb-2 bg-gray-200 rounded-full animate-pulse" />
								<div className="h-7 w-20 mx-auto bg-gray-200 rounded mb-1 animate-pulse" />
								<div className="h-4 w-32 mx-auto bg-gray-100 rounded animate-pulse" />
							</div>
						</div>

						{/* contact / info */}
						<div className="bg-gray-50 rounded-xl p-6 space-y-4">
							<div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
								<div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProfileSkeletonAdmin() {
	return (
		<div className="py-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
					{/* top controls */}
					<div className="flex items-center justify-between mb-6">
						<div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
						<div className="flex space-x-3">
							<div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
							<div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
						</div>
					</div>

					{/* table/list skeleton */}
					<div className="space-y-3">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
									<div>
										<div className="h-4 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
										<div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
									<div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfileSkeletonMentor;
