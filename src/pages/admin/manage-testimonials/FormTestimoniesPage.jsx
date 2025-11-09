import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, X } from "lucide-react";
import Swal from "sweetalert2";
import { FormSkeletonCard } from "@/components/Skeleton/FormSkeletonCard";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	useTestimonieByIdQuery,
	useUpdateTestimonieMutation,
} from "@/hooks/useTestimonial";

export function AdminFormTestimoniesPage({ onNavigate, testimonieId }) {
	if (!testimonieId) {
		onNavigate("admin-testimonial");
		return null;
	}
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		rating: 0,
		komentar: "",
		tanggal: "",
	});
	const [additionalData, setAdditionalData] = useState({
		sesi_id: null,
		pelanggan_id: null,
		mentor_id: null,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data testimoni
	const { data: testimonieData, isLoading: isLoadingTestimonie } =
		useTestimonieByIdQuery(testimonieId);

	useEffect(() => {
		if (testimonieData) {
			setFormData({
				rating: testimonieData.rating || 0,
				komentar: testimonieData.komentar || "",
				tanggal: testimonieData.tanggal || "",
			});
			setAdditionalData({
				sesi_id: testimonieData.sesi_id || null,
				pelanggan_id: testimonieData.pelanggan_id || null,
				mentor_id: testimonieData.mentor_id || null,
			});
		}
	}, [testimonieData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const updateTestimonieMutation = useUpdateTestimonieMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const payload = { ...formData };

			await updateTestimonieMutation.mutateAsync({ testimonieId, payload });

			toast.success("Testimoni berhasil diperbarui.");
			onNavigate("admin-testimonial");
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"Gagal memperbarui testimoni";
			setError(errorMessage);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: errorMessage,
				confirmButtonColor: "#EF4444",
			});
			console.error("Error details:", err.response ? err.response.data : err);
		} finally {
			setLoading(false);
		}
	};

	if (loading || isLoadingTestimonie) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-testimonial")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-blue-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1024 1024"
						height="25px"
						width="25px">
						<path
							d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
							fill="#000000"
						/>
						<path
							d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
							fill="#000000"
						/>
					</svg>
				</div>
				<p className="translate-x-2">Cancel</p>
			</button>
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					Edit Testimony
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="rating"
								className="block text-sm font-medium text-gray-700 mb-1">
								Rating
							</label>
							<input
								type="number"
								id="rating"
								name="rating"
								value={formData.rating}
								onChange={handleChange}
								min="0"
								max="5"
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
								placeholder="Enter rating (0-5)"
								required
							/>
						</div>
					</div>
					<div className="mb-4">
						<label
							htmlFor="komentar"
							className="block text-sm font-medium text-gray-700 mb-1">
							Comment
						</label>
						<textarea
							id="komentar"
							name="komentar"
							value={formData.komentar}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							placeholder="Enter testimony comment"
							rows="4"
							required
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="tanggal"
							className="block text-sm font-medium text-gray-700 mb-1">
							Date
						</label>
						<input
							type="date"
							id="tanggal"
							name="tanggal"
							value={formData.tanggal}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							required
						/>
					</div>

					{error && (
						<div className="mb-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					<div className="flex justify-end space-x-4">
						<button
							type="submit"
							disabled={loading}
							className={`px-4 py-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
									: "bg-blue-600 text-white hover:bg-blue-700 outline-none focus:outline-none"
							}`}>
							{loading ? "Processing..." : "Update Testimony"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormTestimoniesPage;
