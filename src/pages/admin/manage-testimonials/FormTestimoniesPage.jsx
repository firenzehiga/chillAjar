import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle, X } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminFormTestimoniesPage({ onNavigate, testimonieId }) {
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

	// Pastikan testimonieId ada, jika tidak redirect ke admin-testimonials
	useEffect(() => {
		if (!testimonieId) {
			Swal.fire({
				icon: "error",
				title: "Invalid Testimony",
				text: "No testimony ID provided.",
				confirmButtonColor: "#EF4444",
			});
			onNavigate("admin-testimonial");
		}
	}, [testimonieId, onNavigate]);

	// Fetch data testimoni
	useEffect(() => {
		const fetchTestimonie = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				const response = await api.get(`/testimoni/${testimonieId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFormData({
					rating: response.data.rating || 0,
					komentar: response.data.komentar || "",
					tanggal: response.data.tanggal || "",
				});
				setAdditionalData({
					sesi_id: response.data.sesi_id || null,
					pelanggan_id: response.data.pelanggan_id || null,
					mentor_id: response.data.mentor_id || null,
				});
			} catch (err) {
				setError("Gagal mengambil data testimoni");
			} finally {
				setLoading(false);
			}
		};

		if (testimonieId) {
			fetchTestimonie();
		}
	}, [testimonieId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const payload = { ...formData };

			const response = await api.put(`/testimoni/${testimonieId}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Testimoni updated successfully!",
					confirmButtonColor: "#3B82F6",
				});
				onNavigate("admin-testimonial");
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Terjadi kesalahan saat menyimpan data.",
					confirmButtonColor: "#EF4444",
				});
			}
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

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-testimonial")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
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
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
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
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
									: "bg-yellow-600 text-white hover:bg-yellow-700 outline-none focus:outline-none"
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
