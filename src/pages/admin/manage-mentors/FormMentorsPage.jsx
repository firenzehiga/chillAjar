import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
	useMentorByIdQuery,
	useUpdateMentorMutation,
} from "@/hooks/useMentors";
import Swal from "sweetalert2";
import { FormSkeletonCard } from "@/components/Skeleton/FormSkeletonCard";
import toast from "react-hot-toast";

export default function AdminFormMentorsPage({ onNavigate, mentorId }) {
	if (!mentorId) {
		onNavigate("admin-manage-mentors");
		return null;
	}

	const queryClient = useQueryClient();
	const [dokumenPendukung, setDokumenPendukung] = useState(null);
	const [dokumenName, setDokumenName] = useState("");
	const [dokumenUrl, setDokumenUrl] = useState("");

	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		rating: "",
		deskripsi: "",
		biayaPerSesi: "",
		status: "pending",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { data: mentorData, isLoading: isMentorLoading } =
		useMentorByIdQuery(mentorId);

	// Fetch data mentor
	useEffect(() => {
		if (mentorData) {
			setFormData({
				nama: mentorData.user?.nama || "",
				email: mentorData.user?.email || "",
				rating: mentorData.rating || 0,
				deskripsi: mentorData.deskripsi || "",
				biayaPerSesi: mentorData.biayaPerSesi || "",
				biayaPerSesiOffline: mentorData.biayaPerSesiOffline || "",
				status: mentorData.status || "pending",
			});
			setDokumenName(
				mentorData.dokumen_pendukung
					? mentorData.dokumen_pendukung.split("/").pop()
					: ""
			);
			setDokumenUrl(
				mentorData.dokumen_pendukung
					? `${import.meta.env.VITE_API_URL || ""}/storage/${
							mentorData.dokumen_pendukung
					  }`
					: ""
			);
		}
	}, [mentorData]);

	useEffect(() => {
		if (isMentorLoading) {
			setLoading(true);
		} else {
			setLoading(false);
		}
	}, [isMentorLoading]);

	// Handler file
	const handleDokumenChange = (e) => {
		const file = e.target.files[0];
		setDokumenPendukung(file);
		setDokumenName(file ? file.name : "");
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Mutation untuk update mentor
	const updateMentorMutation = useUpdateMentorMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const payload = new FormData();
			payload.append("rating", formData.rating);
			payload.append("deskripsi", formData.deskripsi);
			payload.append("biayaPerSesi", formData.biayaPerSesi);
			payload.append("status", formData.status);
			if (dokumenPendukung) {
				payload.append("dokumen_pendukung", dokumenPendukung);
			}
			payload.append("_method", "PUT");

			// Update data mentor
			await updateMentorMutation.mutateAsync({ mentorId, payload });

			toast.success("Mentor berhasil diperbarui!");
			onNavigate("admin-manage-mentors");
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

	if (loading || isMentorLoading) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
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
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
								placeholder="Enter rating (e.g., 4.5)"
								step="0.1"
								min="0"
								max="5"
							/>
						</div>
						<div>
							<label
								htmlFor="status"
								className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<select
								id="status"
								name="status"
								value={formData.status}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none">
								<option value="pending">Pending</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
								<option value="rejected">Rejected</option>
							</select>
						</div>
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							placeholder="Enter fee per session (optional)"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Dokumen Pendukung (PDF/JPG/PNG)
						</label>
						<div
							className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
							onClick={() =>
								document.getElementById("dokumenPendukungInput").click()
							}
							style={{ minHeight: 120 }}>
							<input
								id="dokumenPendukungInput"
								type="file"
								accept=".pdf,.jpg,.jpeg,.png"
								onChange={handleDokumenChange}
								className="hidden"
							/>
							<div className="flex flex-col items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-10 w-10 text-gray-400 mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4m4 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0"
									/>
								</svg>
								<span className="text-gray-500 text-sm">
									{dokumenName ? (
										dokumenUrl ? (
											<a
												href={dokumenUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="underline text-blue-600">
												{dokumenName}
											</a>
										) : (
											dokumenName
										)
									) : (
										"Klik di sini untuk upload dokumen"
									)}
								</span>
								<span className="text-xs text-gray-400 mt-1">
									(PDF, JPG, JPEG, PNG)
								</span>
							</div>
						</div>
					</div>
					{error && (
						<div className="mb-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					<div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("admin-manage-mentors");
							}}
							className="px-4 py-2 rounded-lg bg-gray-200 font-medium text-gray-700 hover:bg-gray-300 transition-colors">
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`px-4 py-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
									: "bg-blue-600 text-white hover:bg-blue-700 outline-none focus:outline-none"
							}`}>
							{loading ? "Processing..." : "Update Mentor"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
