import React, { useState, useEffect } from "react";
import api from "../../../api.jsx";
import { Gift, ArrowLeft, AlertCircle, X, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import { FormSkeletonCard } from "../../../components/Skeleton/FormSkeletonCard";
import { is } from "date-fns/locale";

export function AdminFormPackagesPage({ onNavigate, packageId }) {
	const isEditMode = !!packageId;

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		diskon: 0,
		selectedItems: [],
		tanggal_mulai: "",
		tanggal_berakhir: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Ambil daftar item dari backend
	const [availableItems, setAvailableItems] = useState([]);
	const [loadingItems, setLoadingItems] = useState(false);
	useEffect(() => {
		const fetchItems = async () => {
			try {
				setLoadingItems(true);
				const token = localStorage.getItem("token");
				const res = await api.get("/item-paket", {
					headers: { Authorization: `Bearer ${token}` },
				});
				// Pastikan mapping sesuai backend
				setAvailableItems(
					Array.isArray(res.data)
						? res.data.map((item) => ({
								id: item.id,
								name: item.nama,
								price: item.harga,
								diskon: item.diskon || 0,
								description: item.deskripsi,
						  }))
						: []
				);
			} catch (err) {
				console.error("Error fetching items:", err);
				setAvailableItems([]);
			}
			setLoadingItems(false);
		};
		fetchItems();
	}, []);

	// Ambil data paket dari backend jika edit mode
	useEffect(() => {
		if (isEditMode && packageId) {
			const fetchPackage = async () => {
				try {
					setLoading(true);
					const token = localStorage.getItem("token");
					const response = await api.get(`/paket/${packageId}`, {
						headers: { Authorization: `Bearer ${token}` },
					});

					const pkg = response.data;
					setFormData({
						name: pkg.nama || "",
						description: pkg.deskripsi || "",
						diskon: pkg.diskon || 0,
						selectedItems: Array.isArray(pkg.items)
							? pkg.items.map((item) => ({
									id: item.id,
									name: item.nama,
									price: item.harga,
									diskon: item.diskon || 0,
									description: item.deskripsi,
							  }))
							: [],
						tanggal_mulai: pkg.tanggal_mulai
							? pkg.tanggal_mulai.substring(0, 10)
							: "",
						tanggal_berakhir: pkg.tanggal_berakhir
							? pkg.tanggal_berakhir.substring(0, 10)
							: "",
					});
				} catch (err) {
					setError("Gagal mengambil data paket");
					console.error("Error fetching package:", err);
					Swal.fire({
						icon: "error",
						title: "Error!",
						text: "Gagal mengambil data paket. Paket mungkin tidak ditemukan.",
						confirmButtonColor: "#EF4444",
					});
					// Redirect kembali ke manage packages jika package tidak ditemukan
					onNavigate("admin-manage-packages");
				} finally {
					setLoading(false);
				}
			};
			fetchPackage();
		}
	}, [isEditMode, packageId, onNavigate]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleAddItem = (item) => {
		if (
			!formData.selectedItems.find(
				(selectedItem) => selectedItem.id === item.id
			)
		) {
			setFormData((prev) => ({
				...prev,
				selectedItems: [...prev.selectedItems, { ...item }],
			}));
		}
	};
	// Tidak perlu handler deskripsi custom item

	const handleRemoveItem = (itemId) => {
		setFormData((prev) => ({
			...prev,
			selectedItems: prev.selectedItems.filter((item) => item.id !== itemId),
		}));
	};

	// Helper function untuk menghitung harga setelah discount
	const calculateDiscountedPrice = (originalPrice, discountAmount) => {
		if (!discountAmount || discountAmount === 0) return originalPrice;
		return Math.max(originalPrice - discountAmount, 0);
	};

	// Hitung harga total item dikurangi diskon
	const calculateTotalPrice = () => {
		const total = formData.selectedItems.reduce(
			(sum, item) => sum + calculateDiscountedPrice(item.price, item.diskon),
			0
		);
		const diskon = Number(formData.diskon) || 0;
		return Math.max(total - diskon, 0);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validasi
			if (!formData.name.trim()) {
				throw new Error("Nama paket harus diisi");
			}
			if (formData.selectedItems.length === 0) {
				throw new Error("Minimal pilih 1 item untuk paket");
			}

			// Validasi tanggal promo
			if (formData.tanggal_mulai && formData.tanggal_berakhir) {
				const startDate = new Date(formData.tanggal_mulai);
				const endDate = new Date(formData.tanggal_berakhir);
				if (endDate <= startDate) {
					throw new Error("Tanggal berakhir harus setelah tanggal mulai");
				}
			}
			if (
				(formData.tanggal_mulai && !formData.tanggal_berakhir) ||
				(!formData.tanggal_mulai && formData.tanggal_berakhir)
			) {
				throw new Error(
					"Jika mengatur periode promo, kedua tanggal harus diisi"
				);
			}

			const token = localStorage.getItem("token");

			// Kirim data ke backend
			const payload = {
				nama: formData.name,
				deskripsi: formData.description,
				harga_dasar: calculateTotalPrice(),
				diskon: Number(formData.diskon) || 0,
				tanggal_mulai: formData.tanggal_mulai || null,
				tanggal_berakhir: formData.tanggal_berakhir || null,
				items: formData.selectedItems.map((item) => ({
					id: item.id,
					jumlah_item: 1,
				})),
			};

			let response;
			if (isEditMode && packageId) {
				response = await api.put(`/paket/${packageId}`, payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
			} else {
				response = await api.post("/paket", payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
			}

			if (response?.data?.success === false || response?.status >= 400) {
				throw new Error(
					response?.data?.message || "Gagal menyimpan data paket"
				);
			}

			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: `Paket ${isEditMode ? "diperbarui" : "ditambahkan"} berhasil!`,
				showConfirmButton: false,
				timer: 1500,
			});
			onNavigate("admin-manage-packages");
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				(isEditMode ? "Gagal memperbarui paket" : "Gagal membuat paket");
			setError(errorMessage);
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: errorMessage,
				confirmButtonColor: "#EF4444",
			});
			console.error("Error details:", err.response ? err.response.data : err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-manage-packages")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<ArrowLeft className="w-5 h-5" />
				</div>
				<p className="translate-x-2">Kembali</p>
			</button>

			<div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<Gift className="w-6 h-6 mr-2 text-yellow-600" />
					{isEditMode ? "Edit Paket" : "Tambah Paket Baru"}
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Form Input */}
						<div>
							<div className="mb-4">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1">
									Nama Paket *
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
									placeholder="Contoh: NgeChill"
									required
								/>
							</div>

							<div className="mb-4">
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700 mb-1">
									Deskripsi
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
									placeholder="Jelaskan detail paket ini..."
									rows="4"
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="diskon"
									className="block text-sm font-medium text-gray-700 mb-1">
									Diskon Paket (Rp)
								</label>
								<input
									type="number"
									id="diskon"
									name="diskon"
									value={formData.diskon}
									min={0}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
									placeholder="Diskon dalam rupiah, contoh: 5000"
								/>
							</div>

							{/* Periode Promo */}
							<div className="mb-4">
								<h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
									<Calendar className="w-5 h-5 mr-2 text-yellow-600" />
									Periode Promo (Opsional)
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="tanggal_mulai"
											className="block text-sm font-medium text-gray-700 mb-1">
											Tanggal Mulai
										</label>
										<input
											type="date"
											id="tanggal_mulai"
											name="tanggal_mulai"
											value={formData.tanggal_mulai}
											onChange={handleChange}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
										/>
									</div>
									<div>
										<label
											htmlFor="tanggal_berakhir"
											className="block text-sm font-medium text-gray-700 mb-1">
											Tanggal Berakhir
										</label>
										<input
											type="date"
											id="tanggal_berakhir"
											name="tanggal_berakhir"
											value={formData.tanggal_berakhir}
											onChange={handleChange}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
											min={formData.tanggal_mulai}
										/>
									</div>
								</div>
								<p className="text-xs text-gray-500 mt-2">
									Kosongkan kedua field jika paket tidak memiliki periode
									terbatas
								</p>
							</div>

							{/* Items yang Dipilih */}
							<div className="mb-6">
								<h3 className="text-lg font-medium text-gray-900 mb-3">
									Items yang Dipilih
								</h3>
								{formData.selectedItems.length === 0 ? (
									<p className="text-gray-500 text-sm">
										Belum ada item yang dipilih
									</p>
								) : (
									<div className="space-y-2">
										{formData.selectedItems.map((item) => (
											<div key={item.id} className="mb-2">
												<div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
													<div className="flex justify-between items-center">
														<div>
															<div className="font-medium text-gray-900">
																{item.name}
															</div>
															<div className="text-sm text-gray-600">
																Rp {item.price.toLocaleString()}
															</div>
															<div className="text-xs text-gray-500 mt-1">
																{item.description}
															</div>
														</div>
														<button
															type="button"
															onClick={() => handleRemoveItem(item.id)}
															className="text-red-600 hover:text-red-800">
															<X className="w-4 h-4" />
														</button>
													</div>
												</div>
											</div>
										))}
										<div className="pt-2 border-t border-yellow-200">
											<div className="flex justify-between items-center font-semibold text-lg">
												<span>Total Harga:</span>
												<span className="text-yellow-600">
													Rp {calculateTotalPrice().toLocaleString()}
												</span>
											</div>
											{formData.diskon > 0 && (
												<div className="flex justify-between items-center text-sm text-gray-500 mt-1">
													<span>Rincian: </span>
													<span>
														(Total item Rp{" "}
														{formData.selectedItems
															.reduce((sum, item) => sum + item.price, 0)
															.toLocaleString()}
														) - Diskon Rp{" "}
														{Number(formData.diskon).toLocaleString()}
													</span>
												</div>
											)}

											{/* Preview Status Promo */}
											{(formData.tanggal_mulai ||
												formData.tanggal_berakhir) && (
												<div className="mt-3 pt-2 border-t border-yellow-100">
													<div className="text-sm">
														<span className="font-medium text-gray-700">
															Status Promo:{" "}
														</span>
														{formData.tanggal_mulai &&
														formData.tanggal_berakhir ? (
															(() => {
																const now = new Date();
																const startDate = new Date(
																	formData.tanggal_mulai
																);
																const endDate = new Date(
																	formData.tanggal_berakhir
																);

																if (now < startDate) {
																	return (
																		<span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
																			Akan Datang
																		</span>
																	);
																} else if (now >= startDate && now <= endDate) {
																	return (
																		<span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
																			Aktif
																		</span>
																	);
																} else {
																	return (
																		<span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
																			Berakhir
																		</span>
																	);
																}
															})()
														) : (
															<span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">
																Perlu kedua tanggal
															</span>
														)}
													</div>
													{formData.tanggal_mulai &&
														formData.tanggal_berakhir && (
															<div className="text-xs text-gray-500 mt-1">
																{new Date(
																	formData.tanggal_mulai
																).toLocaleDateString("id-ID")}{" "}
																-{" "}
																{new Date(
																	formData.tanggal_berakhir
																).toLocaleDateString("id-ID")}
															</div>
														)}
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							{error && (
								<div className="mb-4 text-red-500 text-sm flex items-center">
									<AlertCircle className="w-4 h-4 mr-2" />
									{error}
								</div>
							)}

							<div className="flex justify-end">
								<button
									type="submit"
									disabled={loading}
									className={`px-6 py-2 rounded-lg transition-colors ${
										loading
											? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
											: "bg-yellow-600 text-white hover:bg-yellow-700 outline-none focus:outline-none"
									}`}>
									{loading
										? "Memproses..."
										: isEditMode
										? "Perbarui Paket"
										: "Tambah Paket"}
								</button>
							</div>
						</div>

						{/* Daftar Items Tersedia */}
						{loadingItems ? (
							<div className="flex justify-center mb-6">
								<span className="text-gray-500 text-base font-medium">
									Loading Items...
								</span>
								<div className="ml-2 w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
							</div>
						) : (
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-3">
									Items Tersedia
								</h3>
								<div className="space-y-2 max-h-96 overflow-y-auto">
									{availableItems.map((item) => {
										const isSelected = formData.selectedItems.find(
											(selectedItem) => selectedItem.id === item.id
										);
										return (
											<div
												key={item.id}
												className={`p-3 rounded-lg border cursor-pointer transition-colors ${
													isSelected
														? "bg-yellow-100 border-yellow-300 cursor-not-allowed"
														: "bg-white border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
												}`}
												onClick={() => !isSelected && handleAddItem(item)}>
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<div className="font-medium text-gray-900">
															{item.name}
														</div>
														<div className="text-sm text-gray-600 mt-1">
															Rp {item.price.toLocaleString()}
														</div>
														{item.description && (
															<div className="text-xs text-gray-500 mt-1">
																{item.description}
															</div>
														)}
													</div>
													<div className="ml-3 text-right">
														{isSelected && (
															<div className="text-xs text-yellow-500 mt-1">
																Sudah dipilih
															</div>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
								<p className="text-xs text-gray-500 mt-2">
									* Klik item untuk menambahkan ke paket
								</p>
							</div>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormPackagesPage;
