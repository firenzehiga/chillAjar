import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Phone, MapPin } from "lucide-react";
import api from "../api"; // Sesuaikan path ke file api.jsx
import Swal from "sweetalert2";

export function AuthModal({
	isOpen,
	onClose,
	onSuccess,
	defaultMode = "login",
}) {
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

				onSuccess(user.peran.toLowerCase(), user);
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
			setError(error.response?.data?.message || "Something went wrong!");
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							{mode === "login"
								? "Welcome Back to ChillAjar"
								: "Create Account"}
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					{mode === "register" && (
						<>
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Full Name
								</label>
								<div className="relative">
									<User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your full name"
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
										name="phone"
										value={formData.phone}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your phone number"
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
										name="address"
										value={formData.address}
										onChange={handleInputChange}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your address"
										required
									/>
								</div>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Register as
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
							Email Address
						</label>
						<div className="relative">
							<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
								placeholder="Enter your email"
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
								placeholder="Enter your password"
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
						{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
						{mode === "login" && (
							<p className="text-sm text-gray-500 mt-2">
								Demo accounts:
								<br />
								Admin: admin@example.com / admin123
								<br />
								Mentor: mentor@example.com / mentor123
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-chill-yellow text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
						{mode === "login" ? "Sign In" : "Create Account"}
					</button>

					<div className="mt-4 text-center text-sm text-gray-600">
						{mode === "login" ? (
							<>
								Don't have an account?{" "}
								<button
									type="button"
									onClick={() => setMode("register")}
									className="text-yellow-600 hover:text-yellow-700 font-medium">
									Sign Up
								</button>
							</>
						) : (
							<>
								Already have an account?{" "}
								<button
									type="button"
									onClick={() => setMode("login")}
									className="text-yellow-600 hover:text-yellow-700 font-medium">
									Sign In
								</button>
							</>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

export default AuthModal;
