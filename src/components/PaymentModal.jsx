import React, { useState } from "react";
import { X, Upload, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

export function PaymentModal({ booking, onClose, onSubmit, mentor, course }) {
	const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
	const [proofImage, setProofImage] = useState(null);
	const [proofPreview, setProofPreview] = useState(null); // Untuk pratinjau

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		console.log("Uploaded File:", file); // Debug
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				// Maksimal 2MB
				Swal.fire({
					icon: "error",
					title: "File Too Large",
					text: "Ukuran file maksimal 2MB.",
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

	const handleSubmit = () => {
		if (paymentMethod === "Transfer Bank" && !proofImage) {
			Swal.fire({
				icon: "error",
				title: "Payment Proof Required",
				text: "Please upload your payment proof before proceeding.",
			});
			return;
		}
		console.log("Submitting with proofImage:", proofImage); // Debug
		onSubmit({ paymentMethod, proofImage, booking });
	};

	const totalAmount = booking.course.price_per_hour;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
				{/* Header - Fixed */}
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Complete Payment</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Content - Scrollable */}
				<div className="p-6 overflow-y-auto flex-1 space-y-8">
					{/* Booking Summary */}
					<div>
						<h3 className="font-semibold text-xl mb-4">Booking Summary</h3>
						<div className="bg-white border rounded-xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-600 mb-1">Course</p>
								<p className="font-medium">{course?.courseName}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Mentor</p>
								<p className="font-medium">{mentor?.mentorName}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Date</p>
								<p className="font-medium">{booking.date}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Waktu</p>
								<p className="font-medium">{booking.time.slice(0, 5)} WIB</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Mode</p>
								<p className="font-medium">{booking.mode}</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 mb-1">Lokasi</p>
								<p className="font-medium">{mentor?.location}</p>
							</div>

							{/* Topik pindah ke bawah dan full width */}
							<div className="sm:col-span-2">
								<p className="text-sm text-gray-600 mb-1">
									Topik Yang Ingin Dibahas
								</p>
								<p className="font-medium">{booking.topic}</p>
							</div>

							<div className="sm:col-span-2 border-t pt-4 mt-2">
								<p className="text-lg font-bold text-gray-800">
									Total: ${totalAmount}
								</p>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div>
						<h3 className="font-semibold text-xl mb-4">Payment Method</h3>
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
								<span>Bank Transfer</span>
							</label>
						</div>
					</div>

					{/* Bank Details */}
					{paymentMethod === "Transfer Bank" && (
						<div>
							<h3 className="font-semibold text-xl mb-4">Bank Details</h3>
							<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-2">
								<p>
									<span className="font-medium">Bank:</span> BCA
								</p>
								<p>
									<span className="font-medium">Account Number:</span>{" "}
									1234567890
								</p>
								<p>
									<span className="font-medium">Account Name:</span> BelajarWoy
								</p>
							</div>

							{/* Upload Proof */}
							<div className="mt-6">
								<label className="block font-medium mb-2">
									Upload Payment Proof
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
												Remove
											</button>
										</div>
									) : (
										<div>
											<Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
											<label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
												Click to upload
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
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
							Nanti
						</button>
						<button
							onClick={handleSubmit}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
							<CreditCard className="w-4 h-4 mr-2" />
							Complete Payment
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
