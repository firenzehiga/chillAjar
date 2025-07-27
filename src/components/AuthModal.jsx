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
} from "lucide-react";
import api from "../api"; // Sesuaikan path ke file api.jsx
import Swal from "sweetalert2";
import logo from "../assets/title.png"; // Ganti dengan path yang benar
import useAppStore from "../stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export function AuthModal({ defaultMode = "login" }) {
	// Get state and actions from store
	const { showAuthModal, setShowAuthModal, handleAuthSuccess } = useAppStore();
	const [isLoading, setIsLoading] = useState(false);
	const [mode, setMode] = useState(defaultMode);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "pelanggan", // Default ke pelanggan, sesuai backend
		phone: "",
		address: "",
	});
	const [error, setError] = useState("");

	if (!showAuthModal) return null;

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

		// Validasi form
		if (mode === "login") {
			if (!formData.email || !formData.password) {
				setError("Please fill in all fields");
				return;
			}
		} else {
			if (
				!formData.name ||
				!formData.email ||
				!formData.password ||
				!formData.phone ||
				!formData.address
			) {
				setError("Please fill in all required fields");
				return;
			}
		}

		setIsLoading(true);

		try {
			if (mode === "login") {
				const response = await api.post("/login", {
					email: formData.email,
					password: formData.password,
				});
				const { token, user } = response.data;

				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));

				Swal.fire({
					icon: "success",
					title: "Login Successful!",
					text: `Welcome back to ChillAjar! ${user.nama}`,
					timer: 2000,
					timerProgressBar: true,
					showConfirmButton: false,
					position: "top-end",
					toast: true,
				});

				handleAuthSuccess(user.peran.toLowerCase(), user);
			} else {
				const response = await api.post("/register", {
					nama: formData.name,
					email: formData.email,
					password: formData.password,
					nomorTelepon: formData.phone,
					alamat: formData.address,
					peran: formData.role,
				});
				const { token, user } = response.data;

				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));

				Swal.fire({
					icon: "success",
					title: "Registration Successful!",
					text: "Please login to continue.",
					confirmButtonColor: "#3B82F6",
				});

				setMode("login"); // Kembali ke mode login setelah registrasi
			}
		} catch (error) {
			console.error(`${mode} failed:`, error);
			// Swal.fire({
			// 	icon: "error",
			// 	title: "Error",
			// 	text: error.response?.data?.message || "Something went wrong!",
			// });
			setError("Email atau password salah!"); // di ganti ke swal aja
		} finally {
			setIsLoading(false); // Set isLoading menjadi false setelah proses selesai
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
					className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold">
								{mode === "login"
									? "Masuk ke Akun ChillAjar Anda"
									: "Create Account"}
							</h2>
							<button
								type="button"
								onClick={() => setShowAuthModal(false)}
								className="text-gray-500 hover:text-red-700 transition-colors outline-none focus:outline-none">
								<X className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="p-6">
						{/* Tambahkan logo di tengah untuk mode login */}
						{mode === "login" && (
							<div className="flex justify-center mb-6">
								<img
									src={logo}
									alt="ChillAjar Logo"
									className="h-16 w-auto" // Sesuaikan ukuran logo
								/>
							</div>
						)}

						<form onSubmit={handleSubmit}>
							{mode === "register" && (
								<>
									<div className="mb-4">
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

									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Nomor Telepon (WhatsApp Aktif)
										</label>
										<div className="relative">
											<Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type="text"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
												placeholder="Masukkan nomor whatsapp kamu"
												required
											/>
										</div>
									</div>

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

									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Daftar Sebagai
										</label>
										<select
											name="role"
											value={formData.role}
											onChange={handleInputChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
											<option value="pelanggan">Customer</option>
											<option value="mentor">Mentor</option>
										</select>
									</div>
								</>
							)}

							<div className="mb-4">
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
										placeholder="Masukkan alamat email"
										required
									/>
								</div>
							</div>

							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<div className="relative">
									<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Masukkan password"
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
								{error && (
									<p className="text-red-500 text-sm mt-3 ml-1">{error}</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isLoading} // Nonaktifkan tombol saat loading
								className={`w-full outline-none focus:outline-none transition-all bg-chill-yellow text-black font-medium px-6 py-2 rounded-lg border-yellow-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center justify-center gap-2 ${
									isLoading ? "opacity-50 cursor-not-allowed" : ""
								}`}>
								{isLoading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										{mode === "login" ? "Sedang Masuk..." : "Membuat Akun..."}
									</>
								) : (
									<>{mode === "login" ? "Masuk" : "Buat Akun"}</>
								)}
							</button>

							<div className="mt-4 text-center text-sm text-gray-600">
								{mode === "login" ? (
									<>
										Belum Punya Akun?{" "}
										<button
											type="button"
											onClick={() => setMode("register")}
											className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none outline-none">
											Daftar
										</button>
									</>
								) : (
									<>
										Anda sudah punya akun?{" "}
										<button
											type="button"
											onClick={() => setMode("login")}
											className="text-yellow-600 hover:text-yellow-700 font-medium focus:outline-none outline-none">
											Masuk
										</button>
									</>
								)}
							</div>
						</form>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

export default AuthModal;
