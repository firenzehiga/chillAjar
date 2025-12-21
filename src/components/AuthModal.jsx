import { useState } from "react";
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
	// Upload,
	// FileText,
	CheckCircle,
	UserCheck,
	// GraduationCap,
	// Shield,
	ExternalLink,
	Lightbulb,
} from "lucide-react";
import api from "@/api";
import Swal from "sweetalert2";
import logo from "@/assets/title.png";
import useAppStore from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { showToast } from "@/components/User/customToast";
import { FaWhatsapp } from "react-icons/fa";

export function AuthModal({ defaultMode = "login", onNavigate }) {
	// Get state and actions from store
	const { showAuthModal, setShowAuthModal, handleAuthSuccess } = useAppStore();
	const [isLoading, setIsLoading] = useState(false);
	// const [isUploadingDoc, setIsUploadingDoc] = useState(false);
	const [mode, setMode] = useState(defaultMode);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [attemptedSubmit, setAttemptedSubmit] = useState(false);
	// const [supportingDoc, setSupportingDoc] = useState(null);

	// Privacy Policy States
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "pelanggan",
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

	const handleModeChange = (newMode) => {
		setMode(newMode);
		setError("");
		setAgreedToTerms(false); // Reset privacy policy checkbox when switching modes
		setShowPassword(false);
		setShowConfirmPassword(false);
		setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
		setAttemptedSubmit(false);
	};

	// const handleFileChange = (e) => {
	// 	const file = e.target.files[0];
	// 	if (!file) return;

	// 	setIsUploadingDoc(true);

	// 	// Simulate upload delay for better UX
	// 	setTimeout(() => {
	// 		setSupportingDoc(file);
	// 		setIsUploadingDoc(false);
	// 	}, 1000);
	// };

	// const handleRemoveFile = () => {
	// 	setSupportingDoc(null);
	// 	setIsUploadingDoc(false);
	// 	// Reset the file input
	// 	const fileInput = document.querySelector('input[type="file"]');
	// 	if (fileInput) {
	// 		fileInput.value = "";
	// 	}
	// };
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setAttemptedSubmit(true);

		// Prevent multiple submissions
		if (isLoading) return;

		// Validasi form
		if (mode === "login") {
			if (!formData.email || !formData.password) {
				setError("Silakan isi semua kolom");
				return;
			}
		} else {
			if (
				!formData.name ||
				!formData.email ||
				!formData.password ||
				!formData.confirmPassword ||
				!formData.phone ||
				!formData.address
			) {
				setError("Silakan isi semua kolom yang diperlukan");
				return;
			}

			// Validasi privacy policy untuk register
			if (!agreedToTerms) {
				setError(
					"Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi"
				);
				return;
			}

			// Remove mentor document validation since mentor option is hidden
			// if (formData.role === "mentor" && !supportingDoc) {
			// 	setError("Silakan upload dokumen pendukung.");
			// 	return;
			// }
		}

		// Validate password confirmation for register
		if (mode === "register" && formData.password !== formData.confirmPassword) {
			setError("Password dan konfirmasi password tidak cocok");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		try {
			if (mode === "login") {
				const response = await api.post(
					"/login",
					{
						email: formData.email,
						password: formData.password,
					},
					{ skipGlobalError: true }
				); // Skip global error handling for login
				const { token, user } = response.data;

				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));

				showToast({
					type: "success",
					icon: "👋",
					title: "Berhasil login!",
					message: `Selamat datang kembali, ${user.nama}!`,
					position: "top-center",
					duration: 1500,
				});
				handleAuthSuccess(user.peran.toLowerCase(), user);
			} else {
				// Gunakan FormData agar bisa upload file (jika diperlukan di masa depan)
				const formPayload = new FormData();
				formPayload.append("nama", formData.name);
				formPayload.append("email", formData.email);
				formPayload.append("password", formData.password);
				formPayload.append("nomorTelepon", formData.phone);
				formPayload.append("alamat", formData.address);
				formPayload.append("peran", formData.role);
				// Document upload disabled since mentor registration is hidden
				// if (formData.role === "mentor" && supportingDoc) {
				// 	formPayload.append("dokumen_pendukung", supportingDoc);
				// }

				const response = await api.post("/register", formPayload, {
					headers: { "Content-Type": "multipart/form-data" },
					skipGlobalError: true,
				});
				const { token, user } = response.data;

				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));

				showToast({
					type: "success",
					title: "Registrasi Berhasil!",
					message: "Silakan login untuk melanjutkan.",
					duration: 3000,
				});
				handleModeChange("login");
			}
		} catch (error) {
			console.error(`${mode} failed:`, error);
			const msg =
				error.response?.data?.message ||
				"Terjadi kesalahan yang tidak diketahui";
			const statusCode = error.response?.status;

			// Dismiss any existing toasts before showing new one
			toast.dismiss();

			// Handle specific cases berdasarkan response dari backend
			if (
				msg.includes("Akun mentor Anda belum diverifikasi admin") ||
				msg.includes("belum diverifikasi") ||
				statusCode === 403
			) {
				showToast({
					type: "warning",
					title: "Akun Menunggu Verifikasi",
					message: "Akun mentor Anda sedang diproses oleh admin",
					tipText: "Estimasi: 1-2 hari kerja. Akan dikonfirmasi via email",
					duration: 4000,
				});
				setError("Akun menunggu verifikasi admin");
			} else if (
				statusCode === 401 ||
				(msg.toLowerCase().includes("email") &&
					msg.toLowerCase().includes("password"))
			) {
				// Untuk error login biasa (Unauthorized)
				showToast({
					type: "error",
					title: "Login Gagal",
					message: "Email atau password salah!",
					tipText: "Periksa kembali email dan password Anda",
					tipIcon: "💡",
				});
				setError("Email atau password salah!");
			} else if (mode === "register") {
				// Untuk error registrasi
				if (
					msg.toLowerCase().includes("email") &&
					msg.toLowerCase().includes("sudah")
				) {
					Swal.fire({
						icon: "error",
						title: "Email Sudah Terdaftar",
						text: "Email yang Anda gunakan sudah terdaftar. Silakan gunakan email lain atau login jika Anda sudah memiliki akun.",
						confirmButtonColor: "#EF4444",
						confirmButtonText: "Mengerti",
					});
					setError("Email sudah terdaftar");
				} else {
					// Error registrasi lainnya
					Swal.fire({
						icon: "error",
						title: "Registrasi Gagal",
						text: msg,
						confirmButtonColor: "#EF4444",
					});
					setError(msg);
				}
			} else {
				// Untuk error lainnya yang tidak terduga
				Swal.fire({
					icon: "error",
					title: "Terjadi Kesalahan",
					text: msg,
					confirmButtonColor: "#EF4444",
				});
				setError(msg);
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
				className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
				<motion.div
					initial={{ scale: 0.8, y: 40, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					exit={{ scale: 0.8, y: 40, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 25 }}
					className={`bg-white rounded-lg w-full ${
						mode === "login" ? "max-w-lg" : "max-w-2xl"
					} max-h-[90vh] overflow-y-auto`}>
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold">
								{mode === "login" ? "Masuk ke Akun Anda" : "Buat Akun"}
							</h2>
							<button
								type="button"
								onClick={() => setShowAuthModal(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors">
								<X className="w-5 h-5" />
							</button>
						</div>
					</div>

					<div className="p-6">
						{mode === "login" && (
							<div className="flex justify-center mb-6">
								<img src={logo} alt="ChillAjar Logo" className="h-24 w-auto" />
							</div>
						)}

						<form onSubmit={handleSubmit}>
							{mode === "register" && (
								<>
									<div className="mb-4">
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 mb-1">
											Nama Lengkap <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type="text"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Masukkan nama lengkap"
												required
											/>
										</div>
									</div>
									<div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 mb-1">
												Nomor Telepon (WhatsApp
												<FaWhatsapp
													className="inline-block ml-1 text-green-500"
													title="Pastikan nomor WhatsApp aktif untuk komunikasi terkait pembelajaran."
												/>
												) <span className="text-red-500">*</span>
											</label>
											<div className="relative">
												<Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
												<input
													type="text"
													name="phone"
													value={formData.phone}
													onChange={handleInputChange}
													className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="08xxxxxxxxxx"
													required
												/>
											</div>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-1">
												Email <span className="text-red-500">*</span>
											</label>
											<div className="relative">
												<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
												<input
													type="email"
													name="email"
													value={formData.email}
													onChange={handleInputChange}
													className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
													placeholder="your@email.com"
												/>
											</div>
										</div>
									</div>
									<div className="mb-4">
										<label
											htmlFor="address"
											className="block text-sm font-medium text-gray-700 mb-1">
											Alamat <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type="text"
												name="address"
												value={formData.address}
												onChange={handleInputChange}
												className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Masukkan alamat rumah Anda"
												required
											/>
										</div>
									</div>

									{/* <div className="mb-4">
										<label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-3">
											Daftar sebagai
										</label>
										<div className="grid grid-cols-1 gap-2"> */}
									{/* Pelanggan Option - Full width karena mentor di-hide */}
									{/* <label
												className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
													formData.role === "pelanggan"
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-gray-300"
												}`}>
												<input
													type="radio"
													name="role"
													value="pelanggan"
													checked={formData.role === "pelanggan"}
													onChange={handleInputChange}
													className="sr-only"
												/>
												<UserCheck
													className={`w-6 h-6 mb-1 ${
														formData.role === "pelanggan"
															? "text-blue-600"
															: "text-gray-400"
													}`}
												/>
												<span
													className={`font-medium text-xs ${
														formData.role === "pelanggan"
															? "text-blue-700"
															: "text-gray-600"
													}`}>
													Pelanggan
												</span>
												<span className="text-xs text-gray-500 text-center">
													Belajar dari mentor
												</span>
												{formData.role === "pelanggan" && (
													<div className="absolute top-1 right-1">
														<CheckCircle className="w-4 h-4 text-blue-600" />
													</div>
												)}
											</label> */}

									{/* Mentor Option - HIDDEN/COMMENTED */}
									{/* 
											<label
												className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
													formData.role === "mentor"
														? "border-blue-500 bg-blue-50"
														: "border-gray-200 hover:border-gray-300"
												}`}>
												<input
													type="radio"
													name="role"
													value="mentor"
													checked={formData.role === "mentor"}
													onChange={handleInputChange}
													className="sr-only"
												/>
												<GraduationCap
													className={`w-6 h-6 mb-1 ${
														formData.role === "mentor"
															? "text-blue-600"
															: "text-gray-400"
													}`}
												/>
												<span
													className={`font-medium text-xs ${
														formData.role === "mentor"
															? "text-blue-700"
															: "text-gray-600"
													}`}>
													Mentor
												</span>
												<span className="text-xs text-gray-500 text-center">
													Mengajar siswa
												</span>
												{formData.role === "mentor" && (
													<div className="absolute top-1 right-1">
														<CheckCircle className="w-4 h-4 text-blue-600" />
													</div>
												)}
											</label>
											*/}
									{/* </div>
									</div> */}

									{/* Document Upload Section - HIDDEN/COMMENTED */}
									{/* 
									{formData.role === "mentor" && (
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700 mb-3">
												Dokumen Pendukung
											</label>
											<div className="space-y-2">
												<div className="text-xs text-gray-500 mb-2">
													Upload sertifikat, ijazah, atau portofolio
													(PDF/JPG/PNG, max 5MB)
												</div>

												<div
													className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
														isUploadingDoc
															? "border-blue-400 bg-blue-50"
															: supportingDoc
															? "border-green-400 bg-green-50"
															: "border-gray-300 hover:border-gray-400"
													}`}>
													<input
														type="file"
														accept=".pdf,.jpg,.jpeg,.png"
														onChange={handleFileChange}
														disabled={isUploadingDoc}
														className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
														id="document-upload"
														required
													/>

													<div className="text-center">
														{isUploadingDoc ? (
															<div className="flex flex-col items-center">
																<Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-1" />
																<p className="text-xs font-medium text-blue-600">
																	Mengunggah dokumen...
																</p>
																<p className="text-xs text-gray-500">
																	Mohon tunggu sebentar
																</p>
															</div>
														) : supportingDoc ? (
															<div className="flex flex-col items-center">
																<div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
																	<FileText className="w-4 h-4 text-green-600" />
																</div>
																<p className="text-xs font-medium text-green-700">
																	Dokumen berhasil diunggah
																</p>
																<p className="text-xs text-gray-600 truncate max-w-full">
																	{supportingDoc.name}
																</p>
																<p className="text-xs text-gray-500">
																	{(supportingDoc.size / 1024 / 1024).toFixed(
																		2
																	)}{" "}
																	MB
																</p>
																<button
																	type="button"
																	onClick={handleRemoveFile}
																	className="text-xs text-red-500 hover:text-red-700 mt-1 underline">
																	klik untuk mengganti
																</button>
															</div>
														) : (
															<div className="flex flex-col items-center">
																<div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mb-2">
																	<Upload className="w-4 h-4 text-gray-400" />
																</div>
																<p className="text-xs font-medium text-gray-700">
																	Klik untuk mengunggah dokumen
																</p>
																<p className="text-xs text-gray-500">
																	atau seret file ke sini
																</p>
															</div>
														)}
													</div>
												</div>

												<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
													<div className="flex items-start space-x-2">
														<div className="flex-shrink-0">
															<div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
																<span className="text-blue-600 text-xs">
																	💡
																</span>
															</div>
														</div>
														<div className="text-xs text-blue-700">
															<p className="font-medium mb-1">
																Tips dokumen yang baik:
															</p>
															<ul className="space-y-1 text-blue-600">
																<li>• Sertifikat keahlian atau pendidikan</li>
																<li>• Portofolio hasil karya</li>
																<li>• CV atau resume terbaru</li>
															</ul>
														</div>
													</div>
												</div>
											</div>
										</div>
									)}
									*/}
								</>
							)}

							{mode === "register" ? (
								<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700 mb-1">
											Password <span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type={showPassword ? "text" : "password"}
												name="password"
												value={formData.password}
												onChange={handleInputChange}
												className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Buat password"
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

									<div>
										<label
											htmlFor="confirmPassword"
											className="block text-sm font-medium text-gray-700 mb-1">
											Konfirmasi Password{" "}
											<span className="text-red-500">*</span>
										</label>
										<div className="relative">
											<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type={showConfirmPassword ? "text" : "password"}
												name="confirmPassword"
												value={formData.confirmPassword}
												onChange={handleInputChange}
												className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Ulangi password"
												required
											/>
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
												{showConfirmPassword ? (
													<EyeOff className="w-5 h-5" />
												) : (
													<Eye className="w-5 h-5" />
												)}
											</button>
										</div>
									</div>
									{attemptedSubmit &&
										formData.password !== formData.confirmPassword &&
										error && (
											<p className="text-red-500 text-sm mt-2 ml-1">{error}</p>
										)}
								</div>
							) : (
								<>
									<div className="mb-4">
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1">
											Email
										</label>
										<div className="relative">
											<Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="your@email.com"
												required
											/>
										</div>
									</div>
									<div className="mb-6">
										<label
											htmlFor="password"
											className="block text-sm font-medium text-gray-700 mb-1">
											Password
										</label>
										<div className="relative">
											<Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
											<input
												type={showPassword ? "text" : "password"}
												name="password"
												value={formData.password}
												onChange={handleInputChange}
												className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
								</>
							)}

							{/* Privacy Policy Checkbox - Only show for register */}
							{mode === "register" && (
								<div className="mb-6">
									<div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
										<div className="flex-shrink-0 mt-0.5">
											<input
												type="checkbox"
												id="privacy-terms"
												checked={agreedToTerms}
												onChange={(e) => setAgreedToTerms(e.target.checked)}
												className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 focus:outline-none "
											/>
										</div>
										<div className="flex-1">
											<label
												htmlFor="privacy-terms"
												className="text-sm text-gray-700 cursor-pointer">
												Saya menyetujui{" "}
												<a
													href="/terms-conditions"
													target="_blank"
													className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center gap-1 cursor-pointer">
													Syarat & Ketentuan
													<ExternalLink className="w-3 h-3" />
												</a>
												&nbsp;dan&nbsp;
												<a
													href="/privacy-policy"
													target="_blank"
													className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center gap-1 cursor-pointer">
													Kebijakan Privasi
													<ExternalLink className="w-3 h-3" />
												</a>
												&nbsp;ChillAjar
											</label>
											<p className="text-xs text-gray-500 mt-1">
												Dengan mencentang kotak ini, Anda menyetujui untuk
												mengikuti aturan platform kami dan cara kami menangani
												data pribadi Anda.
											</p>
										</div>
									</div>
								</div>
							)}

							<button
								type="submit"
								disabled={isLoading || (mode === "register" && !agreedToTerms)}
								className={`w-full outline-none focus:outline-none transition-all bg-chill-blue text-white font-medium px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] flex items-center justify-center gap-2 ${
									isLoading || (mode === "register" && !agreedToTerms)
										? "opacity-50 cursor-not-allowed"
										: ""
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
										Belum punya akun?{" "}
										<button
											type="button"
											onClick={() => handleModeChange("register")}
											className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none outline-none">
											Daftar
										</button>
									</>
								) : (
									<>
										Sudah punya akun?{" "}
										<button
											type="button"
											onClick={() => handleModeChange("login")}
											className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none outline-none">
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
