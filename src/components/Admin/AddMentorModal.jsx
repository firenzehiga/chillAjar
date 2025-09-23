import React, { useState } from "react";
import {
	X,
	Mail,
	Lock,
	User,
	Eye,
	EyeOff,
	Phone,
	MapPin,
	Loader2,
	DollarSign,
	FileText,
	GraduationCap,
	AlertCircle,
} from "lucide-react";
import api from "@/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export function AddMentorModal({ isOpen, onClose, onMentorAdded }) {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		address: "",
		biayaPerSesi: "25000", // Default value
		deskripsi: "",
	});

	if (!isOpen) return null;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			biayaPerSesi: "25000",
			deskripsi: "",
		});
		setError("");
		setShowPassword(false);
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

		// Validasi form
		if (
			!formData.name ||
			!formData.email ||
			!formData.password ||
			!formData.phone ||
			!formData.address
		) {
			setError("Silakan isi semua kolom yang diperlukan");
			return;
		}

		setIsLoading(true);

		try {
			const payload = {
				nama: formData.name,
				email: formData.email,
				password: formData.password,
				nomorTelepon: formData.phone,
				alamat: formData.address,
				peran: "mentor",
				biayaPerSesi: formData.biayaPerSesi,
				deskripsi: formData.deskripsi,
			};

			const response = await api.post("/register", payload, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
					"Content-Type": "application/json",
				},
			});

			const { user, mentor } = response.data;

			Swal.fire({
				icon: "success",
				title: "Mentor Berhasil Ditambahkan!",
				text: `Mentor ${user.nama} telah berhasil didaftarkan dengan status aktif.`,
				confirmButtonColor: "#3B82F6",
			});

			// Notify parent component
			if (onMentorAdded) {
				onMentorAdded({ ...user, mentor });
			}

			handleClose();
		} catch (error) {
			console.error("Add mentor failed:", error);
			const msg =
				error.response?.data?.message ||
				"Terjadi kesalahan yang tidak diketahui";

			setError(msg);

			// Show detailed error for debugging
			if (error.response?.status === 422) {
				const validationErrors = error.response.data.errors;
				if (validationErrors) {
					const errorMessages = Object.values(validationErrors).flat();
					setError(errorMessages.join(", "));
				}
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
					transition={{ type: "spring", stiffness: 300, damping: 25 }}
					className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold flex items-center">
								<GraduationCap className="w-6 h-6 mr-2 text-yellow-600" />
								Tambah Mentor Baru
							</h2>
							<button
								type="button"
								onClick={handleClose}
								className="text-gray-500 hover:text-gray-700 transition-colors">
								<X className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="p-6">
						<form onSubmit={handleSubmit}>
							{/* Nama & Email */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Nama Lengkap
									</label>
									<div className="relative">
										<User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											placeholder="Masukkan nama lengkap"
											required
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Alamat Email
									</label>
									<div className="relative">
										<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											placeholder="Masukkan email"
											required
										/>
									</div>
								</div>
							</div>

							{/* Phone & Password */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Nomor Telepon (WhatsApp)
									</label>
									<div className="relative">
										<Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
										<input
											type="text"
											name="phone"
											value={formData.phone}
											onChange={handleInputChange}
											className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											placeholder="Masukkan nomor whatsapp"
											required
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Kata Sandi
									</label>
									<div className="relative">
										<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
											placeholder="Masukkan kata sandi"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
											{showPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
								</div>
							</div>

							{/* Address */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Alamat
								</label>
								<div className="relative">
									<MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="text"
										name="address"
										value={formData.address}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Masukkan alamat"
										required
									/>
								</div>
							</div>

							{/* Biaya Per Sesi */}
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Biaya Per Sesi (Rp)
								</label>
								<div className="relative">
									<DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="number"
										name="biayaPerSesi"
										value={formData.biayaPerSesi}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="25000"
										min="0"
									/>
								</div>
								<p className="text-xs text-gray-500 mt-1">
									Default: Rp 25.000 per sesi
								</p>
							</div>

							{/* Deskripsi */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Deskripsi Mentor (Opsional)
								</label>
								<div className="relative">
									<FileText className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
									<textarea
										name="deskripsi"
										value={formData.deskripsi}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Ceritakan sedikit tentang keahlian dan pengalaman mentor..."
										rows="3"
									/>
								</div>
							</div>

							{error && (
								<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
									<div className="flex items-center">
										<AlertCircle className="w-5 h-5 text-red-500 mr-2" />
										<p className="text-red-700 text-sm">{error}</p>
									</div>
								</div>
							)}

							{/* Info Box */}
							<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<div className="flex items-start space-x-2">
									<div className="flex-shrink-0">
										<div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-blue-600 text-xs">ℹ️</span>
										</div>
									</div>
									<div className="text-xs text-blue-700">
										<p className="font-medium mb-1">Informasi:</p>
										<ul className="space-y-1 text-blue-600">
											<li>• Mentor akan langsung aktif setelah dibuat</li>
											<li>• Email & password akan digunakan untuk login</li>
											<li>• Dokumen pendukung dapat diupload nanti</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									type="button"
									onClick={handleClose}
									className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
									Batal
								</button>
								<button
									type="submit"
									disabled={isLoading}
									className={`flex-1 outline-none focus:outline-none transition-all bg-chill-yellow text-black font-medium px-6 py-2 rounded-lg border-yellow-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center justify-center gap-2 ${
										isLoading ? "opacity-50 cursor-not-allowed" : ""
									}`}>
									{isLoading ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											Membuat Mentor...
										</>
									) : (
										<>
											<GraduationCap className="w-5 h-5" />
											Tambah Mentor
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default AddMentorModal;
