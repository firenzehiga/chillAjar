import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminFormMentorsPage({ onNavigate, mentorId }) {
	// Pastikan selalu dalam mode edit
	if (!mentorId) {
		onNavigate("admin-manage-mentors");
		return null;
	}

	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		rating: "",
		deskripsi: "",
		biayaPerSesi: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data mentor
	useEffect(() => {
		const fetchMentor = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				const response = await api.get(`/admin/mentor/${mentorId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const mentorData = response.data;
				setFormData({
					nama: mentorData.user?.nama || "",
					email: mentorData.user?.email || "",
					rating: mentorData.rating || 0,
					deskripsi: mentorData.deskripsi || "",
					biayaPerSesi: mentorData.biayaPerSesi || "",
				});
			} catch (err) {
				setError("Gagal mengambil data mentor");
			} finally {
				setLoading(false);
			}
		};

		fetchMentor();
	}, [mentorId]);

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
			const payload = {
				rating: formData.rating,
				deskripsi: formData.deskripsi,
				biayaPerSesi: formData.biayaPerSesi,
			};

			const response = await api.put(`/admin/mentor/${mentorId}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Mentor updated successfully!",
					confirmButtonColor: "#3B82F6",
				});
				onNavigate("admin-manage-mentors");
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Terjadi kesalahan saat memperbarui data.",
					confirmButtonColor: "#EF4444",
				});
			}
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"Gagal memperbarui mentor";
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
				onClick={() => onNavigate("admin-manage-mentors")}
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
					Edit Mentor
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="nama"
								className="block text-sm font-medium text-gray-700 mb-1">
								Name (Read-Only)
							</label>
							<input
								type="text"
								id="nama"
								name="nama"
								value={formData.nama}
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none focus:outline-none"
								readOnly
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1">
								Email (Read-Only)
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none focus:outline-none"
								readOnly
							/>
						</div>
					</div>
					<div className="mb-4">
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
							placeholder="Enter rating (e.g., 4.5)"
							step="0.1"
							min="0"
							max="5"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="deskripsi"
							className="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							id="deskripsi"
							name="deskripsi"
							value={formData.deskripsi}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
							placeholder="Enter mentor description"
							rows="4"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="biayaPerSesi"
							className="block text-sm font-medium text-gray-700 mb-1">
							Fee per Session
						</label>
						<input
							type="number"
							id="biayaPerSesi"
							name="biayaPerSesi"
							value={formData.biayaPerSesi}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
							placeholder="Enter fee per session (optional)"
						/>
					</div>

					{error && (
						<div className="mb-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className={`px-4 py-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
									: "bg-yellow-600 text-white hover:bg-yellow-700 outline-none focus:outline-none"
							}`}>
							{loading ? "Processing..." : "Update Mentor"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormMentorsPage;
