import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ListChecks } from "lucide-react";
import { MentorCard } from "./components/MentorCard";
import { BookingModal } from "./components/BookingModal";
import { PaymentModal } from "./components/PaymentModal";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { CourseSkeletonCard } from "./components/Skeleton/CourseSkeletonCard";
import { CarouselSkeleton } from "./components/Skeleton/CarouselSkeleton";
import { BookLoader } from "./components/User/BookLoader";
import { NotFoundPage } from "./components/Fallback/NotFound";

import { FaQWidget } from "./components/FaQWidget"; // Impor komponen FaQWidget
import { GuideModal } from "./components/GuideModal"; // Impor komponen GuideModal
import { HelpButton } from "./components/User/HelpButton"; // Impor komponen HelpButton
import {
	FloatingSessionReminder,
	SessionBanner,
} from "./components/SessionReminder"; // Impor Session Reminder

// Halaman utama
import { CoursesPage } from "./pages/CoursesPage";
import { MentorsPage } from "./pages/MentorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { SessionHistoryPage } from "./pages/SessionHistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { AuthModal } from "./components/AuthModal";
import { TestimoniModal } from "./components/TestimoniModal";
import { CourseSelectionModal } from "./components/CourseSelectionModal";
import { CoursePackageSelectionModal } from "./components/CoursePackageSelectionModal";
import { Home } from "./pages/Home";

// Import Zustand Store
import useAppStore from "./stores/useAppStore";

// Halaman Admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProfilePage } from "./pages/admin/profile/AdminProfilePage";
import { AdminEditProfile } from "./pages/admin/profile/AdminEditProfile";
import { AdminUsersPage } from "./pages/admin/manage-users/AdminUsersPage";
import { AdminCoursesPage } from "./pages/admin/manage-courses/AdminCoursesPage";
import { AdminFormCoursePage } from "./pages/admin/manage-courses/FormCoursePage";
import { AdminMentorsPage } from "./pages/admin/manage-mentors/AdminMentorsPage";
import { AdminFormMentorsPage } from "./pages/admin/manage-mentors/FormMentorsPage";
import { AdminPaymentsPage } from "./pages/admin/manage-payments/AdminPaymentsPage";
import { AdminSessionsPage } from "./pages/admin/manage-sessions/AdminSessionsPage";
import { AdminFormSessionsPage } from "./pages/admin/manage-sessions/FormSessionsPage";
import { AdminTestimoniesPage } from "./pages/admin/manage-testimonials/AdminTestimoniesPage";
import { AdminFormTestimoniesPage } from "./pages/admin/manage-testimonials/FormTestimoniesPage";
import { AdminItemsPage } from "./pages/admin/manage-items/AdminItemsPage";
import { AdminFormItemsPage } from "./pages/admin/manage-items/FormItemPage";
import { AdminPackagesPage } from "./pages/admin/manage-packages/AdminPackagesPage";
import { AdminFormPackagesPage } from "./pages/admin/manage-packages/FormPackagePage";
// Halaman Mentor
import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "./pages/mentor/sessions/MentorSchedulePage";
import { MentorCoursesPage } from "./pages/mentor/courses/MentorCoursesPage";
import { MentorTestimoniesPage } from "./pages/mentor/MentorTestimoniesPage";
import { MentorFormCoursePage } from "./pages/mentor/courses/FormCoursePage";
import { MentorProfilePage } from "./pages/mentor/profile/MentorProfilePage";
import { MentorEditProfile } from "./pages/mentor/profile/MentorEditProfile";
import { motion, AnimatePresence } from "framer-motion"; // Impor Framer Motion

import { getImageUrl } from "./utils/getImageUrl"; // Utility function to get image URL

import Swal from "sweetalert2";
import api from "./api";
import { useQuery } from "@tanstack/react-query";
import { createBrowserHistory } from "history";
import { useQueryClient } from "@tanstack/react-query";
import ApiError from "./components/Fallback/ApiError";

const history = createBrowserHistory();

const adminPages = [
	"admin-dashboard",
	"admin-manage-users",
	"admin-manage-payments",
	"admin-manage-sessions",
	"admin-edit-session",
	"admin-manage-courses",
	"admin-add-course",
	"admin-edit-course",
	"admin-manage-mentors",
	"admin-add-mentor",
	"admin-edit-mentor",
	"admin-manage-items",
	"admin-add-item",
	"admin-edit-item",
	"admin-manage-packages",
	"admin-add-package",
	"admin-edit-package",
	"admin-profile",
	"admin-edit-profile",
	"admin-testimonial",
	"admin-edit-testimonial",
];
const mentorPages = [
	"mentor-dashboard",
	"mentor-manage-schedule",
	"mentor-manage-courses",
	"mentor-manage-students",
	"mentor-testimonial",
	"mentor-add-course",
	"mentor-edit-course",
	"mentor-profile",
	"mentor-edit-profile",
];
const protectedPages = [
	...adminPages,
	...mentorPages,
	"profile",
	"transaction-history",
	"settings",
];

const hideNavigationPages = ["edit-profile"];

