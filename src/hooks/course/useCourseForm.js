import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import showToast from "@/components/User/customToast";
import Swal from "sweetalert2";
import api from "@/api";
import { getImageUrl } from "@/utils/getImageUrl";

export default function useCourseForm({
	courseId,
	onNavigate,
	userRole = "mentor",
	userData = {},
	backNavigationTarget = "mentor-manage-courses",
}) {
	const isEditMode = !!courseId;
	const queryClient = useQueryClient();

	const isAdmin = userRole === "admin";
	const isMentor = userRole === "mentor";
	const mentorName = userData?.nama || "";

	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
		mentorId: "",
	});
	const [schedules, setSchedules] = useState([
		{
			tanggal: "",
			waktu: "",
			keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
			tempat: "",
			gayaMengajar: "online",
		},
	]);
	const [initialSchedules, setInitialSchedules] = useState([]);
	const [collapsedSchedules, setCollapsedSchedules] = useState({ 0: false });
	const [selectedPackages, setSelectedPackages] = useState([]);
	const [initialSelectedPackages, setInitialSelectedPackages] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [packages, setPackages] = useState([]);
	const [activeTab, setActiveTab] = useState("info");
	const [fotoKursus, setFotoKursus] = useState(null);
	const [fotoPreview, setFotoPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data on mount / when relevant inputs change
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;

			try {
				setLoading(true);

				if (isAdmin) {
					try {
						const mentorResponse = await api.get("/admin/mentor", {
							headers: { Authorization: `Bearer ${token}` },
						});
						setMentors(mentorResponse.data);
					} catch (err) {
						console.error("Failed to fetch mentors:", err);
					}

					try {
						const packageResponse = await api.get("/paket", {
							headers: { Authorization: `Bearer ${token}` },
						});
						const paketData = Array.isArray(packageResponse.data)
							? packageResponse.data.map((p) => ({
									id: p.id,
									name: p.nama,
									price: p.harga_dasar,
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
												price: Math.max(
													(item.harga || 0) - (item.diskon || 0),
													0
												),
												description: item.deskripsi,
										  }))
										: [],
									diskon: p.diskon || 0,
							  }))
							: [];
						setPackages(paketData);

						if (!isEditMode && paketData.length > 0) {
							setSelectedPackages([
								{ package_id: paketData[0].id, is_active: true },
							]);
						}
					} catch (err) {
						console.error("Failed to fetch packages:", err);
					}
				}

				if (isEditMode) {
					try {
						const response = await api.get(`/kursus/${courseId}`, {
							headers: { Authorization: `Bearer ${token}` },
						});

						setFormData({
							namaKursus: response.data.namaKursus,
							deskripsi: response.data.deskripsi,
							mentorId: response.data.mentor_id || "",
						});

						if (response.data.fotoKursus) {
							setFotoPreview(getImageUrl(response.data.fotoKursus));
						}

						if (response.data.jadwal_kursus) {
							const initial = response.data.jadwal_kursus.map((jadwal) => ({
								id: jadwal.id,
								tanggal: jadwal.tanggal || "",
								waktu: jadwal.waktu || "",
								keterangan:
									jadwal.keterangan ||
									(isMentor ? `Kursus dengan ${mentorName}` : ""),
								tempat: jadwal.tempat || "",
								gayaMengajar: jadwal.gayaMengajar || "online",
							}));
							setInitialSchedules(initial);
							setSchedules(initial);

							const initialCollapsedState = {};
							initial.forEach((_, index) => {
								initialCollapsedState[index] = true;
							});
							setCollapsedSchedules(initialCollapsedState);
						}

						if (isAdmin) {
							if (
								response.data.visibilitas_paket &&
								Array.isArray(response.data.visibilitas_paket)
							) {
								const mapped = response.data.visibilitas_paket.map((vp) => ({
									package_id: vp.paket_id,
									is_active: !!vp.visibilitas,
								}));
								setSelectedPackages(mapped);
								setInitialSelectedPackages(mapped);
							} else if (response.data.packages) {
								const mapped = response.data.packages.map((pkg) => ({
									package_id: pkg.id,
									is_active: true,
								}));
								setSelectedPackages(mapped);
								setInitialSelectedPackages(mapped);
							}
						}
					} catch (err) {
						setError("Gagal mengambil data kursus");
					}
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courseId, isEditMode, isAdmin, mentorName]);

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}, []);

	useEffect(() => {
		return () => {
			if (
				fotoPreview &&
				typeof fotoPreview === "string" &&
				fotoPreview.startsWith("blob:")
			) {
				try {
					URL.revokeObjectURL(fotoPreview);
				} catch (err) {
					/* no-op */
				}
			}
		};
	}, [fotoPreview]);

	const handleFileChange = useCallback((e) => {
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
	}, []);

	const handleScheduleChange = useCallback((index, e) => {
		const { name, value } = e.target;
		setSchedules((prev) => {
			const newSchedules = [...prev];
			newSchedules[index] = { ...newSchedules[index], [name]: value };
			return newSchedules;
		});
	}, []);

	const addSchedule = useCallback(() => {
		setSchedules((prev) => {
			const newIndex = prev.length;
			const next = [
				...prev,
				{
					tanggal: "",
					waktu: "",
					keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
					tempat: "",
					gayaMengajar: "online",
				},
			];
			setCollapsedSchedules((cs) => ({ ...cs, [newIndex]: false }));
			return next;
		});
	}, [mentorName]);

	const removeSchedule = useCallback((index) => {
		setSchedules((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const toggleScheduleCollapse = useCallback((index) => {
		setCollapsedSchedules((prev) => ({ ...prev, [index]: !prev[index] }));
	}, []);

	const duplicateSchedule = useCallback(
		(index) => {
			setSchedules((prev) => {
				const scheduleToClone = { ...prev[index] };
				scheduleToClone.tanggal = "";
				scheduleToClone.waktu = "";
				if (!scheduleToClone.keterangan && mentorName) {
					scheduleToClone.keterangan = `Kursus dengan ${mentorName}`;
				}
				delete scheduleToClone.id;

				const newSchedules = [...prev];
				newSchedules.splice(index + 1, 0, scheduleToClone);

				setCollapsedSchedules((cs) => {
					const newCollapsed = {};
					Object.keys(cs).forEach((key) => {
						const idx = parseInt(key);
						if (idx > index) {
							newCollapsed[idx + 1] = cs[idx];
						} else {
							newCollapsed[idx] = cs[idx];
						}
					});
					newCollapsed[index + 1] = false;
					return newCollapsed;
				});

				return newSchedules;
			});
		},
		[mentorName]
	);

	const handlePackageToggle = useCallback((packageId) => {
		setSelectedPackages((prev) => {
			const existingIndex = prev.findIndex((p) => p.package_id === packageId);

			if (existingIndex >= 0) {
				const updated = prev.map((p) =>
					p.package_id === packageId ? { ...p, is_active: !p.is_active } : p
				);
				toast.dismiss();
				const activeCount = updated.filter((p) => p.is_active).length;
				if (activeCount === 0) {
					showToast({
						type: "warning",
						title: "Minimal 1 paket harus dipilih",
						message: "Anda harus memilih minimal 1 paket untuk kursus.",
						duration: 2000,
					});
					return prev;
				}

				return updated;
			} else {
				return [...prev, { package_id: packageId, is_active: true }];
			}
		});
	}, []);

	const handleTabChange = useCallback((tabId) => {
		setActiveTab(tabId);
	}, []);

	const getTabStatus = useCallback(
		(tabId) => {
			if (tabId === activeTab) return "active";

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
			if (tabId === "paket" && isAdmin) {
				return selectedPackages.some((p) => p.is_active)
					? "completed"
					: "available";
			}

			return "available";
		},
		[activeTab, formData, schedules, selectedPackages, isAdmin]
	);

	const isFormValid = useCallback(() => {
		if (!formData.namaKursus.trim() || !formData.deskripsi.trim()) {
			return false;
		}

		const hasValidSchedule = schedules.some(
			(schedule) => schedule.tanggal && schedule.waktu && schedule.gayaMengajar
		);

		if (!hasValidSchedule) return false;

		if (isAdmin) {
			const activePackages = selectedPackages.filter((p) => p.is_active);
			if (activePackages.length === 0) return false;
		}

		return true;
	}, [formData, schedules, selectedPackages, isAdmin]);

	const handleSubmit = useCallback(
		async (e) => {
			if (e && e.preventDefault) e.preventDefault();
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

				if (isAdmin && formData.mentorId) {
					payload.append("mentor_id", formData.mentorId);
				}

				if (isAdmin && Array.isArray(selectedPackages)) {
					if (!isEditMode) {
						const activePackages = selectedPackages.filter((p) => p.is_active);
						activePackages.forEach((p, idx) => {
							payload.append(`paket_ids[${idx}]`, p.package_id);
						});

						selectedPackages.forEach((p, idx) => {
							payload.append(
								`visibilitas_paket[${idx}][paket_id]`,
								p.package_id
							);
							payload.append(
								`visibilitas_paket[${idx}][visibilitas]`,
								p.is_active ? 1 : 0
							);
						});
					} else {
						const changedVisibilities = [];
						selectedPackages.forEach((p) => {
							const initial = initialSelectedPackages.find(
								(ip) => ip.package_id === p.package_id
							);
							if (!initial || initial.is_active !== p.is_active) {
								changedVisibilities.push(p);
							}
						});

						changedVisibilities.forEach((p, idx) => {
							payload.append(
								`visibilitas_paket[${idx}][paket_id]`,
								p.package_id
							);
							payload.append(
								`visibilitas_paket[${idx}][visibilitas]`,
								p.is_active ? 1 : 0
							);
						});
					}
				}

				let response;
				const apiPath = isAdmin ? "/kursus" : "/mentor/kursus";

				if (isEditMode) {
					payload.append("_method", "PUT");
					response = await api.post(`${apiPath}/${courseId}`, payload, {
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
						},
					});
				} else {
					response = await api.post(apiPath, payload, {
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "multipart/form-data",
						},
					});
				}

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
							const latestCourse = fetchCourseResponse.data
								.filter((course) => course.namaKursus === formData.namaKursus)
								.sort(
									(a, b) => new Date(b.created_at) - new Date(a.created_at)
								)[0];
							newCourseId = latestCourse?.id;

							if (!newCourseId) {
								throw new Error(
									"Gagal mendapatkan ID kursus setelah pembuatan"
								);
							}
						}
					}

					const scheduleRequests = [];
					const scheduleEndpoint = isAdmin
						? "jadwal-kursus"
						: "mentor/atur-jadwal";

					for (const schedule of schedules) {
						if (
							!schedule.tanggal ||
							!schedule.waktu ||
							!schedule.gayaMengajar
						) {
							throw new Error(
								"Setiap jadwal wajib mengisi tanggal, waktu, dan gayaMengajar."
							);
						}

						if (schedule.id) {
							const initialSchedule = initialSchedules.find(
								(s) => s.id === schedule.id
							);
							const unchanged =
								initialSchedule &&
								initialSchedule.tanggal === schedule.tanggal &&
								initialSchedule.waktu === schedule.waktu &&
								initialSchedule.gayaMengajar === schedule.gayaMengajar &&
								(initialSchedule.tempat || "") === (schedule.tempat || "") &&
								(initialSchedule.keterangan || "") ===
									(schedule.keterangan || "");

							if (unchanged) continue;
						}

						const jadwalPayload = {
							kursus_id: newCourseId,
							id: schedule.id || undefined,
							tanggal: schedule.tanggal,
							waktu: schedule.waktu,
							keterangan: schedule.keterangan || "",
							tempat: schedule.tempat || "",
							gayaMengajar: schedule.gayaMengajar,
						};

						scheduleRequests.push(
							api.post(scheduleEndpoint, jadwalPayload, {
								headers: { Authorization: `Bearer ${token}` },
							})
						);
					}

					if (scheduleRequests.length > 0) {
						await Promise.all(scheduleRequests);
					}

					queryClient.invalidateQueries(["courses"]);
					queryClient.invalidateQueries(["mentorCourses"]);

					toast.success(
						`Kursus ${isEditMode ? "diperbarui" : "dibuat"} berhasil!`
					);
					onNavigate(backNavigationTarget);
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
		},
		[
			formData,
			fotoKursus,
			isAdmin,
			selectedPackages,
			initialSelectedPackages,
			isEditMode,
			courseId,
			schedules,
			initialSchedules,
			queryClient,
			onNavigate,
			backNavigationTarget,
		]
	);

	return {
		isEditMode,
		isAdmin,
		isMentor,
		mentorName,
		formData,
		schedules,
		initialSchedules,
		collapsedSchedules,
		selectedPackages,
		initialSelectedPackages,
		mentors,
		packages,
		activeTab,
		fotoKursus,
		fotoPreview,
		loading,
		error,
		setFormData,
		setSchedules,
		setInitialSchedules,
		setSelectedPackages,
		setInitialSelectedPackages,
		setFotoPreview,
		setLoading,
		setError,
		handleChange,
		handleFileChange,
		handleScheduleChange,
		addSchedule,
		removeSchedule,
		toggleScheduleCollapse,
		duplicateSchedule,
		handlePackageToggle,
		handleTabChange,
		getTabStatus,
		isFormValid,
		handleSubmit,
	};
}
