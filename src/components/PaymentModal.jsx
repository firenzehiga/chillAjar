import React, { useState } from "react";
import { X, Upload, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

export function PaymentModal({ booking, onClose, onSubmit, mentor, course }) {
	const [paymentMethod, setPaymentMethod] = useState("transfer");
	const [proofImage, setProofImage] = useState(null);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProofImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = () => {
		if (paymentMethod === "transfer" && !proofImage) {
			Swal.fire({
				icon: "error",
				title: "Payment Proof Required",
				text: "Please upload your payment proof before proceeding.",
			});
			return;
		}
		onSubmit({ paymentMethod, proofImage });
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
				<div className="p-6 overflow-y-auto flex-1">
					<div className="mb-6">
						<h3 className="font-medium text-lg mb-2">Booking Summary</h3>
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="mb-2">
								<span className="font-medium">Topik Yang Ingin Dibahas:</span>{" "}
								{booking.topic}
							</p>
							<p className="mb-2">
								<span className="font-medium">Course:</span>{" "}
								{course?.courseName}
							</p>
							<p className="mb-2">
								<span className="font-medium">Mentor:</span>{" "}
								{mentor?.mentorName}
							</p>
							<p className="mb-2">
								<span className="font-medium">Date:</span> {booking.date}
							</p>
							<p className="mb-2">
								<span className="font-medium">Time:</span> {booking.time}
							</p>
							<p className="mb-2">
								<span className="font-medium">Mode:</span> {booking.mode}
							</p>
							<p className="text-lg font-semibold mt-4">
								Total: ${totalAmount}
							</p>
						</div>
					</div>

					<div className="mb-6">
						<h3 className="font-medium mb-2">Payment Method</h3>
						<div className="space-y-2">
							<label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
								<input
									type="radio"
									name="paymentMethod"
									value="transfer"
									checked={paymentMethod === "transfer"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="mr-3"
								/>
								<span>Bank Transfer</span>
							</label>
						</div>
					</div>

					{paymentMethod === "transfer" && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Bank Details</h3>
							<div className="bg-blue-50 p-4 rounded-lg mb-4">
								<p className="mb-2">
									<span className="font-medium">Bank:</span> BCA
								</p>
								<p className="mb-2">
									<span className="font-medium">Account Number:</span>{" "}
									1234567890
								</p>
								<p className="mb-2">
									<span className="font-medium">Account Name:</span> BelajarWoy
								</p>
							</div>

							<div className="mt-4">
								<label className="block font-medium mb-2">
									Upload Payment Proof
								</label>
								<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
									{proofImage ? (
										<div className="relative">
											<img
												src={proofImage}
												alt="Payment proof"
												className="max-h-48 mx-auto"
											/>
											<button
												onClick={() => setProofImage(null)}
												className="mt-2 text-red-600 hover:text-red-700">
												Remove
											</button>
										</div>
									) : (
										<div>
											<Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
											<label className="cursor-pointer text-blue-600 hover:text-blue-700">
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
							Cancel
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
