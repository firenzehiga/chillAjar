/**
 * PageLoader Component
 * Skeleton loader yang menyerupai struktur halaman mentor/admin
 * Mencegah layout shift dan flash saat lazy loading
 */
export const PageLoader = () => {
	return (
		<>
			<div className="min-h-[90vh] flex justify-center ">
				{/* Main Content */}
				<div className="flex flex-col items-center justify-center space-y-5">
					{/* Logo */}
					<img
						src="/logo.png"
						alt="Logo"
						className="w-20 h-20 object-contain"
					/>

					{/* Minimal Progress Dots */}
					<div className="flex space-x-1.5">
						<div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
						<div
							className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
							style={{ animationDelay: "0.1s" }}></div>
						<div
							className="w-2 h-2 bg-chill-blue rounded-full animate-bounce"
							style={{ animationDelay: "0.2s" }}></div>
					</div>
				</div>
			</div>
		</>
	);
};

/**
 * MinimalPageLoader Component
 * Versi minimal untuk transisi antar halaman yang lebih cepat
 * Digunakan untuk halaman yang sudah pernah dimuat sebelumnya
 */
export const MinimalPageLoader = () => {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<p className="text-gray-600">Memuat...</p>
			</div>
		</div>
	);
};
