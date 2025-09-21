import { useState, useEffect } from "react";
import {
	BookOpen,
	Loader2,
	AlertCircle,
	Plus,
	X,
	Lightbulb,
	ChevronDown,
	ChevronUp,
	Copy,
	Calendar,
	Clock,
	MapPin,
	Monitor,
	FileText,
	CheckCircle,
} from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { getImageUrl } from "../../../utils/getImageUrl";
import { FormSkeletonCard } from "../../../components/Skeleton/FormSkeletonCard";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AsyncImage } from "loadable-image";
import { formatDate, formatTime } from "../../../utils/dateFormatter";

export function MentorFormCoursePage({ onNavigate, courseId, userData }) {
	const isEditMode = !!courseId;
	const queryClient = useQueryClient();

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
	const [collapsedSchedules, setCollapsedSchedules] = useState({}); // State untuk collapse/expand jadwal
	const [activeTab, setActiveTab] = useState("info"); // Tab navigation state
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
							keterangan:
								jadwal.keterangan ||
								`Kursus dengan ${userData?.nama || "Mentor"}`,
							tempat: jadwal.tempat || "",
							gayaMengajar: jadwal.gayaMengajar || "online",
						}));
						setInitialSchedules(initial);
						setSchedules(initial);

						// Set existing schedules to be collapsed by default
						const initialCollapsedState = {};
						initial.forEach((_, index) => {
							initialCollapsedState[index] = true; // true = collapsed
						});
						setCollapsedSchedules(initialCollapsedState);
					}
				} catch (err) {
					setError("Gagal mengambil data kursus");
				} finally {
					setLoading(false);
				}
			};
			fetchCourse();
		} else {
			// Mode create, set initial schedules dengan auto-fill keterangan
			setInitialSchedules([]);
			setSchedules([
				{
					tanggal: "",
					waktu: "",
					keterangan: `Kursus dengan ${userData?.nama || "Mentor"}`,
					tempat: "",
					gayaMengajar: "online",
				},
			]);
			// New schedules start expanded
			setCollapsedSchedules({ 0: false });
		}
	}, [courseId, isEditMode, userData?.nama]);

	// Tab configuration for mentor form
	const tabs = [
		{
			id: "info",
			label: "Info Dasar",
			icon: FileText,
			description: "Informasi dasar kursus",
		},
		{
			id: "jadwal",
			label: "Jadwal",
			icon: Calendar,
			description: "Atur jadwal dan lokasi kursus",
		},
		{
			id: "review",
			label: "Review & Save",
			icon: CheckCircle,
			description: "Review dan simpan kursus",
		},
	];

	// Function to handle tab changes
	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
	};

	// Function to get tab status (completed/active/available)
	const getTabStatus = (tabId) => {
		if (tabId === activeTab) return "active";

		// Check if tab content is complete
		if (tabId === "info") {
			return formData.namaKursus && formData.deskripsi
				? "completed"
				: "available";
		}
		if (tabId === "jadwal") {
			return schedules.some((s) => s.tanggal && s.waktu)
				? "completed"
				: "available";
		}

		return "available"; // All tabs are always accessible
	};

	// Function to validate if form is ready for submission
	const isFormValid = () => {
		// Check basic info
		if (!formData.namaKursus.trim() || !formData.deskripsi.trim()) {
			return false;
		}

		// Check if at least one schedule is complete
		const hasValidSchedule = schedules.some(
			(schedule) => schedule.tanggal && schedule.waktu && schedule.gayaMengajar
		);

		return hasValidSchedule;
	};

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
		const newIndex = schedules.length;
		setSchedules([
			...schedules,
			{
				tanggal: "",
				waktu: "",
				keterangan: `Kursus dengan ${userData?.nama || "Mentor"}`,
				tempat: "",
				gayaMengajar: "online",
			},
		]);

		// New schedule should be expanded (not collapsed)
		setCollapsedSchedules((prev) => ({
			...prev,
			[newIndex]: false, // false = expanded
		}));
	};

	const removeSchedule = (index) => {
		// Hanya hapus jika indeks melebihi jumlah jadwal awal
		if (index >= initialSchedules.length) {
			setSchedules(schedules.filter((_, i) => i !== index));
		}
	};

	// Function to toggle collapse/expand schedules
	const toggleScheduleCollapse = (index) => {
		setCollapsedSchedules((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	// Function to duplicate a schedule
	const duplicateSchedule = (index) => {
		const scheduleToClone = { ...schedules[index] };
		// Clear the date and time for the duplicated schedule
		scheduleToClone.tanggal = "";
		scheduleToClone.waktu = "";
		// Auto-fill keterangan if empty
		if (!scheduleToClone.keterangan) {
			scheduleToClone.keterangan = `Kursus dengan ${
				userData?.nama || "Mentor"
			}`;
		}
		// Remove the ID if it exists (for new schedules)
		delete scheduleToClone.id;

		const newSchedules = [...schedules];
		newSchedules.splice(index + 1, 0, scheduleToClone);
		setSchedules(newSchedules);

		// Update collapsed states - shift indices and set new one as expanded
		const newCollapsedStates = {};
		Object.keys(collapsedSchedules).forEach((key) => {
			const idx = parseInt(key);
			if (idx > index) {
				newCollapsedStates[idx + 1] = collapsedSchedules[idx];
			} else {
				newCollapsedStates[idx] = collapsedSchedules[idx];
			}
		});
		newCollapsedStates[index + 1] = false; // New duplicated schedule is expanded

		setCollapsedSchedules(newCollapsedStates);
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

			// console.log("API Response after creating course:", response.data);

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
						// console.log("Fetch Course Response:", fetchCourseResponse.data);
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
					// console.log("Jadwal Payload:", jadwalPayload);
					const jadwalResponse = await api.post(
						"/mentor/atur-jadwal",
						jadwalPayload,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					// console.log("Jadwal API Response:", jadwalResponse.data);
				}
				queryClient.invalidateQueries(["courses"]);
				queryClient.invalidateQueries(["mentorCourses"]);

				toast.success(
					`Kursus ${isEditMode ? "diperbarui" : "dibuat"} berhasil!`
				);
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

	if (loading && isEditMode) {
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

				{/* Tab Navigation */}
				<div className="mb-6">
					<div className="border-b border-gray-200">
						<nav className="-mb-px flex space-x-8">
							{tabs.map((tab) => {
								const Icon = tab.icon;

								return (
									<button
										key={tab.id}
										type="button"
										onClick={() => handleTabChange(tab.id)}
										className={`focus:outline-none py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
											activeTab === tab.id
												? "border-yellow-500 text-yellow-600"
												: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
										}`}>
										<Icon className="w-4 h-4" />
										{tab.label}
									</button>
								);
							})}
						</nav>
					</div>
					{/* Tab Description */}
					{/* <div className="mt-2">
						<p className="text-sm text-gray-600">
							{tabs.find((tab) => tab.id === activeTab)?.description}
						</p>
					</div> */}
				</div>
				<form onSubmit={handleSubmit}>
					{/* Tab Content */}
					<div className="space-y-6">
						{/* Info Dasar Tab */}
						{activeTab === "info" && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="namaKursus"
											className="block text-sm font-medium text-gray-700 mb-2">
											Nama Kursus *
										</label>
										<input
											type="text"
											id="namaKursus"
											name="namaKursus"
											value={formData.namaKursus}
											onChange={handleChange}
											className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
											placeholder="Enter course name"
											required
										/>
									</div>
									<div>
										<label
											htmlFor="fotoKursus"
											className="block text-sm font-medium text-gray-700 mb-2">
											Gambar
											<span
												className="ml-2 inline-block text-xs text-yellow-500 cursor-help"
												title="Jika gambar yang tampil adalah placeholder abu-abu, berarti path terisi di database, namun tidak ditemukan dalam storage. Silakan unggah ulang gambar kursus.">
												<Lightbulb className="inline-block w-3 h-3 mb-1" />
											</span>
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
												<AsyncImage
													style={{ width: 200, height: 150 }}
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
														Klik atau seret file ke sini untuk mengunggah
													</p>
													<p className="mt-1 text-xs text-gray-500">
														Format: JPG, PNG, GIF. Maksimal 3MB.
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								<div>
									<label
										htmlFor="deskripsi"
										className="block text-sm font-medium text-gray-700 mb-2">
										Deskripsi *
									</label>
									<textarea
										id="deskripsi"
										name="deskripsi"
										value={formData.deskripsi}
										onChange={handleChange}
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
										placeholder="Enter course description"
										rows="4"
										required
									/>
								</div>
							</div>
						)}

						{/* Jadwal Tab */}
						{activeTab === "jadwal" && (
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium text-gray-900">
										Jadwal Kursus
									</h3>
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											addSchedule();
										}}
										className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
										<Plus className="w-4 h-4 mr-2" />
										Tambah Jadwal
									</button>
								</div>

								{schedules.map((schedule, index) => {
									const isCollapsed = collapsedSchedules[index];
									const isFromDatabase = index < initialSchedules.length;

									return (
										<div
											key={index}
											className="border border-gray-200 rounded-lg overflow-hidden">
											<div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<button
														type="button"
														onClick={(e) => {
															e.preventDefault();
															toggleScheduleCollapse(index);
														}}
														className="p-1 hover:bg-gray-200 rounded">
														{isCollapsed ? (
															<ChevronDown className="w-4 h-4" />
														) : (
															<ChevronUp className="w-4 h-4" />
														)}
													</button>
													<h4 className="font-medium text-gray-900">
														Jadwal {index + 1}
														{isFromDatabase && (
															<span className="ml-2 text-xs bg-blue-100 text-green-800 px-2 py-1 rounded">
																Tersimpan
															</span>
														)}
													</h4>
													{schedule.tanggal && schedule.waktu && (
														<div className="flex items-center text-sm text-gray-600">
															<Calendar className="w-4 h-4 mr-1" />
															{formatDate(schedule.tanggal)}
															<Clock className="w-4 h-4 ml-3 mr-1" />
															{formatTime(schedule.waktu, true)}
														</div>
													)}
												</div>

												<div className="flex items-center space-x-2">
													<button
														type="button"
														onClick={(e) => {
															e.preventDefault();
															duplicateSchedule(index);
														}}
														className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
														title="Duplicate schedule">
														<Copy className="w-4 h-4" />
													</button>
													{!isFromDatabase && (
														<button
															type="button"
															onClick={(e) => {
																e.preventDefault();
																removeSchedule(index);
															}}
															className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
															title="Remove schedule">
															<X className="w-4 h-4" />
														</button>
													)}
												</div>
											</div>

											{!isCollapsed && (
												<div className="p-4 space-y-4">
													<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
														<div>
															<label
																htmlFor={`tanggal-${index}`}
																className="block text-xs font-medium text-gray-700 mb-2">
																Tanggal *
															</label>
															<input
																type="date"
																id={`tanggal-${index}`}
																name="tanggal"
																value={schedule.tanggal}
																onChange={(e) => handleScheduleChange(index, e)}
																className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
																required
															/>
														</div>
														<div>
															<label
																htmlFor={`waktu-${index}`}
																className="block text-xs font-medium text-gray-700 mb-2">
																Waktu *
															</label>
															<input
																type="time"
																id={`waktu-${index}`}
																name="waktu"
																value={schedule.waktu}
																onChange={(e) => handleScheduleChange(index, e)}
																className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
																required
															/>
														</div>
														<div>
															<label
																htmlFor={`gayaMengajar-${index}`}
																className="block text-xs font-medium text-gray-700 mb-2">
																<Monitor className="w-4 h-4 inline mr-1" />
																Gaya Mengajar *
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
													{schedule.gayaMengajar === "offline" && (
														<div className="mt-3">
															<div>
																<label
																	htmlFor={`tempat-${index}`}
																	className="block text-xs font-medium text-gray-700 mb-2">
																	<MapPin className="w-4 h-4 inline mr-1" />
																	Tempat
																</label>
																<input
																	type="text"
																	id={`tempat-${index}`}
																	name="tempat"
																	value={schedule.tempat}
																	onChange={(e) =>
																		handleScheduleChange(index, e)
																	}
																	className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
																	placeholder="Enter location (optional)"
																/>
															</div>
														</div>
													)}
												</div>
											)}
										</div>
									);
								})}

								{schedules.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
										<p>No schedules yet. Add your first schedule above.</p>
									</div>
								)}
							</div>
						)}

						{/* Review & Save Tab */}
						{activeTab === "review" && (
							<div className="space-y-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Review Your Course
								</h3>

								{/* Course Info Summary */}
								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-medium text-gray-900 mb-3">
										Course Information
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<span className="text-sm text-gray-600">
												Nama Kursus:
											</span>
											<p className="font-medium">
												{formData.namaKursus || "Not specified"}
											</p>
										</div>
										<div>
											<span className="text-sm text-gray-600">Deskripsi:</span>
											<p className="font-medium">
												{formData.deskripsi || "Not specified"}
											</p>
										</div>
									</div>
									{fotoPreview && (
										<div className="mt-4">
											<span className="text-sm text-gray-600">Gambar:</span>
											<AsyncImage
												style={{ width: 150, height: 100 }}
												src={fotoPreview}
												alt="Course preview"
												className="mt-2 h-24 w-auto object-cover rounded-lg"
											/>
										</div>
									)}
								</div>

								{/* Schedule Summary */}
								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-medium text-gray-900 mb-3">
										Jadwal Kursus
									</h4>
									{schedules.length > 0 ? (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{schedules
												.filter((s) => s.tanggal && s.waktu)
												.map((schedule, index) => (
													<div
														key={index}
														className="bg-white p-3 rounded border">
														<div className="flex items-center gap-2 text-sm text-gray-700">
															<Calendar className="w-4 h-4" />
															{formatDate(schedule.tanggal)}
														</div>
														<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
															<Clock className="w-4 h-4" />
															{formatTime(schedule.waktu, true)}
														</div>
														<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
															<Monitor className="w-4 h-4" />
															{schedule.gayaMengajar}
														</div>
														{schedule.tempat && (
															<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
																<MapPin className="w-4 h-4" />
																{schedule.tempat}
															</div>
														)}
													</div>
												))}
										</div>
									) : (
										<p className="text-sm text-gray-500">
											Belum ada jadwal yang lengkap
										</p>
									)}
								</div>

								{error && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-4">
										<div className="flex items-center text-red-600">
											<AlertCircle className="w-5 h-5 mr-2" />
											<span className="font-medium">Error</span>
										</div>
										<p className="mt-1 text-sm text-red-600">{error}</p>
									</div>
								)}

								{/* Form validation helper */}
								{!isFormValid() && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
										<div className="flex items-center text-yellow-600">
											<AlertCircle className="w-5 h-5 mr-2" />
											<span className="font-medium">
												Lengkapi Data Berikut:
											</span>
										</div>
										<ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
											{!formData.namaKursus.trim() && (
												<li>Nama kursus harus diisi</li>
											)}
											{!formData.deskripsi.trim() && (
												<li>Deskripsi harus diisi</li>
											)}
											{!schedules.some(
												(s) => s.tanggal && s.waktu && s.gayaMengajar
											) && (
												<li>
													Minimal 1 jadwal lengkap (tanggal, waktu, gaya
													mengajar)
												</li>
											)}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								const currentIndex = tabs.findIndex(
									(tab) => tab.id === activeTab
								);
								if (currentIndex > 0) {
									handleTabChange(tabs[currentIndex - 1].id);
								}
							}}
							disabled={tabs.findIndex((tab) => tab.id === activeTab) === 0}
							className={`px-4 py-2 rounded-lg transition-colors ${
								tabs.findIndex((tab) => tab.id === activeTab) === 0
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							← Previous
						</button>

						<div className="flex space-x-3">
							{activeTab !== "review" ? (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										const currentIndex = tabs.findIndex(
											(tab) => tab.id === activeTab
										);
										if (currentIndex < tabs.length - 1) {
											handleTabChange(tabs[currentIndex + 1].id);
										}
									}}
									className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
									Next →
								</button>
							) : (
								<button
									type="submit"
									disabled={loading || !isFormValid()}
									className={`px-6 py-2 rounded-lg transition-colors ${
										loading || !isFormValid()
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-yellow-600 text-white hover:bg-yellow-700"
									}`}>
									{loading ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
											Processing...
										</>
									) : isEditMode ? (
										"Simpan"
									) : (
										"Buat Kursus"
									)}
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default MentorFormCoursePage;
