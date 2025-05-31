import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminFormCoursePage({ onNavigate, courseId }) {
	const isEditMode = !!courseId;

	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
		gayaMengajar: "online",
	});
	const [fotoKursus, setFotoKursus] = useState(null);
	const [fotoPreview, setFotoPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEditMode) {
			const fetchCourse = async () => {
				try {
					setLoading(true);
					const token = localStorage.getItem("token");
					const response = await api.get(`/kursus/${courseId}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setFormData({
						namaKursus: response.data.namaKursus,
						deskripsi: response.data.deskripsi,
						gayaMengajar: response.data.gayaMengajar || "online",
					});
					if (response.data.fotoKursus) {
						setFotoPreview(`/storage/${response.data.fotoKursus}`);
					}
				} catch (err) {
					setError("Gagal mengambil data kursus");
				} finally {
					setLoading(false);
				}
			};
			fetchCourse();
		}
	}, [courseId, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				setError("Ukuran file maksimal 2MB");
				return;
			}
			setFotoKursus(file);
			setFotoPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const payload = new FormData();
			payload.append("namaKursus", formData.namaKursus);
			payload.append("deskripsi", formData.deskripsi);
			payload.append("gayaMengajar", formData.gayaMengajar);
			if (fotoKursus) {
				payload.append("fotoKursus", fotoKursus);
			}

			let response;
			if (isEditMode) {
				payload.append("_method", "PUT");
				response = await api.post(`/mentor/kursus/${courseId}`, payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				response = await api.post("/mentor/kursus", payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				});
			}

			if (response.status === 200 || response.status === 201) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: isEditMode
						? "Course updated successfully!"
						: "Course created successfully!",
					confirmButtonColor: "#3B82F6",
				});
				onNavigate("mentor-manage-courses");
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
				(isEditMode ? "Gagal memperbarui kursus" : "Gagal membuat kursus");
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
				onClick={() => onNavigate("admin-manage-courses")}
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
					{isEditMode ? "Edit Course" : "Add New Course"}
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="namaKursus"
								className="block text-sm font-medium text-gray-700 mb-1">
								Course Name
							</label>
							<input
								type="text"
								id="namaKursus"
								name="namaKursus"
								value={formData.namaKursus}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
								placeholder="Enter course name"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="gayaMengajar"
								className="block text-sm font-medium text-gray-700 mb-1">
								Teaching Style
							</label>
							<select
								id="gayaMengajar"
								name="gayaMengajar"
								value={formData.gayaMengajar}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
								required>
								<option value="online">Online</option>
								<option value="offline">Offline</option>
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
							placeholder="Enter course description"
							rows="4"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="fotoKursus"
							className="block text-sm font-medium text-gray-700 mb-1">
							Course Image
						</label>
						<div
							className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer"
							onDragOver={(e) => {
								e.preventDefault();
								e.currentTarget.classList.add("border-yellow-500");
							}}
							onDragLeave={(e) => {
								e.preventDefault();
								e.currentTarget.classList.remove("border-yellow-500");
							}}
							onDrop={(e) => {
								e.preventDefault();
								e.currentTarget.classList.remove("border-yellow-500");
								const file = e.dataTransfer.files[0];
								if (file) handleFileChange({ target: { files: [file] } });
							}}>
							<input
								type="file"
								id="fotoKursus"
								name="fotoKursus"
								accept="image/*"
								onChange={handleFileChange}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
							/>
							{fotoPreview ? (
								<img
									src={fotoPreview}
									alt="Preview"
									className="mx-auto h-32 w-auto object-cover rounded-lg mb-2"
								/>
							) : (
								<div className="text-gray-500">
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M7 16l-4-4m0 0l4-4m-4 4h18"
										/>
									</svg>
									<p className="mt-1 text-sm">Click or drag to upload image</p>
								</div>
							)}
						</div>
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
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: "bg-yellow-600 text-white hover:bg-yellow-700"
							}`}>
							{loading
								? "Processing..."
								: isEditMode
								? "Update Course"
								: "Create Course"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormCoursePage;
