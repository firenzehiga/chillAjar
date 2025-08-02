import React, { useState } from "react";
import { Package, ArrowLeft, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export function AdminFormItemPage({ onNavigate, itemId }) {
	const isEditMode = !!itemId;

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		description: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Mock data untuk edit mode
	React.useEffect(() => {
		if (isEditMode) {
			// Simulasi fetch data item
			const mockItem = {
				name: "1 Materi pembelajaran",
				price: 5000,
				description: "Belajar 1 topik materi dengan mentor",
			};
			setFormData(mockItem);
		}
	}, [isEditMode]);

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

			// Simulasi API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: `Item ${isEditMode ? "diperbarui" : "ditambahkan"} successfully!`,
				confirmButtonColor: "#3B82F6",
			});
			onNavigate("admin-manage-items");
		} catch (err) {
			setError(err.message);
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: err.message,
				confirmButtonColor: "#EF4444",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-manage-items")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<ArrowLeft className="w-5 h-5" />
				</div>
				<p className="translate-x-2">Kembali</p>
			</button>

			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<Package className="w-6 h-6 mr-2 text-yellow-600" />
					{isEditMode ? "Edit Item" : "Tambah Item Baru"}
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								placeholder="5000"
								min="0"
								required
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
								? "Perbarui Item"
								: "Tambah Item"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormItemPage;
