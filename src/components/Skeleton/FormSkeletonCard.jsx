import React from "react";

export function FormSkeletonCard() {
	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("mentor-manage-courses")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1024 1024"
						height="25px"
						width="25px">
						<path
							d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
							fill="#000000"
						/>
						<path
							d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
							fill="#000000"
						/>
					</svg>
				</div>
				<p className="translate-x-2">Cancel</p>
			</button>
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				{/* Loading text di dalam card */}
				<div className="flex items-center justify-center mb-6">
					<span className="text-gray-500 text-base font-medium">
						Loading form...
					</span>
					<div className="ml-2 w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
				</div>
				<form>
					<div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
							<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
						</div>
						<div>
							<div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
							<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
							<div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
						</div>
					</div>
					<div className="mb-4">
						<div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
						<div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
					</div>
					<div className="mb-4">
						<div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
						<div className="space-y-4">
							{[1, 2].map((_, idx) => (
								<div key={idx} className="border p-4 rounded-lg mb-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
										<div>
											<div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
											<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
										</div>
										<div>
											<div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
											<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
										<div>
											<div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
											<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
										</div>
										<div>
											<div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
											<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
											<div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
										</div>
									</div>
									<div className="flex justify-end mt-4">
										<div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="flex justify-end">
						<div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
					</div>
				</form>
			</div>
		</div>
	);
}
