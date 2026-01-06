import React, { useState } from "react";
import Swal from "sweetalert2";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useSubmitTestimonialMutation } from "@/hooks/useTestimonial";
import useAppStore from "@/stores/useAppStore";
import { formatDate } from "@/utils/dateFormatter";

export const TestimoniModal = ({ isOpen, onClose, session }) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [hoverRating, setHoverRating] = useState(0);
	const today = new Date().toISOString().slice(0, 10);
	const [loading, setLoading] = useState(false);

	// Hook untuk submit testimoni
	const submitTestimonialMutation = useSubmitTestimonialMutation();

	if (!isOpen) return null;

	const setUpdatingSessionId = useAppStore((s) => s.setUpdatingSessionId);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		// Set global flag so session/transaction pages show "Memperbarui..."
		setUpdatingSessionId(session.id);
		try {
			// Gunakan mutation hook untuk submit testimoni
			await submitTestimonialMutation.mutateAsync({
				sessionId: session.id,
				payload: {
					rating,
					komentar: comment,
				},
			});

			toast.success("Testimoni berhasil dikirim.");
			setRating(5);
			setComment("");
			onClose();
			// Do NOT clear updatingSessionId here — pages will clear after query results reflect the update.
		} catch (err) {
			// Clear flag on error so UI doesn't get stuck
			setUpdatingSessionId(null);
			Swal.fire({
				icon: "error",
				title: "Gagal",
				text:
					err?.response?.data?.message ||
					err?.message ||
					"Gagal mengirim testimoni.",
				confirmButtonColor: "#3B82F6",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all">
			<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn relative">
				<button
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
					onClick={onClose}
					aria-label="Tutup"
					disabled={loading}>
					×
				</button>
				<h2 className="text-2xl font-bold mb-2 text-center text-blue-400">
					Beri Testimoni
				</h2>
				<p className="text-center text-gray-500 mb-6 text-md">
					Bagikan pengalamanmu mengikuti sesi ini!
				</p>
				<form onSubmit={handleSubmit}>
					<div className="mb-5 flex flex-col items-center">
						<label className="block mb-2 font-semibold text-gray-700">
							Rating:
						</label>
						<div className="flex gap-1 mb-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									type="button"
									key={star}
									className={`text-4xl transition-colors ${
										(hoverRating || rating) >= star
											? "text-yellow-400"
											: "text-gray-300"
									}`}
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(0)}
									aria-label={`Beri rating ${star}`}
									disabled={loading}>
									★
								</button>
							))}
						</div>
						<span className="text-sm font-semibold text-yellow-500">
							{rating} / 5
						</span>
					</div>
					<div className="mb-4 hidden">
						<label className="block mb-2 font-semibold text-gray-700">
							Tanggal Review:
						</label>
						<input
							type="text"
							className="w-full border border-gray-200 rounded-lg p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
							value={formatDate(today)}
							readOnly
						/>
					</div>
					<div className="mb-6">
						<label className="block mb-2 font-semibold text-gray-700">
							Komentar:
						</label>
						<textarea
							className="w-full border focus:outline-none border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition min-h-[80px] resize-none"
							rows={3}
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="Tulis pengalamanmu selama sesi..."
							disabled={loading}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							className=" focus:outline-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
							onClick={onClose}
							disabled={loading}>
							Batal
						</button>
						<button
							type="submit"
							className="focus:outline-none px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 font-semibold shadow-sm transition"
							disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="animate-spin w-3 h-3 mr-2 inline" />
									<span> Mengirim...</span>
								</>
							) : (
								<>
									<span>Kirim Testimoni</span>
									<Send className="w-4 h-4 ml-2 mb-1 inline" />
								</>
							)}
						</button>
					</div>
				</form>
			</div>
			<style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1); }
            `}</style>
		</div>
	);
};
