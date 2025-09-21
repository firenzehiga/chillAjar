import { useState, useEffect } from "react";
import {
	BookOpen,
	Loader2,
	AlertCircle,
	Plus,
	X,
	Package,
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

export function AdminFormCoursePage({ onNavigate, courseId }) {
	const queryClient = useQueryClient();

	const isEditMode = !!courseId;
	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
		mentorId: "", // Field baru untuk menyimpan ID mentor yang dipilih
	});
	const [mentors, setMentors] = useState([]); // Daftar mentor untuk dropdown
	const [packages, setPackages] = useState([]); // Daftar semua paket
	const [selectedPackages, setSelectedPackages] = useState([]); // Paket yang dipilih untuk kursus ini

	const [schedules, setSchedules] = useState([
		{
			tanggal: "",
			waktu: "",
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

	// Fetch daftar mentor, paket, dan data kursus (jika mode edit)
	useEffect(() => {
		const token = localStorage.getItem("token");
		const isAuthenticated = !!token;

		const fetchMentors = async () => {
			if (!isAuthenticated) return;
			try {
				const response = await api.get("/admin/mentor", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setMentors(response.data);
			} catch (err) {
				setError("Gagal mengambil daftar mentor");
			}
		};

		const fetchPackages = async () => {
			if (!isAuthenticated) return;
			try {
				const response = await api.get("/paket", {
					headers: { Authorization: `Bearer ${token}` },
				});
				// Pastikan struktur data sesuai kebutuhan frontend
				const paketData = Array.isArray(response.data)
					? response.data.map((p) => ({
							id: p.id,
							name: p.nama,
							price: p.harga_dasar,
							// Hitung totalPrice berdasarkan harga aktual items setelah diskon
							totalPrice: Array.isArray(p.items)
								? Math.max(
										p.items.reduce(
											(sum, item) =>
												sum +
												Math.max((item.harga || 0) - (item.diskon || 0), 0),
											0
										) - (p.diskon || 0),
										0
								  )
								: Math.max((p.harga_dasar || 0) - (p.diskon || 0), 0),
							description: p.deskripsi,
							items: Array.isArray(p.items)
								? p.items.map((item) => ({
										name: item.nama,
										price: Math.max((item.harga || 0) - (item.diskon || 0), 0),
										description: item.deskripsi,
								  }))
								: [],
							diskon: p.diskon || 0,
					  }))
					: [];
				setPackages(paketData);

				// Set default: aktifkan paket pertama jika ada
				if (!isEditMode && paketData.length > 0) {
					setSelectedPackages([
						{ package_id: paketData[0].id, is_active: true },
					]);
				}
			} catch (err) {
				setError("Gagal mengambil daftar paket");
			}
		};

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
					mentorId: response.data.mentor_id || "", // Set mentorId dari data kursus
				});
				if (response.data.fotoKursus) {
					setFotoPreview(getImageUrl(response.data.fotoKursus));
				}
				//  else {
				// 	setFotoPreview("/foto_kursus/default.jpg"); // <-- tambahkan ini!
				// }
				// Simpan jadwal awal dari database
				if (response.data.jadwal_kursus) {
					const initial = response.data.jadwal_kursus.map((jadwal) => ({
						id: jadwal.id,
						tanggal: jadwal.tanggal || "",
						waktu: jadwal.waktu || "",
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

				// Set selectedPackages berdasarkan visibilitas_paket
				if (
					response.data.visibilitas_paket &&
					Array.isArray(response.data.visibilitas_paket)
				) {
					setSelectedPackages(
						response.data.visibilitas_paket.map((vp) => ({
							package_id: vp.paket_id,
							is_active: !!vp.visibilitas,
						}))
					);
				} else if (response.data.packages) {
					// Fallback jika visibilitas_paket tidak ada
					setSelectedPackages(
						response.data.packages.map((pkg) => ({
							package_id: pkg.id,
							is_active: true,
						}))
					);
				} else {
					setSelectedPackages([]);
				}
			} catch (err) {
				setError("Gagal mengambil data kursus");
			} finally {
				setLoading(false);
			}
		};

		// Selalu fetch daftar mentor dan paket
		fetchMentors();
		fetchPackages();

		// Fetch data kursus jika mode edit
		if (isEditMode) {
			fetchCourse();
		} else {
			setInitialSchedules([]); // Mode create, set initial schedules kosong
			// New schedules start expanded
			setCollapsedSchedules({ 0: false });
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
				// Samakan batas ukuran file dengan form mentor
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

	const handlePackageToggle = (packageId) => {
		setSelectedPackages((prev) => {
			const existingIndex = prev.findIndex((p) => p.package_id === packageId);

			if (existingIndex >= 0) {
				// Package exists, toggle is_active
				const updated = prev.map((p) =>
					p.package_id === packageId ? { ...p, is_active: !p.is_active } : p
				);

				// Validasi: minimal harus ada 1 paket yang aktif
				const activeCount = updated.filter((p) => p.is_active).length;
				if (activeCount === 0) {
					Swal.fire({
						title: "Tidak bisa nonaktifkan semua paket",
						text: "Minimal harus ada 1 paket yang aktif untuk kursus ini",
						icon: "warning",
						confirmButtonText: "OK",
					});
					return prev; // Kembalikan state sebelumnya
				}

				return updated;
			} else {
				// Package tidak ada, tambahkan dengan is_active: true
				return [...prev, { package_id: packageId, is_active: true }];
			}
		});
	};

	// Helper function to check if package is active
	const isPackageActive = (packageId) => {
		const found = selectedPackages.find((p) => p.package_id === packageId);
		return found ? found.is_active : false;
	};

	const addSchedule = () => {
		const newIndex = schedules.length;
		setSchedules([
			...schedules,
			{
				tanggal: "",
				waktu: "",
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
			// Hapus state collapse untuk jadwal yang dihapus
			setCollapsedSchedules((prev) => {
				const newState = { ...prev };
				delete newState[index];
				// Reindex collapsed states untuk jadwal setelah yang dihapus
				const reindexed = {};
				Object.keys(newState).forEach((key) => {
					const keyNum = parseInt(key);
					if (keyNum > index) {
						reindexed[keyNum - 1] = newState[key];
					} else {
						reindexed[key] = newState[key];
					}
				});
				return reindexed;
			});
		}
	};

	// Function to duplicate a schedule
	const duplicateSchedule = (index) => {
		const scheduleToClone = { ...schedules[index] };
		// Clear the date and time for the duplicated schedule
		scheduleToClone.tanggal = "";
		scheduleToClone.waktu = "";
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

	// Function to toggle collapse state
	const toggleCollapse = (index) => {
		setCollapsedSchedules((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	// Function to get schedule summary
	const getScheduleSummary = () => {
		return schedules.filter((s) => s.tanggal && s.waktu).length;
	};

	// Helper function to get mentor name
	const getMentorName = () => {
		const selectedMentor = mentors.find(
			(mentor) => mentor.id.toString() === formData.mentorId.toString()
		);
		return selectedMentor?.user?.nama || "Mentor";
	};

	// Tab configuration
	const tabs = [
		{
			id: "info",
			label: "Info Dasar",
			icon: FileText,
			isValid: () =>
				formData.namaKursus && formData.mentorId && formData.deskripsi,
		},
		{
			id: "packages",
			label: "Paket",
			icon: Package,
			isValid: () => selectedPackages.filter((p) => p.is_active).length > 0,
		},
		{
			id: "schedules",
			label: "Jadwal",
			icon: Calendar,
			isValid: () => getScheduleSummary() > 0,
		},
		{
			id: "review",
			label: "Review & Save",
			icon: CheckCircle,
			isValid: () => true,
		},
	];

	// Tab navigation functions
	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
	};

	// Function to validate if form is ready for submission
	const isFormValid = () => {
		// Check basic info
		if (
			!formData.namaKursus.trim() ||
			!formData.deskripsi.trim() ||
			!formData.mentorId
		) {
			return false;
		}

		// Check if at least one package is active
		if (selectedPackages.filter((p) => p.is_active).length === 0) {
			return false;
		}

		// Check if at least one schedule is complete
		const hasValidSchedule = schedules.some(
			(schedule) => schedule.tanggal && schedule.waktu && schedule.gayaMengajar
		);

		return hasValidSchedule;
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
			payload.append("mentor_id", formData.mentorId); // Sertakan mentorId dalam payload

			// Kirim paket aktif sebagai paket_ids[] sesuai ekspektasi backend
			const paketIds = selectedPackages
				.filter((p) => p.is_active)
				.map((p) => p.package_id);
			paketIds.forEach((id, idx) => {
				payload.append(`paket_ids[${idx}]`, id);
			});

			// Kirim visibilitas paket (opsional, jika backend ingin status aktif/nonaktif per paket)
			selectedPackages.forEach((p, idx) => {
				payload.append(`visibilitas_paket[${idx}][paket_id]`, p.package_id);
				payload.append(
					`visibilitas_paket[${idx}][visibilitas]`,
					p.is_active ? 1 : 0
				);
			});

			if (fotoKursus) {
				payload.append("fotoKursus", fotoKursus);
			}

			let response;
			if (isEditMode) {
				payload.append("_method", "PUT");
				response = await api.post(`/kursus/${courseId}`, payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				response = await api.post("/kursus", payload, {
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
				const mentorName = getMentorName();
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
						keterangan: `Jadwal mentor ${mentorName}`, // Auto-fill keterangan
						tempat: schedule.tempat || "",
						gayaMengajar: schedule.gayaMengajar,
					};
					// console.log("Jadwal Payload:", jadwalPayload);
					const jadwalResponse = await api.post(
						"/jadwal-kursus", // Sesuaikan endpoint untuk admin
						jadwalPayload,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);
					// console.log("Jadwal API Response:", jadwalResponse.data);
				}
				queryClient.invalidateQueries(["adminMentors"]);
				queryClient.invalidateQueries(["courses"]);

				toast.success(
					isEditMode ? "Kursus berhasil diperbarui." : "Kursus berhasil dibuat."
				);
				onNavigate("admin-manage-courses");
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
			// console.error("Error details:", err.response ? err.response.data : err);
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
				</div>

				<form onSubmit={handleSubmit}>
					{/* Tab Content */}
					<div className="min-h-[500px]">
						{/* Tab 1: Info Dasar */}
						{activeTab === "info" && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="namaKursus"
											className="block text-sm font-medium text-gray-700 mb-1">
											Nama Kursus *
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
									<div>
										<label
											htmlFor="mentorId"
											className="block text-sm font-medium text-gray-700 mb-1">
											Mentor *
										</label>
										<select
											id="mentorId"
											name="mentorId"
											value={formData.mentorId}
											onChange={handleChange}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
											required>
											<option value="">Pilih mentor</option>
											{mentors.map((mentor) => (
												<option key={mentor.id} value={mentor.id}>
													{mentor.user?.nama || "Unknown Mentor"}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="fotoKursus"
											className="block text-sm font-medium text-gray-700 mb-1">
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
									<div>
										<label
											htmlFor="deskripsi"
											className="block text-sm font-medium text-gray-700 mb-1">
											Deskripsi *
										</label>
										<textarea
											id="deskripsi"
											name="deskripsi"
											value={formData.deskripsi}
											onChange={handleChange}
											className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
											placeholder="Enter course description"
											rows="8"
										/>
									</div>
								</div>

								{/* Schedule Summary in Info Tab */}
								{schedules.length > 0 && getScheduleSummary() > 0 && (
									<div className="mt-6">
										<h3 className="text-lg font-medium text-gray-900 mb-3">
											Ringkasan Jadwal
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
											{schedules
												.filter((s) => s.tanggal && s.waktu)
												.map((schedule, index) => (
													<div
														key={index}
														className="p-3 bg-green-50 border border-green-200 rounded-lg">
														<div className="flex items-center gap-2 text-sm text-green-800">
															<Calendar className="w-4 h-4" />
															{formatDate(schedule.tanggal)}
														</div>
														<div className="flex items-center gap-2 text-sm text-green-800 mt-1">
															<Clock className="w-4 h-4" />
															{formatTime(schedule.waktu, true)}
														</div>
														<div className="flex items-center gap-2 text-sm text-green-800 mt-1">
															<Monitor className="w-4 h-4" />
															{schedule.gayaMengajar}
														</div>
														{schedule.tempat && (
															<div className="flex items-center gap-2 text-sm text-green-800 mt-1">
																<MapPin className="w-4 h-4" />
																{schedule.tempat}
															</div>
														)}
													</div>
												))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Tab 2: Package Selection */}
						{activeTab === "packages" && (
							<div className="space-y-6">
								<div>
									<label className="flex items-center text-lg font-medium text-gray-900 mb-3">
										<Package className="w-5 h-5 mr-2" />
										Paket yang Tersedia untuk Kursus Ini
									</label>
									<p className="text-sm text-gray-600 mb-4">
										Toggle paket yang ingin diaktifkan untuk kursus ini. Minimal
										harus ada 1 paket yang aktif.
									</p>

									{packages.length === 0 ? (
										<div className="text-gray-500 text-sm">
											Belum ada paket tersedia
										</div>
									) : (
										<div className="space-y-3">
											{packages.map((pkg) => {
												const isActive = isPackageActive(pkg.id);

												return (
													<div
														key={pkg.id}
														className={`border rounded-lg p-4 transition-colors ${
															isActive
																? "border-yellow-300 bg-yellow-50"
																: "border-gray-200 bg-gray-50"
														}`}>
														<div className="flex items-start justify-between">
															<div className="flex-1">
																<div className="flex items-center gap-3 mb-2">
																	<h4 className="font-medium text-gray-900">
																		{pkg.name}
																	</h4>
																	<span className="text-lg font-bold text-yellow-600">
																		Rp {pkg.totalPrice.toLocaleString()}
																	</span>
																</div>
																<p className="text-sm text-gray-600 mb-3">
																	{pkg.description}
																</p>

																{/* Items preview */}
																<div>
																	<div className="text-xs text-gray-500 mb-1">
																		Items termasuk:
																	</div>
																	<div className="flex flex-wrap gap-1">
																		{pkg.items.map((item, idx) => (
																			<span
																				key={idx}
																				className="inline-block bg-white text-gray-700 px-2 py-1 rounded text-xs border">
																				{item.name}
																			</span>
																		))}
																	</div>
																</div>
															</div>

															{/* Toggle Switch */}
															<div className="flex flex-col items-end">
																<button
																	type="button"
																	onClick={() => handlePackageToggle(pkg.id)}
																	className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
																		isActive ? "bg-yellow-600" : "bg-gray-300"
																	}`}>
																	<span
																		className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
																			isActive
																				? "translate-x-6"
																				: "translate-x-1"
																		}`}
																	/>
																</button>
																<div className="mt-1 text-center">
																	<span
																		className={`text-xs font-medium ${
																			isActive
																				? "text-yellow-700"
																				: "text-gray-500"
																		}`}>
																		{isActive ? "Aktif" : "Nonaktif"}
																	</span>
																</div>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									)}

									{/* Summary */}
									{selectedPackages.length > 0 && (
										<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
											<div className="text-sm font-medium text-blue-800 mb-2">
												Paket Aktif:{" "}
												{selectedPackages.filter((p) => p.is_active).length}{" "}
												dari {packages.length} paket
											</div>
											<div className="space-y-1">
												{selectedPackages
													.filter((sp) => sp.is_active)
													.map((sp) => {
														const pkg = packages.find(
															(p) => p.id === sp.package_id
														);
														return pkg ? (
															<div
																key={sp.package_id}
																className="flex justify-between items-center text-sm">
																<span className="text-blue-700">
																	{pkg.name}
																</span>
																<span className="text-blue-600 font-medium">
																	Rp {pkg.totalPrice.toLocaleString()}
																</span>
															</div>
														) : null;
													})}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Tab 3: Schedules */}
						{activeTab === "schedules" && (
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-medium text-gray-900">
										Jadwal Kursus
									</h3>
									<div className="flex items-center gap-4">
										<div className="text-sm text-gray-600">
											{getScheduleSummary()} dari {schedules.length} jadwal
											lengkap
										</div>
										<button
											type="button"
											onClick={addSchedule}
											className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 outline-none focus:outline-none flex items-center gap-1">
											<Plus className="w-4 h-4" /> Tambah Jadwal
										</button>
									</div>
								</div>

								{/* Schedule Summary Cards */}
								{/* {schedules.length > 1 && (
									<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<div className="text-sm font-medium text-blue-800 mb-2">
											Ringkasan Jadwal:
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
											{schedules.map((schedule, index) => (
												<div
													key={index}
													className={`text-xs p-2 rounded border ${
														schedule.tanggal && schedule.waktu
															? "bg-green-50 border-green-200 text-green-800"
															: "bg-yellow-50 border-yellow-200 text-yellow-800"
													}`}>
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														{formatDate(schedule.tanggal) || "Belum diisi"}
													</div>
													<div className="flex items-center gap-1 mt-1">
														<Clock className="w-3 h-3" />
														{formatTime(schedule.waktu, true) || "Belum diisi"}
													</div>
													<div className="flex items-center gap-1 mt-1">
														<Monitor className="w-3 h-3" />
														{schedule.gayaMengajar}
													</div>
													{schedule.tempat && (
														<div className="flex items-center gap-1 mt-1">
															<MapPin className="w-3 h-3" />
															{schedule.tempat}
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)} */}

								{/* Schedule Forms */}
								<div className="space-y-3">
									{schedules.map((schedule, index) => {
										const isCollapsed = collapsedSchedules[index];

										return (
											<div
												key={index}
												className={`border rounded-lg transition-all ${
													isCollapsed
														? "border-gray-200 bg-gray-50"
														: "border-gray-200 bg-white"
												}`}>
												{/* Schedule Header */}
												<div className="p-3 flex items-center justify-between">
													<div className="flex items-center gap-3">
														<button
															type="button"
															onClick={() => toggleCollapse(index)}
															className="p-1 hover:bg-gray-200 rounded outline-none focus:outline-none">
															{isCollapsed ? (
																<ChevronDown className="w-4 h-4" />
															) : (
																<ChevronUp className="w-4 h-4" />
															)}
														</button>
														<h4 className="font-medium text-gray-900">
															Jadwal {index + 1}
															{index < initialSchedules.length && (
																<span className="ml-2 text-xs bg-blue-100 text-green-800 px-2 py-1 rounded">
																	Tersimpan
																</span>
															)}
														</h4>
														{isCollapsed && (
															<div className="text-sm text-gray-600 flex items-center gap-3">
																<span className="flex items-center gap-1">
																	<Calendar className="w-3 h-3" />
																	{formatDate(schedule.tanggal)}
																</span>
																<span className="flex items-center gap-1">
																	<Clock className="w-3 h-3" />
																	{formatTime(schedule.waktu, true)}
																</span>
																<span className="flex items-center gap-1">
																	<Monitor className="w-3 h-3" />
																	{schedule.gayaMengajar}
																</span>
															</div>
														)}
													</div>

													<div className="flex items-center gap-2">
														{/* Duplicate Button */}
														<button
															type="button"
															onClick={() => duplicateSchedule(index)}
															className="p-1.5 text-blue-600 hover:bg-blue-100 rounded outline-none focus:outline-none"
															title="Duplikasi jadwal ini">
															<Copy className="w-4 h-4" />
														</button>

														{/* Remove Button - hanya untuk jadwal baru */}
														{index >= initialSchedules.length && (
															<button
																type="button"
																onClick={() => removeSchedule(index)}
																className="p-1.5 text-red-600 hover:bg-red-100 rounded outline-none focus:outline-none"
																title="Hapus jadwal ini">
																<X className="w-4 h-4" />
															</button>
														)}
													</div>
												</div>

												{/* Schedule Form Content */}
												{!isCollapsed && (
													<div className="px-3 pb-3">
														<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
															<div>
																<label
																	htmlFor={`tanggal-${index}`}
																	className="block text-xs font-medium text-gray-700 mb-1">
																	Tanggal
																</label>
																<input
																	type="date"
																	id={`tanggal-${index}`}
																	name="tanggal"
																	value={schedule.tanggal}
																	onChange={(e) =>
																		handleScheduleChange(index, e)
																	}
																	className="outline-none focus:outline-none w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
																	required
																/>
															</div>
															<div>
																<label
																	htmlFor={`waktu-${index}`}
																	className="block text-xs font-medium text-gray-700 mb-1">
																	Waktu
																</label>
																<input
																	type="time"
																	id={`waktu-${index}`}
																	name="waktu"
																	value={schedule.waktu}
																	onChange={(e) =>
																		handleScheduleChange(index, e)
																	}
																	className="outline-none focus:outline-none w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
																	required
																/>
															</div>
															<div>
																<label
																	htmlFor={`gayaMengajar-${index}`}
																	className="block text-xs font-medium text-gray-700 mb-1">
																	Gaya Mengajar
																</label>
																<select
																	id={`gayaMengajar-${index}`}
																	name="gayaMengajar"
																	value={schedule.gayaMengajar}
																	onChange={(e) =>
																		handleScheduleChange(index, e)
																	}
																	className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
																	required>
																	<option value="online">Online</option>
																	<option value="offline">Offline</option>
																</select>
															</div>
														</div>

														{schedule.gayaMengajar === "offline" && (
															<div className="mt-3">
																<label
																	htmlFor={`tempat-${index}`}
																	className="block text-xs font-medium text-gray-700 mb-1">
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
																	className="outline-none focus:outline-none w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
																	placeholder="masukkan tempat (opsional)"
																/>
															</div>
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Tab 4: Review & Save */}
						{activeTab === "review" && (
							<div className="space-y-6">
								<h3 className="text-lg font-medium text-gray-900 mb-4">
									Review Data Kursus
								</h3>

								{/* Course Info Review */}
								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-medium text-gray-900 mb-3">
										Informasi Dasar
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Nama Kursus:
											</dt>
											<dd className="text-sm text-gray-900">
												{formData.namaKursus || "Belum diisi"}
											</dd>
										</div>
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Mentor:
											</dt>
											<dd className="text-sm text-gray-900">
												{getMentorName()}
											</dd>
										</div>
										<div className="md:col-span-2">
											<dt className="text-sm font-medium text-gray-500">
												Deskripsi:
											</dt>
											<dd className="text-sm text-gray-900">
												{formData.deskripsi || "Belum diisi"}
											</dd>
										</div>
									</div>
								</div>

								{/* Package Review */}
								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-medium text-gray-900 mb-3">
										Paket Aktif
									</h4>
									{selectedPackages.filter((p) => p.is_active).length > 0 ? (
										<div className="space-y-2">
											{selectedPackages
												.filter((sp) => sp.is_active)
												.map((sp) => {
													const pkg = packages.find(
														(p) => p.id === sp.package_id
													);
													return pkg ? (
														<div
															key={sp.package_id}
															className="flex justify-between items-center text-sm bg-white p-2 rounded">
															<span>{pkg.name}</span>
															<span className="font-medium text-yellow-600">
																Rp {pkg.totalPrice.toLocaleString()}
															</span>
														</div>
													) : null;
												})}
										</div>
									) : (
										<p className="text-sm text-gray-500">
											Belum ada paket yang dipilih
										</p>
									)}
								</div>

								{/* Schedule Review */}
								<div className="bg-gray-50 p-4 rounded-lg">
									<h4 className="font-medium text-gray-900 mb-3">
										Jadwal Kursus
									</h4>
									{getScheduleSummary() > 0 ? (
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
							</div>
						)}
					</div>

					{/* Tab Navigation Footer */}
					<div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
						<div className="flex gap-2">
							{activeTab !== "info" && (
								<button
									type="button"
									onClick={() => {
										const currentIndex = tabs.findIndex(
											(t) => t.id === activeTab
										);
										if (currentIndex > 0) {
											setActiveTab(tabs[currentIndex - 1].id);
										}
									}}
									className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 outline-none focus:outline-none">
									← Previous
								</button>
							)}
						</div>

						<div className="flex gap-2">
							{activeTab !== "review" && (
								<button
									type="button"
									onClick={() => {
										const currentIndex = tabs.findIndex(
											(t) => t.id === activeTab
										);
										if (currentIndex < tabs.length - 1) {
											setActiveTab(tabs[currentIndex + 1].id);
										}
									}}
									className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 outline-none focus:outline-none">
									Next →
								</button>
							)}

							{activeTab === "review" && (
								<button
									type="submit"
									disabled={loading || !isFormValid()}
									className={`px-6 py-2 rounded-lg transition-colors ${
										loading || !isFormValid()
											? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
											: "bg-yellow-600 text-white hover:bg-yellow-700 outline-none focus:outline-none"
									}`}>
									{loading ? (
										<>
											Memproses...{" "}
											<Loader2 className="w-4 h-4 mb-1 inline animate-spin text-yellow-500" />
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

					{error && (
						<div className="mt-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					{/* Form validation helper */}
					{!isFormValid() && (
						<div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div className="flex items-center text-yellow-600">
								<AlertCircle className="w-5 h-5 mr-2" />
								<span className="font-medium">Lengkapi Data Berikut:</span>
							</div>
							<ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
								{!formData.namaKursus.trim() && (
									<li>Nama kursus harus diisi</li>
								)}
								{!formData.deskripsi.trim() && <li>Deskripsi harus diisi</li>}
								{!formData.mentorId && <li>Mentor harus dipilih</li>}
								{selectedPackages.filter((p) => p.is_active).length === 0 && (
									<li>Minimal 1 paket harus aktif</li>
								)}
								{!schedules.some(
									(s) => s.tanggal && s.waktu && s.gayaMengajar
								) && (
									<li>
										Minimal 1 jadwal lengkap (tanggal, waktu, gaya mengajar)
									</li>
								)}
							</ul>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

export default AdminFormCoursePage;
