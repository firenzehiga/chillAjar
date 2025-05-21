import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

export function FormCoursePage({ onNavigate, courseId }) {
	const isEditMode = !!courseId;

	const [formData, setFormData] = useState({
		namaCourse: "",
		deskripsi: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEditMode) {
			const fetchCourse = async () => {
				try {
					setLoading(true);
					const token = localStorage.getItem("token");
					const response = await api.get(`/mentor/daftar-course/${courseId}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					setFormData({
						namaCourse: response.data.namaCourse,
						deskripsi: response.data.deskripsi,
					});
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const payload = {
				namaCourse: formData.namaCourse,
				deskripsi: formData.deskripsi,
			};

			if (isEditMode) {
				await api.put(`/courses/${courseId}`, payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Course updated successfully!",
					confirmButtonColor: "#3B82F6",
				});
			} else {
				await api.post("/courses", payload, {
					headers: { Authorization: `Bearer ${token}` },
				});
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Course created successfully!",
					confirmButtonColor: "#3B82F6",
				});
			}
			onNavigate("mentor-manage-courses");
		} catch (err) {
			setError(
				isEditMode ? "Gagal memperbarui kursus" : "Gagal membuat kursus"
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] text-gray-600">
				<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">{error}</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<button
				type="button"
				onClick={() => onNavigate("mentor-manage-courses")}
				className="px-4 py-2 mb-4 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg">
				<ArrowLeft className="w-4 h-4" />
				Back to My Courses
			</button>

			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					{isEditMode ? "Edit Course" : "Add New Course"}
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="namaCourse"
							className="block text-sm font-medium text-gray-700 mb-1">
							Course Name
						</label>
						<input
							type="text"
							id="namaCourse"
							name="namaCourse"
							value={formData.namaCourse}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter course name"
							required
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter course description"
							rows="4"
							required
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
									? "bg-gray-300 text-gray-500 cursor-not-allowed"
									: "bg-blue-600 text-white hover:bg-blue-700"
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

export default FormCoursePage;
