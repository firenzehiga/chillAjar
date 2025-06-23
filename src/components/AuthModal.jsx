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
import api from "../api";
import Swal from "sweetalert2";
import logo from "../assets/title.png";

export function AuthModal({
	isOpen,
	onClose,
	onSuccess,
	defaultMode = "login",
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [mode, setMode] = useState(defaultMode);
	const [showPassword, setShowPassword] = useState(false);
	const [supportingDoc, setSupportingDoc] = useState(null);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "pelanggan",
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

	const handleFileChange = (e) => {
		setSupportingDoc(e.target.files[0]);
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
			if (formData.role === "mentor" && !supportingDoc) {
				setError("Silakan upload dokumen pendukung.");
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

				onSuccess(user.peran.toLowerCase(), user);
			} else {
				// Gunakan FormData agar bisa upload file
				const formPayload = new FormData();
				formPayload.append("nama", formData.name);
				formPayload.append("email", formData.email);
				formPayload.append("password", formData.password);
				formPayload.append("nomorTelepon", formData.phone);
				formPayload.append("alamat", formData.address);
				formPayload.append("peran", formData.role);
				if (formData.role === "mentor" && supportingDoc) {
					formPayload.append("dokumen_pendukung", supportingDoc);
				}

				const response = await api.post("/register", formPayload, {
					headers: { "Content-Type": "multipart/form-data" },
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

				setMode("login");
			}
		} catch (error) {
			console.error(`${mode} failed:`, error);
			const msg = error.response?.data?.message || "Email atau password salah!";
			Swal.fire({
				icon: "error",
				title: "Error",
				text: msg,
			});
			setError(msg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							{mode === "login" ? "Sign In To Your Account" : "Create Account"}
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="p-6">
					{mode === "login" && (
						<div className="flex justify-center mb-6">
							<img src={logo} alt="ChillAjar Logo" className="h-16 w-auto" />
						</div>
					)}

					<form onSubmit={handleSubmit}>
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

								{formData.role === "mentor" && (
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Dokumen Pendukung (PDF/JPG/PNG)
										</label>
										<input
											type="file"
											accept=".pdf,.jpg,.jpeg,.png"
											onChange={handleFileChange}
											className="w-full border border-gray-300 rounded-lg px-3 py-2"
											required
										/>
										{error && (
											<p className="text-red-500 text-sm mt-2">{error}</p>
										)}
									</div>
								)}
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
							{error && (
								<p className="text-red-500 text-sm mt-3 ml-1">{error}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full outline-none focus:outline-none transition-all bg-chill-yellow text-black font-medium px-6 py-2 rounded-lg border-yellow-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center justify-center gap-2 ${
								isLoading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							{isLoading ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									{mode === "login" ? "Signing In..." : "Creating Account..."}
								</>
							) : (
								<>{mode === "login" ? "Sign In" : "Create Account"}</>
							)}
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
		</div>
	);
}

export default AuthModal;
