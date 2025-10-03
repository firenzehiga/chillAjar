import { BookLoader } from "@/components/User/BookLoader";
import Footer from "@/components/Layout/Footer";

/**
 * PageLoader Component
 * Skeleton loader yang menyerupai struktur halaman mentor/admin
 * Mencegah layout shift dan flash saat lazy loading
 */
export const PageLoader = () => {
	return (
		<>
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header Skeleton */}
					<div className="py-8">
						<div className="mb-8 animate-pulse">
							<div className="flex items-center mb-2">
								<div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
								<div className="h-8 bg-gray-300 rounded w-64"></div>
							</div>
							<div className="h-4 bg-gray-200 rounded w-48 mt-2"></div>
						</div>

						{/* Card dengan Tabel Skeleton */}
						<div className="bg-white rounded-lg shadow p-6">
							{/* Judul Card */}
							<div className="flex justify-between items-center mb-6">
								<div className="h-7 bg-gray-300 rounded w-32 animate-pulse"></div>
							</div>

							{/* Search Bar Skeleton */}
							<div className="flex justify-end mb-4">
								<div className="h-10 bg-gray-200 rounded-md w-80 animate-pulse"></div>
							</div>

							{/* Table Header Skeleton */}
							<div className="border-b border-gray-200 mb-4">
								<div className="grid grid-cols-6 gap-4 pb-3">
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
									<div className="h-4 bg-gray-300 rounded animate-pulse"></div>
								</div>
							</div>

							{/* Table Rows Skeleton */}
							{[...Array(8)].map((_, index) => (
								<div
									key={index}
									className="grid grid-cols-6 gap-4 py-4 border-b border-gray-100 animate-pulse"
									style={{
										animationDelay: `${index * 0.1}s`,
									}}>
									<div className="h-4 bg-gray-200 rounded"></div>
									<div className="h-4 bg-gray-200 rounded"></div>
									<div className="h-4 bg-gray-200 rounded"></div>
									<div className="h-4 bg-gray-200 rounded"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4"></div>
									<div className="flex gap-2">
										<div className="h-8 bg-gray-200 rounded w-20"></div>
										<div className="h-8 bg-gray-200 rounded w-20"></div>
									</div>
								</div>
							))}

							{/* Pagination Skeleton */}
							<div className="flex justify-between items-center mt-6 animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-48"></div>
								<div className="flex gap-2">
									<div className="h-8 w-8 bg-gray-200 rounded"></div>
									<div className="h-8 w-8 bg-gray-200 rounded"></div>
									<div className="h-8 w-8 bg-gray-200 rounded"></div>
									<div className="h-8 w-8 bg-gray-200 rounded"></div>
								</div>
							</div>
						</div>

						{/* Loading Indicator dengan BookLoader */}
						<div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-200">
							<BookLoader size="small" />
							<div>
								<p className="text-sm font-medium text-gray-900">
									Memuat Halaman...
								</p>
								<p className="text-xs text-gray-500">Mohon tunggu sebentar</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
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
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
				<p className="text-gray-600">Memuat...</p>
			</div>
		</div>
	);
};
