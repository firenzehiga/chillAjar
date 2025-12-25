import React, { useState, useEffect } from "react";
import api from "@/api.jsx";
import { Package, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { FormSkeletonCard } from "@/components/Skeleton/FormSkeletonCard";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function AdminFormItemsPage({ onNavigate, itemId }) {
	const isEditMode = !!itemId;
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		diskon: 0,
		description: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data item untuk edit mode
	useEffect(() => {
		if (isEditMode && itemId) {
			const fetchItem = async () => {
				try {
					setLoading(true);
					const token = localStorage.getItem("token");
					const response = await api.get(`/item-paket/${itemId}`, {
						headers: { Authorization: `Bearer ${token}` },
					});

					// Mapping data dari response ke formData
					setFormData({
						name: response.data.nama || "",
						price: response.data.harga || "",
						diskon: response.data.diskon || 0,
						description: response.data.deskripsi || "",
					});
				} catch (err) {
					setError("Gagal mengambil data item");
					console.error("Error fetching item:", err);
					Swal.fire({
						icon: "error",
						title: "Error!",
						text: "Gagal mengambil data item. Item mungkin tidak ditemukan.",
						confirmButtonColor: "#EF4444",
					});
					// Redirect kembali ke manage items jika item tidak ditemukan
					onNavigate("admin-manage-items");
				} finally {
					setLoading(false);
				}
			};
			fetchItem();
		}
	}, [itemId, isEditMode, onNavigate]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Validasi
			if (!formData.name.trim()) {
				throw new Error("Nama item harus diisi");
			}
			if (!formData.price || formData.price <= 0) {
				throw new Error("Harga harus lebih dari 0");
			}
			if (formData.diskon < 0) {
				throw new Error("Diskon tidak boleh negatif");
			}

			const token = localStorage.getItem("token");

			// Payload sesuai database
			const payload = {
				nama: formData.name,
				harga: Number(formData.price),
				diskon: Number(formData.diskon) || 0,
				deskripsi: formData.description,
			};

			let response;
			if (isEditMode && itemId) {
				response = await api.put(`/item-paket/${itemId}`, payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
			} else {
				response = await api.post("/item-paket", payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
			}

			if (response?.data?.success === false || response?.status >= 400) {
				throw new Error(response?.data?.message || "Gagal menyimpan data item");
			}

			// Invalidate queries to refresh data
			queryClient.invalidateQueries(["adminItems"]);
			queryClient.invalidateQueries(["adminPackages"]);
			queryClient.invalidateQueries(["formCoursePackages"]);
			toast.success(
				`Item ${isEditMode ? "diperbarui" : "ditambahkan"} berhasil!`
			);
			onNavigate("admin-manage-items");
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				(isEditMode ? "Gagal memperbarui item" : "Gagal membuat item");
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

	if (loading && isEditMode) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			{/* <button
				onClick={() => onNavigate("admin-manage-items")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-blue-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<ArrowLeft className="w-5 h-5" />
				</div>
				<p className="translate-x-2">Kembali</p>
			</button> */}

			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<Package className="w-6 h-6 mr-2 text-blue-600" />
					{isEditMode ? "Edit Item" : "Tambah Item Baru"}
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1">
								Nama Item *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
								placeholder="Contoh: 1 Materi pembelajaran"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="price"
								className="block text-sm font-medium text-gray-700 mb-1">
								Harga (Rupiah) *
							</label>
							<input
								type="number"
								id="price"
								name="price"
								value={formData.price}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
								placeholder="5000"
								min="0"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="diskon"
								className="block text-sm font-medium text-gray-700 mb-1">
								Diskon (Rupiah)
							</label>
							<input
								type="number"
								id="diskon"
								name="diskon"
								value={formData.diskon}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
								placeholder="Diskon, contoh: 1000"
								min="0"
							/>
						</div>
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							placeholder="Jelaskan detail item ini..."
							rows="4"
						/>
					</div>

					{error && (
						<div className="mb-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					<div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("admin-manage-items");
							}}
							className="px-4 py-2 rounded-lg bg-gray-200 font-medium text-gray-700 hover:bg-gray-300 transition-colors">
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`px-6 py-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
									: "bg-blue-600 text-white hover:bg-blue-700 outline-none focus:outline-none"
							}`}>
							{loading ? (
								<>
									Memproses...{" "}
									<Loader2 className="w-4 h-4 mb-1 inline animate-spin text-blue-500" />
								</>
							) : isEditMode ? (
								"Perbarui Item"
							) : (
								"Buat Item"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormItemsPage;
