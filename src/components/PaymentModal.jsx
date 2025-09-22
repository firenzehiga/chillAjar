import React, { useState } from "react";
import { X, Upload, CreditCard, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export function PaymentModal({ booking, onClose, onSubmit, mentor }) {
	const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
	const [proofImage, setProofImage] = useState(null);
	const [proofPreview, setProofPreview] = useState(null); // Untuk pratinjau
	const [loading, setLoading] = useState(false); // Tambah state loading

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		// console.log("Uploaded File:", file); // Debug
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				// Maksimal 5MB
				Swal.fire({
					icon: "error",
					title: "File Too Large",
					text: "Ukuran file maksimal 5MB.",
				});
				setProofImage(null);
				setProofPreview(null);
				return;
			}
			if (!["image/jpeg", "image/png"].includes(file.type)) {
				Swal.fire({
					icon: "error",
					title: "Invalid File Type",
					text: "Please upload a valid image (JPG or PNG).",
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
				}
			);
			return;
		}
		// console.log("Submitting with proofImage:", proofImage); // Debug
		setLoading(true);
		try {
			// Pastikan onSubmit mengembalikan promise!
			await onSubmit({
				paymentMethod,
				proofImage,
				booking: {
					...booking,
					mode: booking.mode,
					amount: totalAmount,
				},
			});
		} finally {
			setLoading(false);
		}
	};

	// Calculate pricing dengan mode-aware logic untuk display saja
	const calculateMentorFee = () => {
		// Gunakan mode dari booking untuk menentukan biaya mentor
		if (booking.mode === "offline" && mentor.biayaPerSesiOffline) {
			return mentor.biayaPerSesiOffline;
		}

		// Fallback ke biaya online atau biayaPerSesi
		return mentor.biayaPerSesi || 0;
	};

	// Untuk rincian: harga asli paket (tanpa diskon paket)
	const getPackageOriginalPrice = () => {
		if (!booking.paket) return 0;
		if (booking.paket.items && booking.paket.items.length > 0) {
			return booking.paket.items.reduce(
				(sum, item) =>
					sum + Math.max((item.harga || 0) - (item.diskon || 0), 0),
				0
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

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
				{/* Header - Fixed */}
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Selesaikan Pembayaran</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Content - Scrollable */}
				<div className="p-6 overflow-y-auto flex-1 space-y-8">
					{/* Booking Summary - Kalo Bayar Langsung data booking diambil dari handleBooking di app.jsx, kalau bayar di history transaksi data dari props booking kiriman */}
					<div>
						<h3 className="font-semibold text-xl mb-4">Ringkasan Pemesanan</h3>
						<div className="bg-white border rounded-xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600 mb-1">Course</p>
								<p className="font-medium">{booking.course?.courseName}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Mentor</p>
								<p className="font-medium">
									{booking.mentor?.mentorName || booking.mentor?.user?.nama}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Date</p>
								<p className="font-medium">{booking.date}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Time</p>
								<p className="font-medium">{booking.time.slice(0, 5)} WIB</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Mode</p>
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
											<div className="flex justify-between">
												<span>Paket {booking.paket.name}:</span>
												<span>
													Rp {getPackageOriginalPrice().toLocaleString("id-ID")}
												</span>
											</div>
											<div className="flex justify-between">
												<span>
													Mentor (
													{booking.mode === "offline" ? "Offline" : "Online"}):
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
									<p className="text-xs text-gray-500 mt-1">
										{booking.mode === "offline"
											? "Biaya offline sudah termasuk"
											: "Sesi online"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div>
						<h3 className="font-semibold text-xl mb-4">Metode Pembayaran</h3>
						<div className="space-y-3">
							<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
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
							<h3 className="font-semibold text-xl mb-4">Detail Bank</h3>
							<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-2">
								<p>
									<span className="font-medium">Bank:</span> BCA
								</p>
								<p>
									<span className="font-medium">Account Number:</span>{" "}
									1234567890
								</p>
								<p>
									<span className="font-medium">Account Name:</span> ChillAjar
								</p>
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
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-yellow-500">
							Nanti
						</button>
						<button
							onClick={handleSubmit}
							className="px-4 py-2 bg-black text-white rounded-lg focus:outline-none hover:bg-yellow-700 flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
							disabled={loading}>
							{loading ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
								<CreditCard className="w-4 h-4 mr-2" />
							)}
							{loading ? "Memproses..." : "Lanjut Bayar"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
