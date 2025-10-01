import { useState } from "react";
import { X, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import api from "@/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
export function AddUserModal({ isOpen, onClose, onUserAdded }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// field-level errors (contoh: email sudah dipakai)
	const [fieldErrors, setFieldErrors] = useState({});

	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		password: "password123", // Password default
		nomorTelepon: "",
		alamat: "",
	});

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// hapus error field saat user edit
		if (fieldErrors[name]) {
			setFieldErrors((prev) => {
				const next = { ...prev };
				delete next[name];
				return next;
			});
		}
	};

	const resetForm = () => {
		setFormData({
			nama: "",
			email: "",
			password: "password123", // Password default
			nomorTelepon: "",
			alamat: "",
		});
		setError("");
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Prevent multiple submissions
		if (isLoading) return;
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

		setIsLoading(true);

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
					// beri opsi supaya interceptor global tidak meng-hijack error
					skipGlobalError: true,
				}
			);

			Swal.fire({
				icon: "success",
				title: "User Added!",
				text: `${formData.nama} has been successfully added as an admin.`,
				confirmButtonColor: "#3B82F6",
			});

			onUserAdded(response.data); // Callback untuk memperbarui daftar pengguna
			handleClose();
		} catch (err) {
			// Normalisasi error dari backend supaya tidak crash
			const status = err?.response?.status;
			const data = err?.response?.data;

			// Jika backend mengembalikan validasi per-field
			if (data?.errors) {
				const nextFieldErrors = {};
				Object.keys(data.errors).forEach((k) => {
					nextFieldErrors[k] = Array.isArray(data.errors[k])
						? data.errors[k].join(" ")
						: data.errors[k];
				});
				setFieldErrors(nextFieldErrors);
				setError(data.message || "Validation failed");
			} else if (
				status === 409 ||
				(data && /already/i.test(String(data.message || "")))
			) {
				// email conflict (atau custom pesan backend)
				setFieldErrors({ email: "Email sudah dipakai" });
				setError("Email sudah dipakai");
			} else {
				setError(data?.message || "Failed to add user");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<motion.div
					initial={{ scale: 0.8, y: 40, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					exit={{ scale: 0.8, y: 40, opacity: 0 }}
					transition={{ type: "spring", stiffness: 400, damping: 25 }}
					className="bg-white rounded-lg w-full max-w-md">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold">
								Add New User (Admin Only)
							</h2>
							<button
								type="button"
								onClick={handleClose}
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
									className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
										fieldErrors.email
											? "border-red-400 focus:ring-red-300"
											: "border-gray-300 focus:ring-blue-500 focus:border-transparent"
									}`}
									placeholder="Enter email"
									required
									aria-invalid={fieldErrors.email ? "true" : "false"}
									aria-describedby={
										fieldErrors.email ? "email-error" : undefined
									}
								/>
							</div>
							{fieldErrors.email && (
								<p id="email-error" className="text-red-600 text-sm mt-1">
									{fieldErrors.email}
								</p>
							)}
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
						<button
							type="submit"
							disabled={isLoading}
							className={`flex-1 w-full outline-none focus:outline-none transition-all bg-chill-yellow text-black font-medium px-6 py-2 rounded-lg border-yellow-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center justify-center gap-2 ${
								isLoading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Membuat akun...
								</>
							) : (
								<>Tambah User</>
							)}
						</button>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default AddUserModal;
