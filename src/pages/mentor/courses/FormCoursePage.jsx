import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle, Plus, X } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { getImageUrl } from "../../../utils/getImageUrl";
import { FormSkeletonCard } from "../../../components/Skeleton/FormSkeletonCard";

export function MentorFormCoursePage({ onNavigate, courseId, userData }) {
	const isEditMode = !!courseId;

	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
	});
	const [schedules, setSchedules] = useState([
		{
			tanggal: "",
			waktu: "",
			keterangan: "",
			tempat: "",
			gayaMengajar: "online",
		},
	]);
	const [initialSchedules, setInitialSchedules] = useState([]); // Menyimpan jadwal awal dari database
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
					});
					if (response.data.fotoKursus) {
						setFotoPreview(
							getImageUrl(
								response.data.fotoKursus || "/foto_kursus/default.jpg"
							)
						);
					}
					// Simpan jadwal awal dari database
					if (response.data.jadwal_kursus) {
						const initial = response.data.jadwal_kursus.map((jadwal) => ({
							id: jadwal.id,
							tanggal: jadwal.tanggal || "",
							waktu: jadwal.waktu || "",
							keterangan: jadwal.keterangan || "",
							tempat: jadwal.tempat || "",
							gayaMengajar: jadwal.gayaMengajar || "online",
						}));
						setInitialSchedules(initial);
						setSchedules(initial);
					}
				} catch (err) {
					setError("Gagal mengambil data kursus");
				} finally {
					setLoading(false);
				}
			};
			fetchCourse();
		} else {
			// Mode create, set initial schedules kosong
			setInitialSchedules([]);
		}
	}, [courseId, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 3 * 1024 * 1024) {
				Swal.fire({
					icon: "error",
					title: "Ukuran file terlalu besar",
					text: "Ukuran file maksimal 3MB.",
				});
				return;
			}
			setFotoKursus(file);
			setFotoPreview(URL.createObjectURL(file));
		}
	};

	const handleScheduleChange = (index, e) => {
		const { name, value } = e.target;
		const newSchedules = [...schedules];
		newSchedules[index] = { ...newSchedules[index], [name]: value };
		setSchedules(newSchedules);
	};

	const addSchedule = () => {
		setSchedules([
			...schedules,
			{
				tanggal: "",
				waktu: "",
				keterangan: "",
				tempat: "",
				gayaMengajar: "online",
			},
		]);
	};

	const removeSchedule = (index) => {
		// Hanya hapus jika indeks melebihi jumlah jadwal awal
		if (index >= initialSchedules.length) {
			setSchedules(schedules.filter((_, i) => i !== index));
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

			console.log("API Response after creating course:", response.data);

			if (response.status === 200 || response.status === 201) {
				let newCourseId;
				if (isEditMode) {
					newCourseId = courseId;
				} else {
					newCourseId =
						response.data.kursus?.id ||
						response.data.id ||
						response.data.course_id ||
						response.data.data?.id;

					if (!newCourseId) {
						const fetchCourseResponse = await api.get(
							`/kursus?namaKursus=${formData.namaKursus}`,
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);
						console.log("Fetch Course Response:", fetchCourseResponse.data);
						const latestCourse = fetchCourseResponse.data
							.filter((course) => course.namaKursus === formData.namaKursus)
							.sort(
								(a, b) => new Date(b.created_at) - new Date(a.created_at)
							)[0];
						newCourseId = latestCourse?.id;

						if (!newCourseId) {
							throw new Error("Gagal mendapatkan ID kursus setelah pembuatan");
						}
					}
				}

				// Tambahkan atau perbarui jadwal
				for (const schedule of schedules) {
					if (!schedule.tanggal || !schedule.waktu || !schedule.gayaMengajar) {
						throw new Error(
							"Setiap jadwal wajib mengisi tanggal, waktu, dan gayaMengajar."
						);
					}
					const jadwalPayload = {
						kursus_id: newCourseId,
						id: schedule.id || undefined, // Sertakan id jika ada, kosongkan jika tidak
						tanggal: schedule.tanggal,
						waktu: schedule.waktu,
						keterangan: schedule.keterangan || "",
						tempat: schedule.tempat || "",
						gayaMengajar: schedule.gayaMengajar,
					};
					console.log("Jadwal Payload:", jadwalPayload);
					const jadwalResponse = await api.post(
						"/mentor/atur-jadwal",
						jadwalPayload,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					console.log("Jadwal API Response:", jadwalResponse.data);
				}

				Swal.fire({
					icon: "success",
					title: "Success",
					text: isEditMode
						? "Course updated successfully!"
						: "Course created successfully!",
					showConfirmButton: false,
					timer: 1500,
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
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("mentor-manage-courses")}
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
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								placeholder="Enter course name"
								required
							/>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
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
								placeholder="Enter course description"
								rows="4"
							/>
						</div>
						<div>
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
									if (file)
										handleFileChange({
											target: { files: [file] },
										});
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
										<p className="mt-1 text-sm">
											Click or drag to upload image
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Schedules
						</label>
						{schedules.map((schedule, index) => (
							<div key={index} className="border p-4 rounded-lg mb-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor={`tanggal-${index}`}
											className="block text-sm font-medium text-gray-700 mb-1">
											Tanggal
										</label>
										<input
											type="date"
											id={`tanggal-${index}`}
											name="tanggal"
											value={schedule.tanggal}
											onChange={(e) => handleScheduleChange(index, e)}
											className="outline-none focus:outline-none w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
											required
										/>
									</div>
									<div>
										<label
											htmlFor={`waktu-${index}`}
											className="block text-sm font-medium text-gray-700 mb-1">
											Waktu
										</label>
										<input
											type="time"
											id={`waktu-${index}`}
											name="waktu"
											value={schedule.waktu}
											onChange={(e) => handleScheduleChange(index, e)}
											className="outline-none focus:outline-none w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
											required
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="mt-4">
										<label
											htmlFor={`keterangan-${index}`}
											className="block text-sm font-medium text-gray-700 mb-1">
											Keterangan
										</label>
										<input
											type="text"
											id={`keterangan-${index}`}
											name="keterangan"
											value={schedule.keterangan}
											onChange={(e) => handleScheduleChange(index, e)}
											className="outline-none focus:outline-none w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
											placeholder="Enter notes (optional)"
										/>
									</div>
									<div className="mt-4">
										<label
											htmlFor={`tempat-${index}`}
											className="block text-sm font-medium text-gray-700 mb-1">
											Tempat
										</label>
										<input
											type="text"
											id={`tempat-${index}`}
											name="tempat"
											value={schedule.tempat}
											onChange={(e) => handleScheduleChange(index, e)}
											className="outline-none focus:outline-none w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
											placeholder="Enter location (optional)"
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor={`gayaMengajar-${index}`}
											className="block text-sm font-medium text-gray-700 mb-1">
											Teaching Style
										</label>
										<select
											id={`gayaMengajar-${index}`}
											name="gayaMengajar"
											value={schedule.gayaMengajar}
											onChange={(e) => handleScheduleChange(index, e)}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
											required>
											<option value="online">Online</option>
											<option value="offline">Offline</option>
										</select>
									</div>
								</div>
								{/* Tombol hapus hanya muncul untuk jadwal yang ditambahkan setelah inisialisasi */}
								{index >= initialSchedules.length && (
									<button
										type="button"
										onClick={() => removeSchedule(index)}
										className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 outline-none focus:outline-none">
										<X className="w-5 h-5 inline mr-2" /> Remove Schedule
									</button>
								)}
							</div>
						))}
						<button
							type="button"
							onClick={addSchedule}
							className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 outline-none focus:outline-none">
							<Plus className="w-5 h-5 inline mr-2" /> Add Schedule
						</button>
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

export default MentorFormCoursePage;
