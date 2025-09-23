import { useState, useCallback } from "react";
import Swal from "sweetalert2";

export function useCourseForm(initialData = {}, mentorName = "") {
	// ======== FORM DATA STATE ========
	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
		mentorId: "",
		...initialData,
	});

	const [fotoKursus, setFotoKursus] = useState(null);
	const [fotoPreview, setFotoPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// ======== SCHEDULE STATE ========
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

	// ======== PACKAGE STATE ========
	const [selectedPackages, setSelectedPackages] = useState([]);

	// ======== TAB STATE ========
	const [activeTab, setActiveTab] = useState("info");

	// ======== FORM HANDLERS ========
	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}, []);

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

	const setFormDataBulk = useCallback((data) => {
		setFormData(data);
	}, []);

	const setPreview = useCallback((preview) => {
		setFotoPreview(preview);
	}, []);

	const resetForm = useCallback(() => {
		setFormData({
			namaKursus: "",
			deskripsi: "",
			mentorId: "",
		});
		setFotoKursus(null);
		setFotoPreview(null);
		setError(null);
	}, []);

	// ======== SCHEDULE HANDLERS ========
	const handleScheduleChange = useCallback((index, e) => {
		const { name, value } = e.target;
		setSchedules((prev) => {
			const newSchedules = [...prev];
			newSchedules[index] = { ...newSchedules[index], [name]: value };
			return newSchedules;
		});
	}, []);

	const addSchedule = useCallback(() => {
		const newIndex = schedules.length;
		setSchedules((prev) => [
			...prev,
			{
				tanggal: "",
				waktu: "",
				keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
				tempat: "",
				gayaMengajar: "online",
			},
		]);

		setCollapsedSchedules((prev) => ({
			...prev,
			[newIndex]: false, // New schedule is expanded
		}));
	}, [schedules.length, mentorName]);

	const removeSchedule = useCallback(
		(index) => {
			// Only remove if index exceeds initial schedules length
			if (index >= initialSchedules.length) {
				setSchedules((prev) => prev.filter((_, i) => i !== index));
				setCollapsedSchedules((prev) => {
					const newState = { ...prev };
					delete newState[index];
					// Reindex collapsed states for schedules after the removed one
					const reindexed = {};
					Object.keys(newState).forEach((key) => {
						const keyNum = parseInt(key);
						if (keyNum > index) {
							reindexed[keyNum - 1] = newState[keyNum];
						} else {
							reindexed[keyNum] = newState[keyNum];
						}
					});
					return reindexed;
				});
			}
		},
		[initialSchedules.length]
	);

	const toggleScheduleCollapse = useCallback((index) => {
		setCollapsedSchedules((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	}, []);

	const duplicateSchedule = useCallback(
		(index) => {
			const scheduleToClone = { ...schedules[index] };
			// Clear the date and time for the duplicated schedule
			scheduleToClone.tanggal = "";
			scheduleToClone.waktu = "";
			// Auto-fill keterangan if empty and mentorName exists
			if (!scheduleToClone.keterangan && mentorName) {
				scheduleToClone.keterangan = `Kursus dengan ${mentorName}`;
			}
			// Remove the ID if it exists (for new schedules)
			delete scheduleToClone.id;

			setSchedules((prev) => {
				const newSchedules = [...prev];
				newSchedules.splice(index + 1, 0, scheduleToClone);
				return newSchedules;
			});

			// Update collapsed states - shift indices and set new one as expanded
			setCollapsedSchedules((prev) => {
				const newCollapsedStates = {};
				Object.keys(prev).forEach((key) => {
					const idx = parseInt(key);
					if (idx > index) {
						newCollapsedStates[idx + 1] = prev[idx];
					} else {
						newCollapsedStates[idx] = prev[idx];
					}
				});
				newCollapsedStates[index + 1] = false; // New duplicated schedule is expanded
				return newCollapsedStates;
			});
		},
		[schedules, mentorName]
	);

	const setSchedulesBulk = useCallback((newSchedules) => {
		setSchedules(newSchedules);
	}, []);

	const setInitialSchedulesBulk = useCallback((initialSched) => {
		setInitialSchedules(initialSched);
		// Set existing schedules to be collapsed by default
		const initialCollapsedState = {};
		initialSched.forEach((_, index) => {
			initialCollapsedState[index] = true; // true = collapsed
		});
		setCollapsedSchedules(initialCollapsedState);
	}, []);

	// ======== PACKAGE HANDLERS ========
	const handlePackageToggle = useCallback((packageId) => {
		setSelectedPackages((prev) => {
			const existingIndex = prev.findIndex((p) => p.package_id === packageId);

			if (existingIndex >= 0) {
				// Package exists, toggle is_active
				const updated = prev.map((p) =>
					p.package_id === packageId ? { ...p, is_active: !p.is_active } : p
				);

				// Validation: minimal harus ada 1 paket yang aktif
				const activeCount = updated.filter((p) => p.is_active).length;
				if (activeCount === 0) {
					Swal.fire({
						title: "Tidak bisa nonaktifkan semua paket",
						text: "Minimal harus ada 1 paket yang aktif untuk kursus ini",
						icon: "warning",
						confirmButtonText: "OK",
					});
					return prev; // Return previous state
				}

				return updated;
			} else {
				// Package tidak ada, tambahkan dengan is_active: true
				return [...prev, { package_id: packageId, is_active: true }];
			}
		});
	}, []);

	const isPackageActive = useCallback(
		(packageId) => {
			const found = selectedPackages.find((p) => p.package_id === packageId);
			return found ? found.is_active : false;
		},
		[selectedPackages]
	);

	const setSelectedPackagesBulk = useCallback((packages) => {
		setSelectedPackages(packages);
	}, []);

	const getActivePackages = useCallback(() => {
		return selectedPackages.filter((p) => p.is_active);
	}, [selectedPackages]);

	// ======== TAB HANDLERS ========
	const handleTabChange = useCallback((tabId) => {
		setActiveTab(tabId);
	}, []);

	const getTabStatus = useCallback(
		(tabId, showPackages = false) => {
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
			if (tabId === "paket" && showPackages) {
				return selectedPackages.some((p) => p.is_active)
					? "completed"
					: "available";
			}

			return "available";
		},
		[activeTab, formData, schedules, selectedPackages]
	);

	// ======== VALIDATION ========
	const isFormValid = useCallback(
		(isAdmin = false) => {
			// Check basic info
			if (!formData.namaKursus.trim() || !formData.deskripsi.trim()) {
				return false;
			}

			// Check if at least one schedule is complete
			const hasValidSchedule = schedules.some(
				(schedule) =>
					schedule.tanggal && schedule.waktu && schedule.gayaMengajar
			);

			if (!hasValidSchedule) return false;

			// Check packages for admin
			if (isAdmin) {
				const activePackages = selectedPackages.filter((p) => p.is_active);
				if (activePackages.length === 0) return false;
			}

			return true;
		},
		[formData, schedules, selectedPackages]
	);

	return {
		// Form data
		formData,
		fotoKursus,
		fotoPreview,
		loading,
		error,
		setLoading,
		setError,
		handleChange,
		handleFileChange,
		setFormDataBulk,
		setPreview,
		resetForm,

		// Schedules
		schedules,
		initialSchedules,
		collapsedSchedules,
		handleScheduleChange,
		addSchedule,
		removeSchedule,
		toggleScheduleCollapse,
		duplicateSchedule,
		setSchedulesBulk,
		setInitialSchedulesBulk,

		// Packages
		selectedPackages,
		handlePackageToggle,
		isPackageActive,
		setSelectedPackagesBulk,
		getActivePackages,

		// Tabs
		activeTab,
		handleTabChange,
		getTabStatus,

		// Validation
		isFormValid,
	};
}
