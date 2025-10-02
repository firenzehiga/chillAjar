import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import showToast from "@/components/User/customToast";
import { ListChecks, LucideShieldQuestion } from "lucide-react";
import { MentorCard } from "@/components/MentorCard";
import { BookingModal } from "@/components/BookingModal";
import { PaymentModal } from "@/components/PaymentModal";
import { Navigation } from "@/components/Layout/Navigation";
import { Hero } from "@/components/Layout/Hero";
import Footer from "@/components/Layout/Footer";
import { CourseSkeletonCard } from "@/components/Skeleton/CourseSkeletonCard";
import { CarouselSkeleton } from "@/components/Skeleton/CarouselSkeleton";
import { BookLoader } from "@/components/User/BookLoader";
import { NotFoundPage } from "@/components/Fallback/NotFound";

import { FaQWidget } from "@/components/FaQWidget"; // Impor komponen FaQWidget
import { GuideModal } from "@/components/User/HelpButton"; // Impor komponen GuideModal
import { HelpButton } from "@/components/User/HelpButton"; // Impor komponen HelpButton
import {
	FloatingSessionReminder,
	SessionBanner,
} from "@/components/SessionReminder"; // Impor Session Reminder

// Halaman utama
import {
	PrivacyPolicyPage,
	TermsConditionsPage,
} from "@/pages/PolicyTermsPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { MentorsPage } from "@/pages/MentorsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { TransactionHistoryPage } from "@/pages/TransactionHistoryPage";
import { SessionHistoryPage } from "@/pages/SessionHistoryPage";
import { AboutPage } from "@/pages/AboutPage";
import { AuthModal } from "@/components/AuthModal";
import { TestimoniModal } from "@/components/TestimoniModal";
import { CourseSelectionModal } from "@/components/CourseSelectionModal";
import { CoursePackageSelectionModal } from "@/components/CoursePackageSelectionModal";
import { Home } from "@/pages/Home";

// Import Zustand Store
import useAppStore from "@/stores/useAppStore";
// Import halaman berdasarkan role user
import { shouldHideNavigation } from "@/constants/pages";
// Halaman Admin
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminProfilePage } from "@/pages/admin/profile/AdminProfilePage";
import { AdminEditProfile } from "@/pages/admin/profile/AdminEditProfile";
import { AdminUsersPage } from "@/pages/admin/manage-users/AdminUsersPage";
import { AdminCoursesPage } from "@/pages/admin/manage-courses/AdminCoursesPage";
import { AdminFormCoursePage } from "@/pages/admin/manage-courses/FormCoursePage";
import { AdminMentorsPage } from "@/pages/admin/manage-mentors/AdminMentorsPage";
import { AdminFormMentorsPage } from "@/pages/admin/manage-mentors/FormMentorsPage";
import { AdminPaymentsPage } from "@/pages/admin/manage-payments/AdminPaymentsPage";
import { AdminSessionsPage } from "@/pages/admin/manage-sessions/AdminSessionsPage";
import { AdminFormSessionsPage } from "@/pages/admin/manage-sessions/FormSessionsPage";
import { AdminTestimoniesPage } from "@/pages/admin/manage-testimonials/AdminTestimoniesPage";
import { AdminFormTestimoniesPage } from "@/pages/admin/manage-testimonials/FormTestimoniesPage";
import { AdminItemsPage } from "@/pages/admin/manage-items/AdminItemsPage";
import { AdminFormItemsPage } from "@/pages/admin/manage-items/FormItemPage";
import { AdminPackagesPage } from "@/pages/admin/manage-packages/AdminPackagesPage";
import { AdminFormPackagesPage } from "@/pages/admin/manage-packages/FormPackagePage";
// Halaman Mentor
import { MentorDashboard } from "@/pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "@/pages/mentor/sessions/MentorSchedulePage";
import { MentorCoursesPage } from "@/pages/mentor/courses/MentorCoursesPage";
import { MentorTestimoniesPage } from "@/pages/mentor/MentorTestimoniesPage";
import { MentorFormCoursePage } from "@/pages/mentor/courses/FormCoursePage";
import { MentorProfilePage } from "@/pages/mentor/profile/MentorProfilePage";
import { MentorEditProfile } from "@/pages/mentor/profile/MentorEditProfile";
import { motion, AnimatePresence } from "framer-motion"; // Impor Framer Motion