function App() {
	const queryClient = useQueryClient();

	// Zustand Store - Authentication & Global State
	const {
		// Authentication State
		isAuthenticated,
		userRole,
		userData,
		authChecked,
		currentPage,
		// UI State
		showAuthModal,
		showPayment,
		showBookingModal,
		showCourseSelection,
		showPackageSelection,
		showPostLoginLoading,
		showHelpMenu,
		showFlowModal,
		showTestimoniModal,
		// Course & Booking State
		selectedCourse,
		selectedMentor,
		selectedPackage,
		bookingCourse,
		currentBooking,
		searchQuery,
		// Testimoni State
		testimoniSession,
		isSubmittingTestimoni,
		setIsSubmittingTestimoni,
		// Actions
		setCurrentPage,
		setSelectedCourse,
		setSearchQuery,
		setSelectedMentor,
		setSelectedPackage,
		setBookingCourse,
		setShowPayment,
		setShowBookingModal,
		setCurrentBooking,
		setShowAuthModal,
		setShowCourseSelection,
		setShowPackageSelection,
		setShowHelpMenu,
		setShowFlowModal,
		closeTestimoniModal,
		handleLogout,
		initializeAuth,
	} = useAppStore();
	const { apiError } = useAppStore();

	// setiap kali currentPage berubah, scroll ke atas
	// ini untuk memastikan setiap kali halaman berubah, scroll akan kembali ke atas
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	// Memastikan scroll ke atas saat komponen pertama kali dimount (refresh page)
	useEffect(() => {
		// Reset scroll position immediately on mount/refresh
		window.scrollTo(0, 0);

		// Also handle the case where the page is still loading
		const handleLoad = () => {
			window.scrollTo(0, 0);
		};

		if (document.readyState === "loading") {
			window.addEventListener("load", handleLoad);
		} else {
			window.scrollTo(0, 0);
		}

		return () => {
			window.removeEventListener("load", handleLoad);
		};
	}, []);

	// Halaman yang membutuhkan data courses
	const pagesThatNeedCourses = ["home", "courses", "mentors"];
	const shouldFetchCourses =
		authChecked &&
		pagesThatNeedCourses.includes(currentPage) &&
		(!isAuthenticated || userRole === "pelanggan");

	const {
		data: courses = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["courses", isAuthenticated],
		queryFn: async () => {
			const endpoint = isAuthenticated
				? "/pelanggan/daftar-kursus"
				: "/public/kursus"; // Endpoint publik
			const response = await api.get(endpoint, {
				headers: isAuthenticated
					? {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
					  }
					: {},
			});
			// console.log("API Response:", response.data); // Debug: Periksa data dari API
			const mappedCourses = response.data.map((course) => ({
				id: course.id,
				mentor_id: course.mentor_id,
				courseName: course.namaKursus,
				courseDescription: course.deskripsi,
				courseImage: getImageUrl(course.fotoKursus, "/foto_kursus/default.jpg"),
				learnMethod:
					course.gayaMengajar === "online"
						? "Online Learning"
						: course.gayaMengajar === "offline"
						? "Offline Learning"
						: "Belum diatur",
				price_per_hour: course.mentor?.biayaPerSesi || 0,
				price_offline: course.mentor?.biayaPerSesiOffline || 0,
				mentor: course.mentor, // <-- tambahkan property mentor agar bisa diakses di CourseCard
				mentors: [
					{
						id: course.mentor?.id || null,
						status: course.mentor?.status || "active", // Tambahkan status field
						mentorName: course.mentor?.user?.nama || "Unknown Mentor",
						mentorImage: getImageUrl(
							course.mentor?.user?.foto_profil,
							"/foto_mentor/default.png"
						),
						mentorRating: course.mentor?.rating || 0,
						mentorAbout: course.mentor?.deskripsi || "No description",
						availableLearnMethod: [
							course.gayaMengajar === "online"
								? "Online Learning"
								: course.gayaMengajar === "offline"
								? "Offline Learning"
								: "Belum diatur",
						],
						teachingMode: {
							online: course.gayaMengajar === "online",
							offline: course.gayaMengajar === "offline",
						},
						mentorPhone: course.mentor?.user?.nomorTelepon || "+1234567890",
						// Jadwal kursus untuk mentor
						schedules: Array.isArray(course.jadwal_kursus)
							? course.jadwal_kursus
							: Array.isArray(course.jadwalKursus)
							? course.jadwalKursus
							: [],
						mentorAddress:
							course.mentor?.user?.alamat || "Alamat tidak tersedia",
						courses: [
							{
								id: course.id,
								courseName: course.namaKursus,
								learnMethod:
									course.gayaMengajar === "online"
										? "Online Learning"
										: course.gayaMengajar === "offline"
										? "Offline Learning"
										: "Belum diatur",
								schedules: Array.isArray(course.jadwal_kursus)
									? course.jadwal_kursus
									: Array.isArray(course.jadwalKursus)
									? course.jadwalKursus
									: [],
							},
						],
					},
				],
				// PENTING: mapping jadwalKursus ke jadwal_kursus agar konsisten di seluruh frontend
				jadwal_kursus: Array.isArray(course.jadwal_kursus)
					? course.jadwal_kursus
					: Array.isArray(course.jadwalKursus)
					? course.jadwalKursus
					: [],
			}));
			// console.log("Mapped Courses:", mappedCourses); // Debug: Periksa data setelah pemetaan
			return mappedCourses;
		},
		enabled: shouldFetchCourses,
		// staleTime: 60 * 1000, // 30 detik (sangat pendek)
		// cacheTime: 2 * 60 * 1000, // 2 menit cache
		// refetchOnWindowFocus: true, // Refetch saat focus (safety)
		// refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit
		// retry: 1,
	});

	// Get schedules dari course data yang sudah terfilter di backend
	const schedules = bookingCourse?.jadwal_kursus || [];

	// Refetch courses setiap kali BookingModal dibuka untuk data terbaru
	useEffect(() => {
		if (selectedMentor && bookingCourse) {
			refetch();
		}
	}, [selectedMentor, bookingCourse, refetch]);

	// Fungsi untuk memeriksa apakah pengguna sudah terautentikasi
	useEffect(() => {
		initializeAuth();

		const unlisten = history.listen(({ location }) => {
			const path = location.pathname.slice(1) || "home";
			setCurrentPage(path);
		});

		const initialPath =
			(history.location && history.location.pathname.slice(1)) || "home";
		setCurrentPage(initialPath);

		return () => unlisten();
	}, []);

	// Filtered course gunanaya untuk tampilan card course di coursepage dan home
	const filteredCourses = courses.filter(
		(course) => course.mentor && course.mentor.status === "active" // hanya kursus dengan mentor aktif
	);

	// Import store actions yang diperlukan untuk event handlers
	const { handleAuthSuccess: authSuccess, updateUserData } = useAppStore();

	// Helper functions
	const handleSchedule = (mentor, course, packageData) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		// Close all modals first
		setShowCourseSelection(false);
		setShowPackageSelection(false);

		setSelectedMentor(mentor);
		setBookingCourse(course);
		if (packageData) {
			setSelectedPackage(packageData);
		}
		// Cari course asli dari courses utama
		const fullCourse = courses.find((c) => c.id === course.id);
		setSelectedCourse(fullCourse || course); //Memastikan state selectedCourse selalu sesuai dengan course yang akan di-booking
		setCurrentBooking({ mentor, course, packageData }); // Simpan semua data sementara
		setShowBookingModal(true); // state untuk membuka modal
	};

	// Fungsi untuk menutup CourseSelectionModal
	const handleCourseSelectionClose = () => {
		setShowCourseSelection(false);
		setBookingCourse(null); // Reset bookingCourse jika Cancel ditekan
	};

	// Handler untuk course package selection dari mentor flow
	const handleCoursePackageSelect = (course) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		// Kalok kursus tidak ada jadwal, tampilkan toast error
		toast.dismiss(); // Hapus semua toast sebelumnya
		if (course.schedules.length === 0) {
			toast.error("Maaf, belum ada jadwal yang bisa pesan", {
				duration: 1000,
				position: "top-center",
				style: {
					background: "#fef2f2",
					border: "1px solid #ef4444",
					padding: "16px",
					borderRadius: "8px",
					minWidth: "400px",
				},
			});
			return;
		}

		setSelectedCourse(course);

		// PENTING: Pastikan mentor data tersimpan di store
		if (course.mentor) {
			setSelectedMentor(course.mentor);
		} else {
			console.warn("Course doesn't have mentor data:", course);
		}

		setShowCourseSelection(false); // Tutup course selection modal
		setShowPackageSelection(true); // Buka package selection modal
	};

	// Fungsi untuk memilih kursus dari CourseSelectionModal
	const handleCourseSelect = (course) => {
		setBookingCourse(course);
	};

	// Fungsi untuk mengirimkan booking
	const handleBookingSubmit = async (
		date,
		time,
		mode,
		course,
		topic,
		customLocation,
		selectedPackage
	) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		if (selectedMentor) {
			try {
				// Ambil schedules dari bookingCourse yang sudah terfilter
				const courseSchedules = bookingCourse?.jadwal_kursus || [];

				// Temukan jadwal_kursus_id yang sesuai dengan tanggal & waktu yang dipilih
				const selectedSchedule = courseSchedules.find(
					(s) =>
						s.kursus_id === course.id &&
						s.tanggal === date.toISOString().split("T")[0] &&
						s.waktu.startsWith(time.slice(0, 5))
				);

				if (!selectedSchedule) {
					Swal.fire("Gagal booking", "Jadwal tidak ditemukan!", "error");
					return;
				}

				// Kirim data sesi ke backend
				const response = await api.post("/pelanggan/pesan-sesi", {
					mentor_id: selectedMentor.id,
					pelanggan_id: userData.pelanggan?.id,
					kursus_id: course.id,
					jadwal_kursus_id: selectedSchedule?.id,
					detailKursus: topic || "No specific topic",
					statusSesi: "pending",
					paket_id: selectedPackage?.id || null, // harus dikirim untuk cek logika di backend
				});
				// 🍞 Toast multi-line
				toast.success(
					<div className="text-center">
						<div className="font-semibold text-green-800 mb-2">
							🎉 Pemesanan Berhasil!
						</div>
						<div className="text-sm text-gray-700 leading-relaxed">
							Silakan lakukan pembayaran untuk
							<br />
							mengonfirmasi sesi Anda
						</div>
					</div>,
					{
						duration: 4000, // 4 detik
						position: "top-center",
						style: {
							background: "#f0fdf4", // Light green background
							border: "1px solid #22c55e",
							padding: "16px",
							borderRadius: "8px",
							minWidth: "300px",
						},
						iconTheme: {
							primary: "#22c55e",
							secondary: "#f0fdf4",
						},
					}
				);

				// Simpan data sesi ke state booking
				const sesiBaru = response.data.sesi;
				// Pastikan sesiBaru menyertakan paket_id (fallback ke selectedPackage jika backend belum mengembalikan)
				sesiBaru.paket_id = sesiBaru.paket_id ?? selectedPackage?.id ?? null;
				let paketId = sesiBaru.paket_id ?? "";

				// Calculate price based on mode
				const mentorPrice =
					mode === "offline"
						? selectedMentor.biayaPerSesiOffline || selectedMentor.biayaPerSesi
						: 0;

				// 🎯 DATA BOOKING UNTUK PaymentModal
				const booking = {
					course,
					mentor: selectedMentor,
					sesi: sesiBaru,
					date: date.toLocaleDateString(),
					time,
					mode,
					location: mode === "offline" ? customLocation : null,
					topic: topic || "No specific topic",
					paket: selectedPackage
						? {
								...selectedPackage,
								items: Array.isArray(selectedPackage.items)
									? selectedPackage.items.map((item) => ({
											...item,
											diskon: item.diskon ?? 0,
									  }))
									: [],
						  }
						: null,
					paket_id: paketId,
					selectedPackage: selectedPackage || null,
					// Gunakan jumlahSementara dari BookingModal jika ada, jika tidak gunakan perhitungan sendiri
					jumlahSementara: jumlahSementara ?? 0,
				};
				setCurrentBooking(booking);
				setSelectedMentor(null);
				setBookingCourse(null);
				setShowPayment(true);
				setShowBookingModal(false);
			} catch (err) {
				console.error("Booking error:", err);

				// Pesan error yang lebih spesifik
				let errorMessage = "Terjadi kesalahan saat booking sesi";
				if (err.response?.data?.message) {
					if (err.response.data.message.includes("gayaMengajar")) {
						errorMessage =
							"Terjadi kesalahan dengan data jadwal. Silakan hubungi admin atau refresh halaman dan coba lagi.";
					} else {
						errorMessage = err.response.data.message;
					}
				}

				// 🍞 Toast error untuk booking gagal
				toast.error(
					<div className="text-center">
						<div className="font-semibold text-red-800 mb-2">
							❌ Booking Gagal
						</div>
						<div className="text-sm text-gray-700">{errorMessage}</div>
					</div>,
					{
						duration: 5000,
						position: "top-center",
						style: {
							background: "#fef2f2",
							border: "1px solid #ef4444",
							padding: "16px",
							borderRadius: "8px",
							minWidth: "300px",
						},
					}
				);
			}
		}
	};

	// Fungsi untuk mengirimkan pembayaran
	const handlePaymentSubmit = async ({
		paymentMethod,
		proofImage,
		booking,
		transaksiId, // Tambahkan parameter untuk transaksi yang sudah ada
	}) => {
		try {
			const sesi = booking?.sesi;
			const course = booking?.course;

			// Validasi data awal
			if (!sesi || !course) {
				throw new Error("Data booking tidak lengkap.");
			}
			if (!sesi.pelanggan_id || !sesi.mentor_id || !sesi.id) {
				throw new Error("Data sesi tidak lengkap.");
			}
			if (!course.price_per_hour) {
				throw new Error("Harga kursus tidak tersedia.");
			}
			if (!proofImage || !(proofImage instanceof File)) {
				throw new Error("Proof of payment must be a valid image file.");
			}

			// Buat FormData untuk mengirim data termasuk file
			const formData = new FormData();
			if (transaksiId) {
				formData.append("id", transaksiId); // Sertakan id untuk update
			}
			formData.append("mode", booking.mode);
			formData.append("pelanggan_id", sesi.pelanggan_id);
			formData.append("mentor_id", sesi.mentor_id);
			formData.append("sesi_id", sesi.id);

			//=======Jumlah Di Handle di Backend Jadi cuma perlu kirim paket id untuk pengecekan=====
			// // Kirim jumlah yang tepat berdasarkan booking
			// let jumlahTransaksi = course.price_per_hour; // fallback
			// if (
			// 	booking.jumlahSementara !== undefined &&
			// 	booking.jumlahSementara !== null
			// ) {
			// 	jumlahTransaksi = booking.jumlahSementara;
			// } else if (booking.amount !== undefined && booking.amount !== null) {
			// 	jumlahTransaksi = booking.amount;
			// }
			// formData.append("jumlah", jumlahTransaksi);

			formData.append("statusPembayaran", "menunggu_verifikasi"); // Selalu menunggu verifikasi
			formData.append("metodePembayaran", paymentMethod);
			formData.append(
				"tanggalPembayaran",
				new Date().toISOString().slice(0, 10)
			);
			formData.append("buktiPembayaran", proofImage);
			// Ambil paket_id dari booking jika ada, jika tidak fallback ke selectedPackage
			let paketId = "";
			if (booking?.paket_id) {
				paketId = booking.paket_id;
			} else if (booking?.selectedPackage?.id) {
				paketId = booking.selectedPackage.id;
			} else if (selectedPackage?.id) {
				paketId = selectedPackage.id;
			}
			formData.append("paket_id", paketId);

			// Kirim permintaan dengan header multipart/form-data
			const res = await api.post("/transaksi", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			// Invalidate queries setelah sukses
			queryClient.invalidateQueries(["transactions", sesi.pelanggan_id]);
			queryClient.invalidateQueries(["sessions", sesi.pelanggan_id]);

			// console.log("Transaksi response:", res.data); // Debugging
			setShowPayment(false);
			Swal.fire({
				icon: "success",
				title: transaksiId ? "Proof Updated!" : "Payment Submitted!",
				text: transaksiId
					? "Your payment proof has been updated. We will verify it shortly."
					: "Your booking has been confirmed. We will verify your payment shortly.",
				showConfirmButton: false,
				timer: 1200,
				timerProgressBar: true,
			}).then(() => {
				setCurrentPage("transaction-history");
				history.push("/transaction-history");
			});
		} catch (err) {
			console.error("Error creating transaction:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.response?.data?.errors?.buktiPembayaran?.[0] ||
				err.message ||
				"Terjadi kesalahan saat pembayaran.";
			Swal.fire("Gagal pembayaran", errorMessage, "error");
		}
	};
	// Fungsi untuk navigasi antar halaman
	const handleNavigate = (page) => {
		if (
			!isAuthenticated &&
			["profile", "transaction-history", "settings"].includes(page)
		) {
			setShowAuthModal(true);
			return;
		}

		if (page === "home") {
			setSelectedCourse(null);
		}
		setCurrentPage(page);
		history.push(`/${page}`);
	};

	// Fungsi untuk menangani keberhasilan autentikasi
	const handleAuthSuccess = (role, user) => {
		authSuccess(role, user);

		if (role === "admin") {
			setCurrentPage("admin-dashboard");
			history.push("/admin-dashboard");
		} else if (role === "mentor") {
			setCurrentPage("mentor-dashboard");
			history.push("/mentor-dashboard");
		}
	};

	const handleUpdateUserData = (updatedData) => {
		updateUserData(updatedData);
	};

	// Global testimoni handler
	const handleSubmitTestimoni = async ({ rating, komentar }) => {
		try {
			setIsSubmittingTestimoni(true); // Set loading true

			const token = localStorage.getItem("token");
			await api.post(
				`/pelanggan/beri-testimoni/${testimoniSession.id}`,
				{
					rating,
					komentar,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Invalidate queries untuk update UI
			queryClient.invalidateQueries(["sessionsWidget"]);
			queryClient.invalidateQueries(["pelangganSessions"]);
			queryClient.invalidateQueries(["pelangganTransactions"]);
			queryClient.invalidateQueries(["statusTransactions"]);

			closeTestimoniModal();
		} catch (error) {
			console.error("Error submitting testimoni:", error);
			setIsSubmittingTestimoni(false); // Reset loading jika error
		}
	};

	// Fungsi untuk logout - menggunakan kombinasi store dan custom logic
	const handleLogoutWithHistory = () => {
		api
			.post("/logout")
			.then(() => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				handleLogout(); // Store action
				setCurrentPage("home");
				history.push("/home");
				queryClient.clear(); // <-- Hapus semua cache query!

				toast.success("Berhasil Logout! Sampai jumpa👋", {
					duration: 2000,
					position: "top-center",
					style: {
						background: "#fffbe6",
						color: "#333",
						border: "1.5px solid #facc15",
						borderRadius: "12px",
						fontWeight: 500,
						fontSize: "1rem",
						boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
					},
				});
			})
			.catch((error) => {
				console.error("Logout failed:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				handleLogout(); // Store action
				setCurrentPage("home");
				history.push("/home");
			});
	};

	// Fungsi untuk menangani klik kursus
	const handleCourseClick = (course) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		// Kalok kursus tidak ada jadwal, tampilkan toast error
		toast.dismiss(); // Hapus semua toast sebelumnya
		if (!course?.jadwal_kursus || course.jadwal_kursus.length === 0) {
			toast.error("Maaf, belum ada jadwal yang bisa pesan", {
				duration: 1000,
				position: "top-center",
				style: {
					background: "#fef2f2",
					border: "1px solid #ef4444",
					padding: "16px",
					borderRadius: "8px",
					minWidth: "400px",
				},
			});
			return;
		}

		setSelectedCourse(course);

		// PENTING: Set mentor dari course ke store agar CoursePackageCard bisa akses
		if (course.mentor) {
			setSelectedMentor(course.mentor);
		} else if (course.mentors && course.mentors.length > 0) {
			setSelectedMentor(course.mentors[0]); // Ambil mentor pertama jika mentor tidak ada
		}

		setShowPackageSelection(true);
	};

	// Fungsi untuk menangani pemilihan paket
	const handlePackageSelected = (packageData) => {
		setSelectedPackage(packageData);
		setShowPackageSelection(false);
		// Setelah pilih paket, tampilkan mentor dari course yang dipilih
		// console.log("Package selected:", packageData);
		// console.log("Course selected:", selectedCourse);
	};

	// Fungsi untuk menutup BookingModal
	const handleBookingModalClose = () => {
		setSelectedMentor(null);
		setBookingCourse(null);
		setSelectedCourse(null); // kalo gajadi, reset selectedCourse juga
		setSelectedPackage(null);
		setShowBookingModal(false);
	};

	// Fungsi untuk menutup PackageSelectionModal
	const handlePackageSelectionClose = () => {
		setSelectedCourse(null);
		setSelectedPackage(null);
		setShowPackageSelection(false);
	};

	// Render konten berdasarkan halaman
	const renderContent = () => {
		// Tambahkan pengecekan authChecked sebelum pengecekan protectedPages di renderContent.
		// Ini akan mencegah redirect ke home sebelum status autentikasi user benar-benar diketahui.
		if (!authChecked) {
			return (
				<div className="fixed top-0 left-0 w-full h-1 bg-blue-200">
					<div className="h-1 bg-blue-500 animate-pulse w-1/2"></div>
				</div>
			);
		}
		// Jika user belum login dan ingin mengakses halaman yang protected,
		// maka redirect ke halaman home dan tampilkan modal autentikasi
		if (!isAuthenticated && protectedPages.includes(currentPage)) {
			setCurrentPage("home");
			history.push("/home");
			setShowAuthModal(true);
			return (
				<Home
					courses={courses}
					filteredCourses={filteredCourses}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					handleCourseClick={handleCourseClick}
					userRole={userRole}
				/>
			);
		}

		// Menampilkan skeleton loading jika halaman yang diakses sedang loading dan termasuk dalam array skeletonPages
		const skeletonPages = ["home", "courses"];
		const showSkeleton = isLoading && skeletonPages.includes(currentPage); // Hanya untuk pelanggan atau guest belum login

		// Menampilkan skeleton loading untuk guest belum login dengan unsur pendidikan
		if (showSkeleton) {
			return (
				<div className="py-8">
					{/* Carousel Loading untuk home page */}
					{currentPage === "home" && (
						<>
							{/* Hero Loading Section */}
							<div className="text-center mb-12">
								<div className="flex justify-center mb-6">
									<BookLoader size="medium" />{" "}
								</div>
							</div>
							<div className="mb-12">
								<div className="flex items-center justify-center gap-4 mb-6">
									<div className="w-8 h-8 bg-yellow-200 rounded-full animate-pulse" />
									<div className="h-6 bg-yellow-200 rounded-lg w-48 animate-pulse" />
									<div className="w-8 h-8 bg-yellow-200 rounded-full animate-pulse" />
								</div>
								<CarouselSkeleton />
							</div>
						</>
					)}

					{/* Course Section Header */}
					<div className="text-center mb-8">
						<div className="flex gap-3 mb-4">
							<div className="w-6 h-6 bg-yellow-300 rounded animate-pulse" />
							<h2 className="text-2xl font-bold text-gray-900">
								{currentPage === "home"
									? "Semua Kursus"
									: "Kursus Yang Tersedia"}
							</h2>
							<div className="w-6 h-6 bg-yellow-300 rounded animate-pulse" />
						</div>
						<div className="h-10 bg-gray-200 rounded w-2/5 ml-0 animate-pulse" />
					</div>

					{/* Educational Loading untuk course card */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{Array.from({ length: 6 }).map((_, idx) => (
							<div key={idx} className="relative">
								<CourseSkeletonCard />
							</div>
						))}
					</div>
				</div>
			);
		}
		// Menampilkan pesan error jika terjadi kesalahan saat mengambil data
		if (error) {
			let msg = error.message;
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				msg = error.response.data.message;
			}
			return <div className="text-red-500 text-center mt-8">{msg}</div>;
		}

		// logika untuk mentor dan admin yang mencoba mengakses halaman pelanggan
		if (
			// apakah user sudah login dan perannya adalah admin atau mentor dan halaman yang diakses adalah home, courses, mentors, atau about
			isAuthenticated &&
			(userRole === "admin" || userRole === "mentor") &&
			["home", "courses", "mentors", "about"].includes(currentPage)
		) {
			// Arahkan ke dashboard admin atau mentor sesuai dengan peran user
			setCurrentPage(
				userRole === "admin" ? "admin-dashboard" : "mentor-dashboard"
			);
			history.push(
				`/${userRole === "admin" ? "admin-dashboard" : "mentor-dashboard"}`
			);
			return userRole === "admin" ? <AdminDashboard /> : <MentorDashboard />;
		}

		// logika untuk pelanggan yang mencoba mengakses halaman admin atau mentor
		if (isAuthenticated && userRole === "pelanggan") {
			if (
				adminPages.includes(currentPage) ||
				mentorPages.includes(currentPage)
			) {
				setCurrentPage("home");
				history.push("/home");
				return (
					<Home
						courses={courses}
						filteredCourses={filteredCourses}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						handleCourseClick={handleCourseClick}
						userRole={userRole}
					/>
				);
			}
		}

		// LOGIKA UNTUK HANDLE EDIT DATA (ADMIN)
		if (userRole === "admin") {
			// Tangani URL dinamis terlebih dahulu
			if (currentPage.startsWith("admin-edit-course")) {
				const id = currentPage.split("admin-edit-course/")[1];
				return (
					<AdminFormCoursePage onNavigate={handleNavigate} courseId={id} />
				);
			}

			if (currentPage.startsWith("admin-edit-testimonial")) {
				const id = currentPage.split("admin-edit-testimonial/")[1];
				return (
					<AdminFormTestimoniesPage
						onNavigate={handleNavigate}
						testimonieId={id}
					/>
				);
			}

			if (currentPage.startsWith("admin-edit-mentor")) {
				const id = currentPage.split("admin-edit-mentor/")[1];
				return (
					<AdminFormMentorsPage onNavigate={handleNavigate} mentorId={id} />
				);
			}

			if (currentPage.startsWith("admin-edit-session")) {
				const id = currentPage.split("admin-edit-session/")[1];
				return (
					<AdminFormSessionsPage onNavigate={handleNavigate} sessionId={id} />
				);
			}

			if (currentPage.startsWith("admin-edit-item")) {
				const id = currentPage.split("admin-edit-item/")[1];
				return <AdminFormItemsPage onNavigate={handleNavigate} itemId={id} />;
			}

			if (currentPage.startsWith("admin-edit-package")) {
				const id = currentPage.split("admin-edit-package/")[1];
				return (
					<AdminFormPackagesPage onNavigate={handleNavigate} packageId={id} />
				);
			}

			// LOGIKA UNTUK HANDLE HALAMAN ADMIN
			// Gunakan switch untuk halaman statis
			if (adminPages.includes(currentPage)) {
				switch (currentPage) {
					case "admin-dashboard":
						return <AdminDashboard />;
					case "admin-edit-profile":
						return (
							<AdminEditProfile
								onUpdateUserData={handleUpdateUserData}
								userData={userData}
								userRole={userRole}
								onNavigate={handleNavigate}
							/>
						);
					case "admin-profile":
						return (
							<AdminProfilePage
								userData={userData}
								userRole={userRole}
								onNavigate={handleNavigate}
							/>
						);
					case "admin-manage-users":
						return <AdminUsersPage />;
					case "admin-manage-payments":
						return <AdminPaymentsPage />;
					case "admin-manage-sessions":
						return <AdminSessionsPage onNavigate={handleNavigate} />;
					case "admin-testimonial":
						return <AdminTestimoniesPage onNavigate={handleNavigate} />;
					case "admin-manage-courses":
						return <AdminCoursesPage onNavigate={handleNavigate} />;
					case "admin-add-course":
						return <AdminFormCoursePage onNavigate={handleNavigate} />;
					case "admin-manage-mentors":
						return <AdminMentorsPage onNavigate={handleNavigate} />;
					case "admin-add-mentor":
						return <AdminFormMentorsPage onNavigate={handleNavigate} />;
					case "admin-manage-items":
						return <AdminItemsPage onNavigate={handleNavigate} />;
					case "admin-add-item":
						return <AdminFormItemsPage onNavigate={handleNavigate} />;
					case "admin-manage-packages":
						return <AdminPackagesPage onNavigate={handleNavigate} />;
					case "admin-add-package":
						return <AdminFormPackagesPage onNavigate={handleNavigate} />;
					default:
						break;
				}
			}
		}

		// LOGIKA UNTUK HANDLE EDIT DATA (MENTOR)
		if (userRole === "mentor") {
			// Tangani URL dinamis terlebih dahulu
			if (currentPage.startsWith("mentor-edit-course")) {
				const id = currentPage.split("mentor-edit-course/")[1];
				return (
					<MentorFormCoursePage onNavigate={handleNavigate} courseId={id} />
				);
			}

			// LOGIKA UNTUK HANDLE HALAMAN MENTOR
			// Gunakan switch untuk halaman statis
			if (mentorPages.includes(currentPage)) {
				switch (currentPage) {
					case "mentor-dashboard":
						return <MentorDashboard />;
					case "mentor-profile":
						return (
							<MentorProfilePage
								userData={userData}
								userRole={userRole}
								onNavigate={handleNavigate}
							/>
						);
					case "mentor-edit-profile":
						return (
							<MentorEditProfile
								onUpdateUserData={handleUpdateUserData}
								userData={userData}
								userRole={userRole}
								onNavigate={handleNavigate}
							/>
						);
					case "mentor-manage-schedule":
						return <MentorSchedulePage />;
					case "mentor-manage-courses":
						return <MentorCoursesPage onNavigate={handleNavigate} />;
					case "mentor-testimonial":
						return <MentorTestimoniesPage />;
					// case "mentor-students":
					// 	return <MentorStudentsPage />;
					case "mentor-add-course":
						return <MentorFormCoursePage onNavigate={handleNavigate} />;
					default:
						break;
				}
			}
		}

		if (
			(userRole === "admin" && mentorPages.includes(currentPage)) ||
			(userRole === "mentor" && adminPages.includes(currentPage))
		) {
			setCurrentPage(
				userRole === "admin" ? "admin-dashboard" : "mentor-dashboard"
			);
			history.push(
				`/${userRole === "admin" ? "admin-dashboard" : "mentor-dashboard"}`
			);
			return userRole === "admin" ? <AdminDashboard /> : <MentorDashboard />;
		}

		const content = (() => {
			switch (currentPage) {
				case "profile":
					return isAuthenticated ? (
						<ProfilePage
							userRole={userRole}
							userData={userData}
							onNavigate={handleNavigate}
						/>
					) : null;
				case "edit-profile":
					return isAuthenticated ? (
						<EditProfilePage
							onNavigate={handleNavigate}
							userRole={userRole}
							userData={userData}
							onUpdateUserData={handleUpdateUserData}
						/>
					) : null;
				case "transaction-history":
					return isAuthenticated ? (
						<TransactionHistoryPage
							userData={userData}
							onPaymentSubmit={handlePaymentSubmit}
						/>
					) : null;
				case "session-history":
					return isAuthenticated ? (
						<SessionHistoryPage userData={userData} />
					) : null;
				case "mentors":
					return (
						<MentorsPage
							courses={courses}
							onSchedule={handleSchedule}
							onCoursePackageSelect={handleCoursePackageSelect}
							showPostLoginLoading={showPostLoginLoading}
						/>
					);
				case "courses":
					return selectedCourse && selectedPackage ? (
						<div className="py-4">
							<button
								onClick={() => {
									setSelectedCourse(null);
									setSelectedPackage(null);
								}}
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
								<p className="translate-x-2">Go Back</p>
							</button>

							{/* Course & Package Info */}
							<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{selectedCourse.courseName}
								</h3>
								<p className="text-gray-600 mb-3">
									{selectedCourse.courseDescription}
								</p>
								<div className="flex items-center gap-4">
									<div className="bg-white px-3 py-1 rounded-lg border">
										<span className="text-sm font-medium text-gray-700">
											Paket: {selectedPackage.name}
										</span>
									</div>
									<div className="bg-white px-3 py-1 rounded-lg border">
										<span className="text-sm font-medium text-green-600">
											Rp{" "}
											{(() => {
												// iNI DIPAKE BUAT PAYMENT MODAL FLOW SETELAH BOOKING
												// ambil biaya mentor per sesi dari course
												const mentorFee =
													selectedCourse?.mentor?.biayaPerSesi || 0;

												// Menghitung harga paket
												const packagePrice = selectedPackage.totalPrice || 0;
												const packageDiscount = selectedPackage.diskon || 0;
												const finalPackagePrice = Math.max(
													packagePrice - packageDiscount,
													0
												);

												// Total harga (paket + harga mentor)
												const totalPrice = finalPackagePrice + mentorFee;

												return totalPrice.toLocaleString();
											})()}
										</span>
									</div>
								</div>
							</div>
							{/* 
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Pilih Mentor untuk {selectedCourse.courseName}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors
									?.filter((mentor) => mentor.status === "active")
									.map((mentor) => (
										<MentorCard
											key={mentor.id}
											mentor={mentor}
											onSchedule={(selectedMentor, course) =>
												handleSchedule(selectedMentor, course, selectedPackage)
											}
											selectedCourse={selectedCourse}
											schedules={schedules}
										/>
									))}
							</div> */}
						</div>
					) : (
						<CoursesPage
							courses={courses}
							onCourseClick={handleCourseClick}
							isLoading={isLoading}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							userRole={userRole}
							filteredCourses={filteredCourses}
						/>
					);
				case "about":
					return <AboutPage onNavigate={handleNavigate} />;
				case "home":
					return selectedCourse && selectedPackage ? (
						<div className="py-4">
							<button
								onClick={() => {
									setSelectedCourse(null);
									setSelectedPackage(null);
								}}
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
								<p className="translate-x-2">Go Back</p>
							</button>

							{/* Course & Package Info */}
							<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{selectedCourse.courseName}
								</h3>
								<p className="text-gray-600 mb-3">
									{selectedCourse.courseDescription}
								</p>
								<div className="flex items-center gap-4">
									<div className="bg-white px-3 py-1 rounded-lg border">
										<span className="text-sm font-medium text-gray-700">
											Paket: {selectedPackage.name}
										</span>
									</div>
									<div className="bg-white px-3 py-1 rounded-lg border">
										<span className="text-sm font-medium text-green-600">
											Rp{" "}
											{(
												selectedPackage.totalPrice -
												(selectedPackage.diskon || 0)
											).toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Pilih Mentor untuk {selectedCourse.courseName}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors
									?.filter((mentor) => mentor.status === "active")
									.map((mentor) => (
										<MentorCard
											key={mentor.id}
											mentor={mentor}
											onSchedule={(selectedMentor, course) =>
												handleSchedule(selectedMentor, course, selectedPackage)
											}
											selectedCourse={selectedCourse}
										/>
									))}
							</div>
						</div>
					) : (
						<Home
							courses={courses}
							filteredCourses={filteredCourses}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							handleCourseClick={handleCourseClick}
							userRole={userRole}
							onNavigate={handleNavigate}
							isLoading={isLoading}
						/>
					);
				default:
					return <NotFoundPage />;
			}
		})();

		return (
			<motion.div
				className="page-transition"
				initial={{ opacity: 0 }} // Masuk dari kanan
				animate={{ opacity: 1 }} // Posisi normal
				exit={{ opacity: 0 }} // Keluar ke kiri
				transition={{ duration: 0.3 }}
				key={currentPage} // Key untuk memicu animasi
			>
				{content}
			</motion.div>
		);
	};

	if (apiError) {
		return (
			<>
				<ApiError
					code={apiError.code}
					message={apiError.message}
					alias={apiError.alias}
				/>
				<div
					className="fixed z-50 bottom-6 right-6 flex flex-col items-end"
					onMouseEnter={() => setShowHelpMenu(true)}
					onMouseLeave={() => setShowHelpMenu(false)}>
					{/* Menu muncul saat hover */}
					<AnimatePresence>
						{showHelpMenu && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.2 }}
								className="mb-2 flex flex-col gap-1 items-end">
								{/* WhatsApp Button */}
								<a
									href="https://wa.me/6283871417229?text=Halo%20admin%2C%20saya%20butuh%20bantuan%20tentang%20ChillAjar"
									target="_blank"
									rel="noopener noreferrer"
									className="
							flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500
							text-white font-medium shadow hover:bg-green-600 active:bg-green-700
							transition-all duration-150 text-sm
						  ">
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.18 1.6 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
									</svg>
									<span>Bantuan?</span>
								</a>
							</motion.div>
						)}
					</AnimatePresence>
					{/* Tombol utama tanda tanya */}
					<HelpButton onClick={() => setShowHelpMenu((v) => !v)} />
				</div>
			</>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{!hideNavigationPages.includes(currentPage) && (
				<Navigation
					onNavigate={handleNavigate}
					onLogout={handleLogoutWithHistory}
				/>
			)}

			<main className="flex-grow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>{" "}
				</div>
				{selectedMentor && bookingCourse && (
					<BookingModal
						mentor={selectedMentor}
						selectedCourse={bookingCourse}
						selectedPackage={selectedPackage} // Buat modal menerima data selectedPackage
						onClose={handleBookingModalClose}
						onSubmit={handleBookingSubmit}
						location={location}
					/>
				)}
				{showCourseSelection && selectedMentor && (
					<CourseSelectionModal
						// Komponen CourseSelectionModal kini hanya menerima courses dari selectedMentor,
						// dan setiap course diharapkan sudah memiliki field jadwal_kursus hasil mapping dari backend.
						// Semua logic pemilihan kursus dan jadwal kini mengacu pada jadwal_kursus, bukan gayaMengajar di level kursus.
						courses={selectedMentor.courses || []}
						onSelect={handleCourseSelect}
						onClose={handleCourseSelectionClose}
						onConfirm={() => {
							// Sekarang semua course selection harus melalui package selection
							if (bookingCourse) {
								handleCoursePackageSelect(bookingCourse);
							}
						}}
						onCoursePackageSelect={handleCoursePackageSelect}
						selectedCourse={bookingCourse}
					/>
				)}
				{showPayment && currentBooking && (
					<PaymentModal
						booking={currentBooking}
						mentor={currentBooking?.mentor}
						onClose={() => {
							setShowPayment(false);
							setCurrentBooking(null);
							setCurrentPage("transaction-history"); // arahkan ke halaman tujuan
							history.push("/transaction-history"); // update URL
							// [gayaMengajar JADWAL ONLY] Komentar: Menampilkan PaymentModal hanya jika pembayaran sedang berlangsung dan booking sudah ada. Semua data mode belajar (gayaMengajar) sudah diambil dari jadwal_kursus, bukan dari level kursus.
							Swal.fire({
								icon: "warning",
								title: "Pembayaran Belum Selesai",
								html: `<span style="color:red;">Batas waktu pembayaran 1x24 jam.</span>`,
								confirmButtonColor: "#f59e0b",
								confirmButtonText: "Baik",
							});
						}}
						onSubmit={handlePaymentSubmit}
					/>
				)}
				{showAuthModal && <AuthModal defaultMode="login" />}
			</main>
			<Footer
				onNavigate={handleNavigate}
				className="mt-auto"
				onShowGuideModal={() => setShowFlowModal(true)}
			/>
			{userRole === "pelanggan" || userRole === null ? (
				<>
					<div
						className="fixed z-50 bottom-6 right-6 flex flex-col items-end"
						onMouseEnter={() => setShowHelpMenu(true)}
						onMouseLeave={() => setShowHelpMenu(false)}>
						{/* Menu muncul saat hover */}
						<AnimatePresence>
							{showHelpMenu && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{ duration: 0.2 }}
									className="mb-2 flex flex-col gap-1 items-end">
									{/* WhatsApp Button */}
									<a
										href="https://wa.me/6283871417229?text=Halo%20admin%2C%20saya%20butuh%20bantuan%20tentang%20ChillAjar"
										target="_blank"
										rel="noopener noreferrer"
										className="
							flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-500
							text-white font-medium shadow hover:bg-green-600 active:bg-green-700
							transition-all duration-150 text-sm
						  ">
										<svg
											className="w-4 h-4"
											fill="currentColor"
											viewBox="0 0 24 24">
											<path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.18 1.6 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
										</svg>
										<span>Bantuan?</span>
									</a>

									{/* Langkah Pemesanan Button */}
									<button
										onClick={() => setShowFlowModal(true)}
										className="
							flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500
							text-white font-medium shadow hover:bg-blue-600 active:bg-blue-700
							transition-all duration-150 text-sm
						  "
										type="button">
										{/* List/steps icon */}
										<ListChecks className="w-4 h-4" />

										<span>Langkah Pemesanan</span>
									</button>
								</motion.div>
							)}
						</AnimatePresence>
						{/* Help Button: Menu untuk bantuan */}
						<HelpButton onClick={() => setShowHelpMenu((v) => !v)} />

						{/* FaQ Widget: Menu untuk FAQ */}
						<FaQWidget />
					</div>
					{/* Modal Alur/Langkah Pemesanan */}
					<GuideModal
						show={showFlowModal}
						onClose={() => setShowFlowModal(false)}
					/>

					{/* Package Selection Modal */}
					{showPackageSelection && selectedCourse && (
						<CoursePackageSelectionModal
							course={selectedCourse}
							onClose={() => {
								setShowPackageSelection(false);
								// Reset jika tidak ada mentor yang dipilih
								if (selectedMentor) {
									setSelectedCourse(null);
								}
							}}
							onConfirm={(selectedPackage) => {
								setSelectedPackage(selectedPackage);
								setShowPackageSelection(false);

								// Jika ada mentor (mentor -> course -> package flow)
								if (selectedMentor) {
									// Trigger booking modal dengan mentor, course, beserta package
									handleSchedule(
										selectedMentor,
										selectedCourse,
										selectedPackage
									);
									// Don't clear mentor selection immediately - let booking modal handle it
									// setSelectedMentor(null);
								}
								// If no mentor (course -> package -> mentor flow),
								// the mentor selection will be shown via the course/home page rendering logic
							}}
						/>
					)}
				</>
			) : null}
			{/* Tombol bantuan dan alur pemesanan */}

			{/* Floating Session Reminder Muncul Ketika Pelanggan baru saja login */}
			<FloatingSessionReminder />

			{/* Global TestimoniModal Untuk Session Widget dan Session History */}
			{showTestimoniModal && testimoniSession && (
				<TestimoniModal
					isOpen={showTestimoniModal}
					onClose={closeTestimoniModal}
					onSubmit={handleSubmitTestimoni}
					session={testimoniSession}
				/>
			)}
		</div>
	);
}

export default App;
