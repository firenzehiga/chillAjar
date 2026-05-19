import React, { useState } from "react";
import { X, Gift, ArrowRight, AlertCircle } from "lucide-react";
import { useCoursePackages } from "@/hooks/useCoursePackages";
import CoursePackageCard from "./CoursePackageCard";
import { BookLoader } from "../ui/BookLoader";

export function CoursePackageSelectionModal({ course, onClose, onConfirm }) {
	const [selectedPackage, setSelectedPackage] = useState(null);

	// Fetch packages menggunakan hook terpusat (filter visible + aktif + mapping data)
	const {
		data: packages = [],
		isLoading: loading,
		error,
		refetch,
	} = useCoursePackages({
		courseId: course?.id,
		// Hanya fetch jika course ID ada
		enabled: Boolean(course?.id),
		// staleTime: 5 * 60 * 1000, // Data fresh selama 5 menit
		// cacheTime: 10 * 60 * 1000, // Cache selama 10 menit
		// retry: 2,
		// refetchOnWindowFocus: false,
	});

	const handlePackageSelect = (packageData) => {
		setSelectedPackage(packageData);
	};

	const handleContinue = () => {
		if (selectedPackage) {
			onConfirm(selectedPackage);
			// Reset state after confirmation
			setSelectedPackage(null);
		}
	};

	const handleClose = () => {
		onClose();
	};

	const handleRetry = () => {
		refetch();
	};

	if (!course) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[92vh] max-h-[98vh] overflow-hidden flex flex-col">
				{/* Header - More compact and mobile-friendly */}
				<div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 text-white">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg sm:text-xl font-bold flex items-center">
								<Gift className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
								<span className="sm:inline">
									Pilih Paket - {course?.courseName}
								</span>
							</h2>
							<p className="text-blue-100 text-xs mt-1 hidden sm:block">
								Setiap paket memiliki benefit yang berbeda. Pilih yang paling
								cocok untuk pembelajaran Anda.
							</p>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-3 sm:p-6 overflow-y-auto flex-1">
					{loading ? (
						<div className="flex items-center justify-center h-72 mb-6">
							<BookLoader message="Memuat paket" />
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-600">
							<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
							<h3 className="text-lg font-semibold mb-2">Error</h3>
							<p className="text-gray-500 mb-4 text-center text-sm">
								{error?.response?.data?.message ||
									error?.message ||
									"Gagal memuat data paket"}
							</p>
							<button
								onClick={handleRetry}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
								Coba Lagi
							</button>
						</div>
					) : packages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-600">
							<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
							<h3 className="text-lg font-semibold mb-2">Belum Ada Paket</h3>
							<p className="text-gray-500 text-center text-sm">
								Belum ada paket yang tersedia untuk kursus ini.
								<br />
								Silakan hubungi admin untuk informasi lebih lanjut.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 sm:gap-4">
							{packages.map((pkg) => (
								<CoursePackageCard
									key={pkg.id}
									packageData={pkg}
									onSelect={handlePackageSelect}
									isSelected={selectedPackage?.id === pkg.id}
								/>
							))}
						</div>
					)}
				</div>

				{/* Footer - Mobile-friendly */}
				{!loading && !error && packages.length > 0 && (
					<div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-3 border-t">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
							<div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
								{selectedPackage ? (
									<span className="text-green-600 font-medium">
										✓ Paket "{selectedPackage.name}" dipilih
									</span>
								) : (
									"Pilih salah satu paket untuk melanjutkan"
								)}
							</div>
							<div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
								<button
									onClick={handleClose}
									className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
									Batal
								</button>
								<button
									onClick={handleContinue}
									disabled={!selectedPackage}
									className={`flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm ${
										selectedPackage
											? "bg-gradient-to-r shadow-lg shadow-blue-600/25 from-blue-500 to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 outline-none focus:outline-none"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}>
									Lanjutkan
									<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default CoursePackageSelectionModal;
