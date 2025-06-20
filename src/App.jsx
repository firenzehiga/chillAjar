import React, { useState, useEffect } from "react";
import defaultPhoto from "../public/foto_kursus/default.jpg";
import { Search, ArrowLeft, ListChecks } from "lucide-react";
import { CourseCard } from "./components/CourseCard";
import { MentorCard } from "./components/MentorCard";
import { CourseCarousel } from "./components/CourseCarousel";
import { BookingModal } from "./components/BookingModal";
import { PaymentModal } from "./components/PaymentModal";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { CourseSkeletonCard } from "./components/Skeleton/CourseSkeletonCard";
import { NotFoundPage } from "./components/Error/NotFound";

import { GuideModal } from "./components/GuideModal"; // Impor komponen GuideModal
import { HelpButton } from "./components/Button/HelpButton"; // Impor komponen HelpButton
// Halaman utama
import { CoursesPage } from "./pages/CoursesPage";
import { MentorsPage } from "./pages/MentorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { SessionHistoryPage } from "./pages/SessionHistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { AuthModal } from "./components/AuthModal";
import { CourseSelectionModal } from "./components/CourseSelectionModal";
import { Home } from "./pages/Home";

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
	const [currentPage, setCurrentPage] = useState(
		(history.location && history.location.pathname.slice(1)) || "home"
	);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMentor, setSelectedMentor] = useState(null);
	const [bookingCourse, setBookingCourse] = useState(null);
	const [showPayment, setShowPayment] = useState(false);
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [currentBooking, setCurrentBooking] = useState(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userData, setUserData] = useState(null);
	const [showCourseSelection, setShowCourseSelection] = useState(false);
	const [authChecked, setAuthChecked] = useState(false);

	// State untuk bantuan pemahaman aplikasi
	const [showHelpMenu, setShowHelpMenu] = useState(false);
	const [showFlowModal, setShowFlowModal] = useState(false);

	const {
		data: courses = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["courses", isAuthenticated],
		queryFn: async () => {
			const endpoint = isAuthenticated
				? "/pelanggan/daftar-kursus"
				: "/public/kursus";
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
				mentor: course.mentor, // <-- tambahkan property mentor agar bisa diakses di CourseCard
				mentors: [
					{
						id: course.mentor?.id || null,
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
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});
	// Fetch data jadwal dengan React Query
	const {
		data: schedules = [],
		refetch: refetchSchedules,
		// isLoading: isLoadingSchedules,
		// error: scheduleError,
	} = useQuery({
		queryKey: ["schedules", selectedCourse?.id],
		queryFn: async () => {
			if (!selectedCourse?.id) return [];
			const response = await api.get(
				`/jadwal-kursus?kursus_id=${selectedCourse.id}`
			);
			return response.data.map((schedule) => ({
				id: schedule.id,
				kursus_id: schedule.kursus_id,
				tanggal: schedule.tanggal, // Pastikan format: YYYY-MM-DD
				waktu: schedule.waktu, // Pastikan format: HH:MM
				keterangan: schedule.keterangan || "Available",
			}));
		},
		enabled: !!selectedCourse?.id, // Hanya fetch jika kursus dipilih
		staleTime: 0,
		cacheTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	// Refetch schedules setiap kali BookingModal dibuka
	// Setiap kali BookingModal dibuka (yaitu saat selectedMentor dan bookingCourse berubah),
	// jadwal akan di-refetch dari server, sehingga data selalu fresh dan sesuai database terbaru.
	useEffect(() => {
		if (selectedMentor && bookingCourse && refetchSchedules) {
			refetchSchedules();
		}
	}, [selectedMentor, bookingCourse, refetchSchedules]);

	// Fungsi untuk memeriksa apakah pengguna sudah terautentikasi
	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (token && storedUser) {
			try {
				const user = JSON.parse(storedUser);
				const roleFromBackend = user.peran?.toLowerCase();

				if (roleFromBackend) {
					setIsAuthenticated(true);
					setUserRole(roleFromBackend);
					setUserData(user);
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					setIsAuthenticated(false);
					setUserRole(null);
					setUserData(null);
				}
			} catch (error) {
				console.error("Error parsing stored user:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUserRole(null);
				setUserData(null);
			}
		}

		setAuthChecked(true);

		const unlisten = history.listen(({ location }) => {
			const path = location.pathname.slice(1) || "home";
			setCurrentPage(path);
		});

		const initialPath =
			(history.location && history.location.pathname.slice(1)) || "home";
		setCurrentPage(initialPath);

		return () => unlisten();
	}, []);

	const filteredCourses = courses.filter(
		(course) =>
			course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(course.category &&
				course.category.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	// Fungsi untuk menangani pemilihan mentor dan kursus
	const handleSchedule = (mentor, course, schedules, location) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}
		setSelectedMentor(mentor);
		setBookingCourse(course);
		// Cari course asli dari courses utama
		const fullCourse = courses.find((c) => c.id === course.id);
		setSelectedCourse(fullCourse || course); //Memastikan state selectedCourse selalu sesuai dengan course yang akan di-booking
		setCurrentBooking({ schedules, location, mentor, course }); // Simpan semua data sementara
		setShowBookingModal(true); // state untuk membuka modal
	};

	// Fungsi untuk menutup CourseSelectionModal
	const handleCourseSelectionClose = () => {
		setShowCourseSelection(false);
		setBookingCourse(null); // Reset bookingCourse jika Cancel ditekan
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
		customLocation
	) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		if (selectedMentor) {
			try {
				// Temukan jadwal_kursus_id yang sesuai dengan tanggal & waktu yang dipilih
				const selectedSchedule = schedules.find(
					(s) =>
						s.kursus_id === course.id &&
						s.tanggal === date.toISOString().split("T")[0] &&
						s.waktu.startsWith(time.slice(0, 5))
				);

				if (!selectedSchedule) {
					Swal.fire("Gagal booking", "Jadwal tidak ditemukan!", "error");
					return;
				}
				// console.log("userData", userData); // Kirim data sesi ke backend
				const response = await api.post("/pelanggan/pesan-sesi", {
					mentor_id: selectedMentor.id,
					pelanggan_id: userData.pelanggan?.id,
					kursus_id: course.id,
					jadwal_kursus_id: selectedSchedule?.id,
					detailKursus: topic || "No specific topic",
					statusSesi: "pending",
				});
				Swal.fire({
					icon: "success",
					title: "Pemesanan Berhasil!",
					text: "Selanjutnya, silakan lakukan pembayaran untuk mengonfirmasi sesi Anda.",
					timer: 1000,
					timerProgressBar: true,
					showConfirmButton: false,
				});
				// console.log("Sesi response:", response.data); // mau tau apakah data sesi sudah kekirim

				// Simpan data sesi ke state booking
				const sesiBaru = response.data.sesi;
				const booking = {
					course,
					mentor: selectedMentor,
					sesi: sesiBaru,
					date: date.toLocaleDateString(),
					time,
					mode,
					location: mode === "offline" ? customLocation : null,
					topic: topic || "No specific topic",
				};
				setCurrentBooking(booking);
				setSelectedMentor(null);
				setBookingCourse(null);
				setShowPayment(true);
				setShowBookingModal(false);
			} catch (err) {
				Swal.fire(
					"Gagal booking",
					err.response?.data?.message || "Terjadi kesalahan saat booking sesi.",
					"error"
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
			formData.append("pelanggan_id", sesi.pelanggan_id);
			formData.append("mentor_id", sesi.mentor_id);
			formData.append("sesi_id", sesi.id);
			formData.append("jumlah", course.price_per_hour);
			formData.append("statusPembayaran", "menunggu_verifikasi"); // Selalu menunggu verifikasi
			formData.append("metodePembayaran", paymentMethod);
			formData.append(
				"tanggalPembayaran",
				new Date().toISOString().slice(0, 10)
			);
			formData.append("buktiPembayaran", proofImage);

			// Log untuk debugging
			for (let [key, value] of formData.entries()) {
				console.log(`${key}:`, value);
			}

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

			console.log("Transaksi response:", res.data); // Debugging
			setShowPayment(false);
			Swal.fire({
				icon: "success",
				title: transaksiId ? "Proof Updated!" : "Payment Submitted!",
				text: transaksiId
					? "Your payment proof has been updated. We will verify it shortly."
					: "Your booking has been confirmed. We will verify your payment shortly.",
				confirmButtonColor: "#3B82F6",
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
		setIsAuthenticated(true);
		setUserRole(role);
		setUserData(user);
		setShowAuthModal(false);

		if (role === "admin") {
			setCurrentPage("admin-dashboard");
			history.push("/admin-dashboard");
		} else if (role === "mentor") {
			setCurrentPage("mentor-dashboard");
			history.push("/mentor-dashboard");
		}
	};

	const handleUpdateUserData = (updatedData) => {
		console.log("Updating userData with:", updatedData);
		setUserData(updatedData);
		setUserRole(updatedData.peran?.toLowerCase());
		localStorage.setItem("user", JSON.stringify(updatedData));
	};

	// Fungsi untuk logout
	const handleLogout = () => {
		api
			.post("/logout")
			.then(() => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUserRole(null);
				setUserData(null);
				setCurrentPage("home");
				history.push("/home");
				queryClient.clear(); // <-- Hapus semua cache query!

				Swal.fire({
					icon: "success",
					title: "Logged Out!",
					text: "You have been successfully logged out.",
					position: "bottom-end",
					toast: true,
					timer: 2000,
					showConfirmButton: false,
				});
			})
			.catch((error) => {
				console.error("Logout failed:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUserRole(null);
				setUserData(null);
				setCurrentPage("home");
				history.push("/home");
			});
	};

	// Fungsi untuk menangani klik kursus
	const handleCourseClick = (course) => {
		setSelectedCourse(course);
	};

	// Fungsi untuk menutup BookingModal
	const handleBookingModalClose = () => {
		setSelectedMentor(null);
		setBookingCourse(null);
		setSelectedCourse(null); // kalo gajadi, reset selectedCourse juga
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
		const showSkeleton = isLoading && skeletonPages.includes(currentPage);

		// jika showSkeleton bernilai true, maka tampilkan skeleton card sebanyak 6 buah dalam grid
		if (showSkeleton) {
			return (
				<div className="py-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Available Courses
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, idx) => (
							<CourseSkeletonCard key={idx} />
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
					case "admin-edit-mentor":
						return <AdminFormMentorsPage onNavigate={handleNavigate} />;
					default:
						break;
				}
			}
		}

		if (userRole === "mentor") {
			// Tangani URL dinamis terlebih dahulu
			if (currentPage.startsWith("mentor-edit-course")) {
				const id = currentPage.split("mentor-edit-course/")[1];
				return (
					<MentorFormCoursePage onNavigate={handleNavigate} courseId={id} />
				);
			}

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
						<SessionHistoryPage
							userData={userData}
							onPaymentSubmit={handlePaymentSubmit}
						/>
					) : null;
				case "mentors":
					return <MentorsPage courses={courses} onSchedule={handleSchedule} />;
				case "courses":
					return selectedCourse ? (
						<div className="py-4">
							<button
								onClick={() => setSelectedCourse(null)}
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
								{selectedCourse.title} - Available Mentors
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors?.map((mentor) => (
									<MentorCard
										key={mentor.id}
										mentor={mentor}
										onSchedule={handleSchedule}
										selectedCourse={selectedCourse}
										schedules={schedules}
									/>
								))}
							</div>
						</div>
					) : (
						<CoursesPage
							courses={courses}
							onCourseClick={setSelectedCourse}
							isLoading={isLoading}
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							userRole={userRole}
							filteredCourses={filteredCourses}
						/>
					);
				case "about":
					return <AboutPage />;
				case "home":
					return selectedCourse ? (
						<div className="py-4">
							<button
								onClick={() => setSelectedCourse(null)}
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
								{selectedCourse.title} - Available Mentors
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors.map((mentor) => (
									<MentorCard
										key={mentor.id}
										mentor={mentor}
										onSchedule={handleSchedule}
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

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{!hideNavigationPages.includes(currentPage) && (
				<Navigation
					currentPage={currentPage}
					onNavigate={handleNavigate}
					isAuthenticated={isAuthenticated}
					userRole={userRole}
					onAuthClick={() => setShowAuthModal(true)}
					onLogout={handleLogout}
					userData={userData}
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
						onClose={handleBookingModalClose}
						onSubmit={handleBookingSubmit}
						schedules={schedules || []}
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
							setShowCourseSelection(false);
							// handleSchedule akan menggunakan jadwal_kursus dari course yang dipilih
							handleSchedule(selectedMentor, bookingCourse);
						}}
						selectedCourse={bookingCourse}
					/>
				)}
				{showPayment && currentBooking && (
					<PaymentModal
						booking={currentBooking}
						course={currentBooking?.course}
						mentor={currentBooking?.mentor}
						onClose={() => {
							setShowPayment(false);
							setCurrentBooking(null);
							// [gayaMengajar JADWAL ONLY] Komentar: Menampilkan PaymentModal hanya jika pembayaran sedang berlangsung dan booking sudah ada. Semua data mode belajar (gayaMengajar) sudah diambil dari jadwal_kursus, bukan dari level kursus.
							// [gayaMengajar JADWAL ONLY] Komentar: Menampilkan PaymentModal hanya jika pembayaran sedang berlangsung dan booking sudah ada. Semua data mode belajar (gayaMengajar) sudah diambil dari jadwal_kursus, bukan dari level kursus.
							Swal.fire({
								icon: "warning",
								title: "Pembayaran Belum Selesai",
								html: `<span style="color:red;">Batas waktu pembayaran 1x24 jam.</span>`,
								confirmButtonColor: "#3B82F6",
								footer:
									"Klik Ikon Profile &gt; Session History &gt; Cek Sesi &gt; Selesaikan Pembayaran.",
							});
						}}
						onSubmit={handlePaymentSubmit}
					/>
				)}
				{showAuthModal && (
					<AuthModal
						isOpen={showAuthModal}
						onClose={() => setShowAuthModal(false)}
						onSuccess={handleAuthSuccess}
						defaultMode="login"
					/>
				)}
			</main>
			<Footer onNavigate={handleNavigate} className="mt-auto" />
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
										href="https://wa.me/6285882534254?text=Halo%20admin%2C%20saya%20butuh%20bantuan%20tentang%20ChillAjar"
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
						{/* Tombol utama tanda tanya */}
						<HelpButton onClick={() => setShowHelpMenu((v) => !v)} />
					</div>
					{/* Modal Alur/Langkah Pemesanan */}
					<GuideModal
						show={showFlowModal}
						onClose={() => setShowFlowModal(false)}
					/>
				</>
			) : null}
			{/* Tombol bantuan dan alur pemesanan */}
		</div>
	);
}

export default App;
