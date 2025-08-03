import React, { useState, useEffect } from "react";
import { X, Gift, ArrowRight, AlertCircle } from "lucide-react";
import api from "../api";
import CoursePackageCard from "./CoursePackageCard";

export function CoursePackageSelectionModal({ course, onClose, onConfirm }) {
	const [packages, setPackages] = useState([]);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch packages ketika modal dibuka
	useEffect(() => {
		if (course) {
			fetchPackages();
		}
	}, [course]);

	const fetchPackages = async () => {
		try {
			setLoading(true);
			setError(null);
			const token = localStorage.getItem("token");

			const response = await api.get("/paket", {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});

			// Filter paket yang aktif (tidak expired)
			const activePackages = response.data.filter((pkg) => {
				if (!pkg.tanggal_berakhir) return true; // Paket tanpa batas waktu

				const endDate = new Date(pkg.tanggal_berakhir);
				const now = new Date();
				return endDate >= now; // Paket yang belum expired
			});

			// Map data untuk konsistensi
			const mappedPackages = activePackages.map((pkg) => ({
				id: pkg.id,
				name: pkg.nama,
				description: pkg.deskripsi,
				totalPrice: pkg.harga_dasar || 0,
				diskon: pkg.diskon || 0,
				items:
					pkg.items?.map((item) => ({
						id: item.id,
						name: item.nama,
						price: item.harga,
						description: item.deskripsi,
					})) || [],
				tanggal_mulai: pkg.tanggal_mulai,
				tanggal_berakhir: pkg.tanggal_berakhir,
			}));

			setPackages(mappedPackages);
		} catch (err) {
			console.error("Error fetching packages:", err);
			setError("Gagal memuat data paket");
		} finally {
			setLoading(false);
		}
	};

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
		setSelectedPackage(null);
		setError(null);
		onClose();
	};

	if (!course) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 text-white">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<h2 className="text-2xl font-bold flex items-center">
								<Gift className="w-7 h-7 mr-3" />
								Pilih Paket untuk Kursus -
							</h2>
							<p className="text-yellow-100 mt-1 text-xl">
								{course?.courseName}
							</p>
						</div>
						<button
							onClick={handleClose}
							className="text-white hover:text-yellow-200 transition-colors p-2">
							<X className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
					{loading ? (
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-gray-600">Memuat paket tersedia...</p>
							</div>
						</div>
					) : error ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-600">
							<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
							<h3 className="text-lg font-semibold mb-2">Error</h3>
							<p className="text-gray-500 mb-4 text-center">{error}</p>
							<button
								onClick={fetchPackages}
								className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
								Coba Lagi
							</button>
						</div>
					) : packages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-600">
							<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
							<h3 className="text-lg font-semibold mb-2">Belum Ada Paket</h3>
							<p className="text-gray-500 text-center">
								Belum ada paket yang tersedia untuk kursus ini.
								<br />
								Silakan hubungi admin untuk informasi lebih lanjut.
							</p>
						</div>
					) : (
						<>
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Pilih paket yang sesuai dengan kebutuhan Anda
								</h3>
								<p className="text-gray-600 text-sm">
									Setiap paket memiliki benefit yang berbeda. Pilih yang paling
									cocok untuk pembelajaran Anda.
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{packages.map((pkg) => (
									<CoursePackageCard
										key={pkg.id}
										packageData={pkg}
										onSelect={handlePackageSelect}
										isSelected={selectedPackage?.id === pkg.id}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Footer */}
				{!loading && !error && packages.length > 0 && (
					<div className="bg-gray-50 px-6 py-4 border-t">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-600">
								{selectedPackage ? (
									<span className="text-green-600 font-medium">
										✓ Paket "{selectedPackage.name}" dipilih
									</span>
								) : (
									"Pilih salah satu paket untuk melanjutkan"
								)}
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleClose}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
									Batal
								</button>
								<button
									onClick={handleContinue}
									disabled={!selectedPackage}
									className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
										selectedPackage
											? "bg-yellow-600 text-white hover:bg-yellow-700"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}>
									Lanjutkan
									<ArrowRight className="w-4 h-4 ml-2" />
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
