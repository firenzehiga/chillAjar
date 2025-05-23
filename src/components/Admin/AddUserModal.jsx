import React, { useState } from "react";
import { X, User, Mail, Phone, MapPin } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

export function AddUserModal({ isOpen, onClose, onUserAdded }) {
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		password: "password123", // Password default
		nomorTelepon: "",
		alamat: "",
	});
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validasi sederhana
		if (
			!formData.nama ||
			!formData.email ||
			!formData.nomorTelepon ||
			!formData.alamat
		) {
			setError("Please fill in all required fields");
			return;
		}

		try {
			const response = await api.post(
				"/admin/users",
				{
					nama: formData.nama,
					email: formData.email,
					password: formData.password,
					nomorTelepon: formData.nomorTelepon,
					alamat: formData.alamat,
					peran: "admin", // Tetapkan peran admin secara default
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);

			Swal.fire({
				icon: "success",
				title: "User Added!",
				text: `${formData.nama} has been successfully added as an admin.`,
				confirmButtonColor: "#3B82F6",
			});

			onUserAdded(response.data); // Callback untuk memperbarui daftar pengguna
			onClose(); // Tutup modal
		} catch (err) {
			setError(err.response?.data?.message || "Failed to add user");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Add New User (Admin Only)</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Full Name
						</label>
						<div className="relative">
							<User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="text"
								name="nama"
								value={formData.nama}
								onChange={handleInputChange}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter full name"
								required
							/>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email Address
						</label>
						<div className="relative">
							<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter email"
								required
							/>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Phone Number
						</label>
						<div className="relative">
							<Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="text"
								name="nomorTelepon"
								value={formData.nomorTelepon}
								onChange={handleInputChange}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter phone number"
								required
							/>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Address
						</label>
						<div className="relative">
							<MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="text"
								name="alamat"
								value={formData.alamat}
								onChange={handleInputChange}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter address"
								required
							/>
						</div>
					</div>

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
						Tambah User
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddUserModal;
