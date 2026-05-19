import { useState } from "react";
import { X, Upload, CreditCard, Loader2, Copy } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useLockBodyScroll from "@/hooks/utils/useLockBodyScroll";
import { formatDateDay } from "@/utils/dateFormatter";
export function PaymentModal({ booking, onClose, onSubmit, mentor }) {
	useLockBodyScroll(true);

	const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
	const [proofImage, setProofImage] = useState(null);
	const [proofPreview, setProofPreview] = useState(null); // Untuk pratinjau
	const [loading, setLoading] = useState(false); // Tambah state loading
	const [copied, setCopied] = useState(false);

	const handleCopyRekening = async () => {
		const text = "901298497261";
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// fallback sederhana
			const textarea = document.createElement("textarea");
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		// console.log("Uploaded File:", file); // Debug
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// Maksimal 5MB
				Swal.fire({
					icon: "error",
					title: "File terlalu besar",
					text: "Ukuran file maksimal 5MB.",
				});
				setProofImage(null);
				setProofPreview(null);
				return;
			}
			if (!["image/jpeg", "image/png"].includes(file.type)) {
				Swal.fire({
					icon: "error",
					title: "Tipe File Tidak Valid",
					text: "Silakan unggah gambar yang valid (JPG atau PNG).",
				});
				setProofImage(null);
				setProofPreview(null);
				return;
			}
			setProofImage(file); // Simpan objek File
			setProofPreview(URL.createObjectURL(file)); // Buat pratinjau
		} else {
			setProofImage(null);
			setProofPreview(null);
		}
	};

	const handleSubmit = async () => {
		// Hapus toast sebelumnya
		toast.dismiss();

		if (paymentMethod === "Transfer Bank" && !proofImage) {
			toast.error(
				<div className="text-center">
					<div className="font-semibold text-red-800 mb-2">
						❌ Pembayaran Gagal
					</div>
					<div className="text-sm text-gray-700">
						Bukti pembayaran tidak boleh kosong. Silakan unggah bukti transfer.
					</div>
				</div>,
				{
					duration: 5000,
					position: "top-center",
					style: {
						background: "#fef2f2",
						border: "1px solid #ef4444",
						padding: "16px",
						borderRadius: "8px",
						minWidth: "300px",
					},
				},
			);
			return;
		}
		// console.log("Submitting with proofImage:", proofImage); // Debug
		setLoading(true);
		try {
			// Pastikan onSubmit mengembalikan promise!
			await onSubmit({ paymentMethod, proofImage, booking });
		} finally {
			setLoading(false);
		}
	};

	// Calculate pricing dengan mode-aware logic untuk display saja
	const calculateMentorFee = () => {
		//Dari props mentor yang dikirim dari App.jsx dan HistoryTransactions
		return mentor.biayaPerSesi || mentor?.mentorBiayaPerSesi || 0;
	};

	// Untuk rincian: harga asli paket (tanpa diskon paket)
	const getPackageOriginalPrice = () => {
		if (!booking.paket) return 0;
		if (booking.paket.items && booking.paket.items.length > 0) {
			return booking.paket.items.reduce(
				(sum, item) =>
					sum + Math.max((item.harga || 0) - (item.diskon || 0), 0),
				0,
			);
		}
		return booking.paket.harga_dasar || booking.paket.harga || 0;
	};

	// Untuk diskon paket
	const getPackageDiscount = () =>
		booking.paket?.diskon && booking.paket.diskon > 0
			? booking.paket.diskon
			: booking.paket?.packageDiscount || 0;
	// Untuk total setelah diskon (untuk total pembayaran)
	const calculatePackageFee = () => {
		const original = getPackageOriginalPrice();
		const discount = getPackageDiscount();
		return Math.max(original - discount, 0);
	};

	// Update totalAmount untuk tampilan
	const totalAmount = (() => {
		// Total Harga: jumlahSementara dari backend (sudah dihitung dengan benar)
		if (
			booking.jumlahSementara !== undefined &&
			booking.jumlahSementara !== null
		) {
			return booking.jumlahSementara;
		}

		// Rincian Harga: Hitung manual dengan mentor fee + package fee
		const mentorFee = calculateMentorFee();
		const packageFee = calculatePackageFee();
		return mentorFee + packageFee;
	})();

	const modalContent = (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
				<motion.div
					initial={{ scale: 0.8, y: 40, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					exit={{ scale: 0.8, y: 40, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 25 }}
					className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
					{/* Header - Fixed */}
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-semibold">Selesaikan Pembayaran</h2>
						</div>
					</div>

					{/* Content - Scrollable */}
					<div className="p-6 overflow-y-auto flex-1 space-y-8">
						{/* Booking Summary - Kalo Bayar Langsung data booking diambil dari handleBooking di app.jsx, kalau bayar di history transaksi data dari props booking kiriman */}
						<div>
							<h3 className="font-semibold text-xl mb-4">
								Ringkasan Pemesanan
							</h3>
							<div className="bg-white border rounded-xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-600 mb-1">Kursus</p>
									<p className="font-medium">{booking.course?.courseName}</p>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Mentor</p>
									<p className="font-medium">
										{booking.mentor?.mentorName || booking.mentor?.user?.nama}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Tanggal</p>
									<p className="font-medium">{formatDateDay(booking.date)}</p>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Jam Mulai</p>
									<p className="font-medium">{booking.time.slice(0, 5)} WIB</p>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Metode Belajar</p>
									<p className="font-medium">
										{booking.mode === "online" ? "Online" : "Offline"}
									</p>
								</div>
								{booking.mode === "offline" && (
									<div>
										<p className="text-sm text-gray-600 mb-1">Location</p>
										<p className="font-medium">{booking.location}</p>
									</div>
								)}

								{/* Topik pindah ke bawah dan full width */}
								<div className="sm:col-span-2">
									<p className="text-sm text-gray-600 mb-1">
										Topik Yang Ingin Dibahas
									</p>
									<p className="font-medium">{booking.topic}</p>
								</div>

								<div className="sm:col-span-2 border-t pt-4 mt-2">
									{/* Breakdown pricing jika ada paket */}
									{booking.paket && (
										<div className="space-y-2 mb-4">
											<p className="text-sm font-semibold text-gray-700 mb-2">
												Rincian Biaya:
											</p>
											<div className="space-y-1 text-sm">
												<div className="flex justify-between font-medium text-base">
													<span>
														Paket:{" "}
														<span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm font-semibold">
															{booking.paket.name}
															{booking.paket.harga_dasar === 0 && (
																<span className="ml-2 text-gray-400 text-xs font-normal italic">
																	(Paket Normal)
																</span>
															)}
														</span>
													</span>
													<span>
														Rp{" "}
														{getPackageOriginalPrice().toLocaleString("id-ID")}
													</span>
												</div>
												<div className="flex justify-between font-medium text-base">
													<span>
														Mentor (
														{booking.mode === "offline"
															? "Sesi Offline"
															: "Sesi Online"}
														):
													</span>
													<span>
														Rp {calculateMentorFee().toLocaleString("id-ID")}
													</span>
												</div>
												{getPackageDiscount() > 0 && (
													<div className="flex justify-between text-green-600">
														<span>Diskon Paket:</span>
														<span>
															-Rp {getPackageDiscount().toLocaleString("id-ID")}
														</span>
													</div>
												)}
											</div>
										</div>
									)}

									<div className="border-t pt-2">
										<p className="text-lg font-bold text-gray-800">
											Total Pembayaran: Rp{totalAmount.toLocaleString("id-ID")}
										</p>
										<p className="text-xs text-gray-500 mt-1 italic">
											{booking.mode === "offline"
												? "Sudah termasuk biaya perjalanan mentor"
												: "Sudah termasuk biaya mentor"}{" "}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Payment Method */}
						<div>
							<h3 className="font-semibold text-lg mb-2">Metode Pembayaran</h3>
							{/* Catata kecil untuk menjelasakan kenapa belum banyak metode pembayaran */}
							<span className="text-xs text-gray-500 italic mb-2 block">
								Saat ini hanya tersedia metode Transfer Bank. Metode pembayaran
								lain akan segera menyusul.
							</span>
							<div className="space-y-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
								<label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
									<input
										type="radio"
										name="paymentMethod"
										value="Transfer Bank"
										checked={paymentMethod === "Transfer Bank"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="mr-3"
									/>
									<span>Transfer Bank</span>
								</label>
							</div>
						</div>

						{/* Bank Details */}
						{paymentMethod === "Transfer Bank" && (
							<div>
								<h3 className="font-semibold text-lg mb-4">
									Informasi Pembayaran
								</h3>
								<div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 shadow-sm">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs font-semibold text-slate-500">
												Transfer Bank
											</p>
											<div className="mt-1 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
												Seabank
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={handleCopyRekening}
												className="p-2 text-blue-700 border focus:outline-none border-blue-200 bg-white rounded-md hover:bg-blue-50 transition"
												aria-label="Salin nomor rekening">
												<Copy className="h-4 w-4" />
											</button>
											{copied && (
												<span
													className="text-xs text-green-600"
													aria-live="polite">
													Tersalin
												</span>
											)}
										</div>
									</div>

									<div className="mt-3">
										<p className="text-xs text-slate-500">No. Rekening</p>
										<p className="text-lg font-semibold tracking-wide text-slate-900">
											901298497261
										</p>
									</div>

									<div className="mt-2 text-sm text-slate-600">
										<span className="font-medium text-slate-700">a.n.</span>
										&nbsp;Muhamad Nur Raply
									</div>
								</div>

								{/* Upload Proof */}
								<div className="mt-6">
									<label className="block font-medium mb-2">
										Upload Bukti Pembayaran
									</label>
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
										{proofPreview ? (
											<div className="relative">
												<img
													src={proofPreview}
													alt="Payment proof"
													className="max-h-48 mx-auto rounded-md"
												/>
												<button
													onClick={() => {
														setProofImage(null);
														setProofPreview(null);
													}}
													className="mt-3 text-red-600 hover:text-red-700 font-medium">
													Hapus
												</button>
											</div>
										) : (
											<div>
												<Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
												<label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
													Klik untuk mengupload
													<input
														type="file"
														accept="image/*"
														onChange={handleFileChange}
														className="hidden"
													/>
												</label>
												<p className="text-sm text-gray-500 mt-1">
													PNG, JPG up to 5MB
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Footer - Fixed */}
					<div className="p-6 border-t bg-gray-50">
						<div className="flex justify-end space-x-3">
							<button
								onClick={onClose}
								className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-blue-500">
								Bayar Nanti
							</button>
							<button
								onClick={handleSubmit}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none hover:bg-blue-700 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
								disabled={loading}>
								{loading ? (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								) : (
									<CreditCard className="w-4 h-4 mr-2" />
								)}
								{loading ? "Memproses..." : "Konfirmasi"}
							</button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
	// Solusi agar modal muncul di atas elemen lain
	// tanpa terganggu oleh konteks z-index parent
	// dengan menggunakan React Portal
	return createPortal(modalContent, document.body);
}