import { getImageUrl } from "@/utils/getImageUrl"; // Utility function to get image URL

import Swal from "sweetalert2";
import api from "@/api";
import { createBrowserHistory } from "history";
import { useQueryClient } from "@tanstack/react-query";
import { usePublicCoursesQuery } from "@/hooks/useCourse";
import ApiError from "@/components/Fallback/ApiError";

import {
	adminPages,
	mentorPages,
	pelangganPages,
	publicPages,
	protectedPages,
	hideNavigationPages,
} from "@/constants/pages";

const history = createBrowserHistory();
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
		data: rawCourses = [],
		isLoading,
		error,
		refetch,
	} = usePublicCoursesQuery({
		enabled: shouldFetchCourses,
	});

	// Proses mapping data courses seperti yang sudah Anda buat
	const courses = rawCourses.map((course) => {
		const schedules = Array.isArray(course.jadwal_kursus) // Cek apakah jadwal_kursus ada dan merupakan array
			? course.jadwal_kursus
			: Array.isArray(course.jadwalKursus)
			? course.jadwalKursus
			: [];

		const validModes = Array.from(
			// Ini cara untuk mendapatkan mode belajar unik dari jadwal_kursus
			new Set(
				schedules
					.map((j) => j.gayaMengajar)
					.filter((m) => m === "online" || m === "offline")
			)
		);

		// Simpan mode apa adanya (online / offline). Fallback kalau kosong.
		const learnMethod =
			validModes.length === 0
				? "Belum diatur"
				: validModes.length === 1
				? validModes[0]
				: validModes.join(", ");

		const mentorData = course.mentor || {};

		return {
			id: course.id,
			mentor_id: course.mentor_id,
			mentorName: mentorData?.user?.nama,
			courseName: course.namaKursus,
			courseDescription: course.deskripsi,
			courseImage: getImageUrl(
				course.fotoKursus,
				"/foto_kursus/default.jpg"
			),
			learnMethod,
			price_per_hour: mentorData?.biayaPerSesi || 0,
			mentor: mentorData,
			mentors: [
				{
					id: mentorData?.id || null,
					status: mentorData?.status || "active",
					mentorName: mentorData?.user?.nama || "Unknown Mentor",
					mentorImage: getImageUrl(
						mentorData?.user?.foto_profil,
						"/foto_mentor/default.png"
					),
					mentorRating: mentorData?.rating || 0,
					mentorAbout: mentorData?.deskripsi || "No description",
					mentorPhone: mentorData?.user?.nomorTelepon || "+1234567890",
					mentorAddress:
						mentorData?.user?.alamat || "Alamat tidak tersedia",
					schedules: schedules.map((s) => ({
						...s,
						teachingMode: {
							online: s.gayaMengajar === "online",
							offline: s.gayaMengajar === "offline",
						},
					})),
					courses: [
						{
							id: course.id,
							courseName: course.namaKursus,
							learnMethod,
							schedules: schedules.map((s) => ({
								...s,
								teachingMode: {
									online: s.gayaMengajar === "online",
									offline: s.gayaMengajar === "offline",
								},
							})),
						},
					],
				},
			],
			jadwal_kursus: schedules,
		};
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

	const modalPushedRef = useRef(false);
	const listenerAddedRef = useRef(false);
	const ignoreNextPopRef = useRef(false);

	useEffect(() => {
		const onPopState = (e) => {
			if (ignoreNextPopRef.current) {
				ignoreNextPopRef.current = false;
				return;
			}

			// hanya tangani jika salah satu modal terbuka dan kita memang sudah push state untuk modal
			if (!(showBookingModal || showPayment) || !modalPushedRef.current) return;

			// Booking modal open
			if (showBookingModal) {
				// tampilkan swal bercustom class (Tailwind)
				Swal.fire({
					title: "Batalkan pemesanan?",
					html: "Jika Anda kembali sekarang, pemesanan yang belum diselesaikan akan dibatalkan.",
					showCancelButton: true,
					confirmButtonText: "Ya, batalkan",
					cancelButtonText: "Tetap di sini",
					buttonsStyling: false, // pake kelas custom sendiri
					reverseButtons: true,
					customClass: {
						// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
						popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
						title: "text-lg font-semibold text-gray-900",
						content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
						// tambahkan container actions dengan gap agar tombol tidak saling dempet
						actions: "flex gap-3 justify-center mt-4",
						confirmButton:
							"px-4 py-2 focus:outline-none rounded-md bg-yellow-500 hover:bg-yellow-600 text-white",
						cancelButton:
							"px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
					},
					backdrop: true,
				}).then((result) => {
					if (result.isConfirmed) {
						modalPushedRef.current = false;
						setShowBookingModal(false);
						setSelectedMentor(null);
						setBookingCourse(null);
						setSelectedPackage(null);
						// cleanup listener & nav
						if (listenerAddedRef.current) {
							window.removeEventListener("popstate", onPopState);
							listenerAddedRef.current = false;
						}
						history.push("/home");
					} else {
						// tetap di modal — suppress next pop event dan kembalikan forward tanpa pushState
						ignoreNextPopRef.current = true;
						try {
							window.history.forward();
						} catch (e) {}
						setTimeout(() => (ignoreNextPopRef.current = false), 500);
					}
				});
				return;
			}
			// Payment modal open
			if (showPayment) {
				Swal.fire({
					title: "Pembayaran belum selesai",
					html: "Jika Anda kembali sekarang, pembayaran masih harus dilakukan untuk menyelesaikan pemesanan.",
					showCancelButton: true,
					confirmButtonText: "Ya, saya yakin",
					cancelButtonText: "Tetap di sini",
					buttonsStyling: false,
					reverseButtons: true,
					customClass: {
						// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
						popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
						title: "text-lg font-semibold text-gray-900",
						content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
						// tambahkan container actions dengan gap agar tombol tidak saling dempet
						actions: "flex gap-3 justify-center mt-4",
						confirmButton:
							"px-4 py-2 focus:outline-none rounded-md bg-yellow-500 hover:bg-yellow-600 text-white",
						cancelButton:
							"px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
					},
					backdrop: true,
				}).then((result) => {
					if (result.isConfirmed) {
						modalPushedRef.current = false;
						setShowPayment(false);
						setCurrentBooking(null);
						if (listenerAddedRef.current) {
							window.removeEventListener("popstate", onPopState);
							listenerAddedRef.current = false;
						}
						setCurrentPage("transaction-history");
						history.push("/transaction-history");
					} else {
						ignoreNextPopRef.current = true;
						try {
							window.history.forward();
						} catch (e) {}
						setTimeout(() => (ignoreNextPopRef.current = false), 500);
					}
				});

				setConfirmOpen(false);
			}
		};

		// push/listener hanya sekali per buka modal
		if (showBookingModal || showPayment) {
			if (!modalPushedRef.current) {
				window.history.pushState({ fromModal: true }, "");
				modalPushedRef.current = true;
			}
			if (!listenerAddedRef.current) {
				window.addEventListener("popstate", onPopState);
				listenerAddedRef.current = true;
			}
		} else {
			// kalau modal tertutup, bersihkan
			if (listenerAddedRef.current) {
				window.removeEventListener("popstate", onPopState);
				listenerAddedRef.current = false;
			}
			modalPushedRef.current = false;
		}

		return () => {
			if (listenerAddedRef.current) {
				window.removeEventListener("popstate", onPopState);
				listenerAddedRef.current = false;
			}
		};
	}, [
		showBookingModal,
		showPayment,
		setShowBookingModal,
		setSelectedMentor,
		setBookingCourse,
		setSelectedPackage,
		setShowPayment,
		setCurrentBooking,
		setCurrentPage,
	]);

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
			showToast({
				type: "error",
				icon: <LucideShieldQuestion size={25} className="text-red-200" />,
				tipIcon: "💡",
				tipText: "Silakan coba lagi nanti atau pilih kursus lainnya.",
				title: "Belum ada jadwal kursus saat ini",
				message: "Mohon maaf, mentor untuk kursus ini belum menambahkan jadwal",
				duration: 2000,
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
				// 🍞 Toast
				showToast({
					type: "success",
					title: "🎉 Pemesanan Berhasil!",
					message: "Silakan lakukan pembayaran untuk mengonfirmasi sesi Anda",
				});
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
					jumlahSementara: sesiBaru.jumlahSementara ?? 0,
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
			
			setShowPayment(false);

			setCurrentBooking(null);
			setSelectedCourse(null); // ✅ Reset course
			setSelectedMentor(null); // ✅ Reset mentor
			setSelectedPackage(null); // ✅ Reset package
			setBookingCourse(null); // ✅ Reset booking course
			setShowPackageSelection(false); // ✅ Close package modal jika masih terbuka

			// console.log("Transaksi response:", res.data); // Debugging
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

				showToast({
					type: "success",
					icon: "👋",
					title: "Berhasil logout!",
					message: "Selamat tinggal, sampai jumpa lagi!",
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
			showToast({
				type: "error",
				icon: <LucideShieldQuestion size={25} className="text-red-200" />,
				tipIcon: "💡",
				tipText: "Silakan coba lagi nanti atau pilih kursus lainnya.",
				title: "Belum ada jadwal kursus saat ini",
				message: "Mohon maaf, mentor untuk kursus ini belum menambahkan jadwal",
				duration: 2000,
			});
			return;
		}

		setSelectedCourse(course);

		// UBAH: Jangan langsung buka package selection, tapi tampilkan mentor selection di UI
		// setShowPackageSelection(true); // Hapus ini

		// Reset mentor dan package selection
		setSelectedMentor(null);
		setSelectedPackage(null);

		// Navigate ke halaman courses dengan course terpilih untuk menampilkan mentor
		if (currentPage !== "courses") {
			setCurrentPage("courses");
			history.push("/courses");
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Fungsi baru untuk handle klik mentor dari course page
	const handleMentorClickFromCourse = (mentor, course) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		// Kalau mentor tidak ada jadwal untuk course ini, tampilkan toast error
		const mentorSchedules = course.jadwal_kursus || [];
		if (mentorSchedules.length === 0) {
			showToast({
				type: "error",
				icon: <LucideShieldQuestion size={25} className="text-red-200" />,
				tipIcon: "💡",
				tipText: "Silakan coba mentor lain atau coba lagi nanti.",
				title: "Mentor belum memiliki jadwal",
				message:
					"Mohon maaf, mentor ini belum menambahkan jadwal untuk kursus ini",
				duration: 2000,
			});
			return;
		}

		setSelectedMentor(course.mentor);
		setSelectedCourse(course);
		setShowPackageSelection(true); // Sekarang baru buka package selection
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
		setSelectedPackage(null);
		setShowPackageSelection(false);

		/**
		 * Reset selectedCourse dan selectedMentor
		 * Agar Saat close modal paket di halaman mentor,
		 * engga ngebuat halaman course jadi di kondisi setelah klik course
		 */
		setSelectedCourse(null);
		setSelectedMentor(null);
	};

	// ==== FUNGSI REDIRECT JIKA AKSES HALAMAN YANG TIDAK DIIZINKAN ====
	const getRedirectPage = (currentPage, userRole) => {
		const isPelangganPage = [...pelangganPages, ...publicPages].includes(
			currentPage
		);
		const isMentorPage = mentorPages.includes(currentPage);
		const isAdminPage = adminPages.includes(currentPage);
		const isAdminOrMentor = userRole === "admin" || userRole === "mentor";

		// Jika admin/mentor mengakses halaman pelanggan
		if (isAdminOrMentor && isPelangganPage)
			return userRole === "admin" ? "admin-dashboard" : "mentor-dashboard";

		// Jika pelanggan mengakses halaman admin/mentor
		if (userRole === "pelanggan" && (isAdminPage || isMentorPage))
			return "home";

		// Jika admin dan mentor saling mengakses halaman masing-masing
		if (
			(userRole === "admin" && isMentorPage) ||
			(userRole === "mentor" && isAdminPage)
		)
			return userRole === "admin" ? "admin-dashboard" : "mentor-dashboard";

		return null; // Tidak perlu redirect
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
		/**
		 *  Kondisi untuk non-user yang mengakses halaman terproteksi
		 *  Cek apakah user sudah login dan halaman yang diakses termasuk protectedPages
		 *  */
		// maka redirect ke halaman home dan tampilkan modal autentikasi
		if (!isAuthenticated && protectedPages.includes(currentPage)) {
			setCurrentPage("home");
			history.push("/home");
			setShowAuthModal(false);
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

		// Gunakan fungsi untuk menentukan apakah perlu redirect
		const redirectPage = isAuthenticated
			? getRedirectPage(currentPage, userRole)
			: null;

		if (redirectPage) {
			setCurrentPage(redirectPage);
			history.push(`/${redirectPage}`);

			/**
			 * Kondisi untuk user yang sudah login tapi mengakses halaman yang tidak diizinkan
			 * Redirect ke halaman yang sesuai role
			 */
			if (redirectPage === "admin-dashboard") {
				return <AdminDashboard />;
			} else if (redirectPage === "mentor-dashboard") {
				return <MentorDashboard />;
			} else if (redirectPage === "home") {
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

		/**
		 * LOGIKA UNTUK ADMIN
		 * Untuk Halaman Edit yang Dinamis (dengan ID), menggunakan logika if terpisah
		 * karena harus ekstrak ID dari URL terlebih dahulu sebelum render komponen.
		 * Contoh: admin-edit-course/:id
		 * Switch Case untuk halaman statis admin
		 * */
		if (userRole === "admin") {
			// Logika untuk halaman statis admin
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

			// Logika untuk halaman statis admin
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

		/**
		 * LOGIKA UNTUK MENTOR
		 * Untuk Halaman Edit yang Dinamis (dengan ID), menggunakan logika if terpisah
		 * karena harus ekstrak ID dari URL terlebih dahulu sebelum render komponen.
		 * Contoh: mentor-edit-course/:id
		 * Switch Case untuk halaman statis mentor
		 * */
		if (userRole === "mentor") {
			// Logika untuk halaman dinamis mentor
			if (currentPage.startsWith("mentor-edit-course")) {
				const id = currentPage.split("mentor-edit-course/")[1];
				return (
					<MentorFormCoursePage onNavigate={handleNavigate} courseId={id} />
				);
			}

			// Logika untuk halaman statis mentor
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

		/**
		 * LOGIKA UNTUK PELANGGAN/NON USER
		 * Untuk Halaman Pelanggan dilakukan cek isAuthenticated terlebih dahulu
		 * Switch Case untuk halaman statis pelanggan
		 * */
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
						coursesIsLoading={isLoading}
					/>
				);
			case "courses":
				return selectedCourse && !selectedPackage ? (
					<div className="py-4">
						<button
							onClick={() => {
								setSelectedCourse(null);
								setSelectedMentor(null);
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
											handleMentorClickFromCourse(selectedMentor, course)
										}
										selectedCourse={selectedCourse}
										schedules={schedules}
									/>
								))}
						</div>{" "}
					</div>
				) : selectedCourse && selectedPackage && selectedMentor ? (
					// Tampilan setelah semua terpilih (mentor + course + package)
					<div className="py-4">
						{/* Course & Package & Mentor Info */}
						<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{selectedCourse.courseName}
							</h3>
							<p className="text-gray-600 mb-3">
								{selectedCourse.courseDescription}
							</p>
							<div className="flex items-center gap-4 flex-wrap">
								<div className="bg-white px-3 py-1 rounded-lg border">
									<span className="text-sm font-medium text-gray-700">
										Mentor: {selectedMentor.user?.nama}
									</span>
								</div>
								<div className="bg-white px-3 py-1 rounded-lg border">
									<span className="text-sm font-medium text-gray-700">
										Paket: {selectedPackage.name}
									</span>
								</div>
							</div>
						</div>
						{/* Button untuk proceed ke booking */}
						<div className="text-center">
							<button
								onClick={() =>
									handleSchedule(
										selectedMentor,
										selectedCourse,
										selectedPackage
									)
								}
								className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200">
								Lanjut ke Pemesanan
							</button>
						</div>
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
				return selectedCourse && !selectedPackage ? (
					// Sama seperti logic di courses page - mentor selection dulu
					// NOTE: KODE INI GAK KEPAKE, KARENA ALUR HOME PAKE PUNYA COURSESPAGE
					<div className="py-4">
						<button
							onClick={() => {
								setSelectedCourse(null);
								setSelectedMentor(null);
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

						{/* Course Info */}
						{/* <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{selectedCourse.courseName}
								</h3>
								<p className="text-gray-600 mb-3">
									{selectedCourse.courseDescription}
								</p>
							</div> */}

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
											handleMentorClickFromCourse(selectedMentor, course)
										}
										selectedCourse={selectedCourse}
									/>
								))}
						</div>
					</div>
				) : selectedCourse && selectedPackage && selectedMentor ? (
					// Final selection UI setelah semua terpilih
					<div className="py-4">
						{/* Course & Package & Mentor Info */}
						<div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								{selectedCourse.courseName}
							</h3>
							<p className="text-gray-600 mb-3">
								{selectedCourse.courseDescription}
							</p>
							<div className="flex items-center gap-4 flex-wrap">
								<div className="bg-white px-3 py-1 rounded-lg border">
									<span className="text-sm font-medium text-gray-700">
										Mentor: {selectedMentor.mentorName}
									</span>
								</div>
								<div className="bg-white px-3 py-1 rounded-lg border">
									<span className="text-sm font-medium text-gray-700">
										Paket: {selectedPackage.name}
									</span>
								</div>
							</div>
						</div>

						{/* Button untuk proceed ke booking */}
						<div className="text-center">
							<button
								onClick={() =>
									handleSchedule(
										selectedMentor,
										selectedCourse,
										selectedPackage
									)
								}
								className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors duration-200">
								Lanjut ke Pemesanan
							</button>
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
			case "privacy-policy":
				return <PrivacyPolicyPage onNavigate={handleNavigate} />;
			case "terms-conditions":
				return <TermsConditionsPage onNavigate={handleNavigate} />;
			default:
				return <NotFoundPage onNavigate={handleNavigate} />;
		}
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
			{!shouldHideNavigation(currentPage) && (
				<Navigation
					onNavigate={handleNavigate}
					onLogout={handleLogoutWithHistory}
				/>
			)}

			<main className="flex-grow">
				{currentPage === "home" ? (
					<>
						{/* 1) full-width hero */}
						<Hero onNavigate={handleNavigate} />

						{/* 2) sisa konten HOME tetap di dalam container */}
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<AnimatePresence mode="wait">
								<motion.div
									className="page-transition"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									key={currentPage}>
									{renderContent()}
								</motion.div>
							</AnimatePresence>
						</div>
					</>
				) : (
					// halaman lain tetap terpusat
					<div
						className={
							!(
								currentPage === "terms-conditions" ||
								currentPage === "privacy-policy"
							)
								? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
								: ""
						}>
						<AnimatePresence mode="wait">
							<div className="page-transition " key={currentPage}>
								{renderContent()}
							</div>
						</AnimatePresence>
					</div>
				)}
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
				{/* {showCourseSelection && selectedMentor && (
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
				)} */}
				{showPayment && currentBooking && (
					<PaymentModal
						booking={currentBooking}
						mentor={currentBooking?.mentor}
						onClose={() => {
							setShowPayment(false);
							
							setCurrentBooking(null);
							setSelectedMentor(null);
							setSelectedPackage(null);
							setBookingCourse(null);
							setShowPackageSelection(false);
							setShowCourseSelection(false);
							setSelectedCourse(null);

							setCurrentPage("transaction-history"); // arahkan ke halaman tujuan
							// [gayaMengajar JADWAL ONLY] Komentar: Menampilkan PaymentModal hanya jika pembayaran sedang berlangsung dan booking sudah ada. Semua data mode belajar (gayaMengajar) sudah diambil dari jadwal_kursus, bukan dari level kursus.
							showToast({
								type: "error",
								icon: <ListChecks size={25} className="text-red-400" />,
								tipIcon: "💡",
								tipText: "Ingat: Batas waktu pembayaran 1x24 jam",
								title: "Pemesanan Belum Selesai",
								message:
									"Anda memilih untuk membayar nanti. Sesi akan tetap ditahan sementara. Silakan lakukan pembayaran melalui Riwayat Transaksi dalam 1x24 jam untuk mengonfirmasi sesi.",
								duration: 5000,
							});
							history.push("/transaction-history"); // update URL
						}}
						onSubmit={handlePaymentSubmit}
					/>
				)}
				{showAuthModal && (
					<AuthModal defaultMode="login" onNavigate={handleNavigate} />
				)}
			</main>
			{!shouldHideNavigation(currentPage) && (
				<Footer
					onNavigate={handleNavigate}
					className="mt-auto"
					onShowGuideModal={() => setShowFlowModal(true)}
				/>
			)}
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
								handlePackageSelectionClose();
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
					session={testimoniSession}
				/>
			)}
		</div>
	);
}

export default App;
