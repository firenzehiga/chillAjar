import React, { useState, useEffect } from "react";
import defaultPhoto from "../public/foto_kursus/default.jpg";
import { Search, ArrowLeft } from "lucide-react";
import { CourseCard } from "./components/CourseCard";
import { MentorCard } from "./components/MentorCard";
import { CourseCarousel } from "./components/CourseCarousel";
import { BookingModal } from "./components/BookingModal";
import { PaymentModal } from "./components/PaymentModal";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { CourseSkeletonCard } from "./components/Skeleton/CourseSkeletonCard";

// Halaman utama
import { CoursesPage } from "./pages/CoursesPage";
import { MentorsPage } from "./pages/MentorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { HistoryPage } from "./pages/HistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { AuthModal } from "./components/AuthModal";
import { CourseSelectionModal } from "./components/CourseSelectionModal";
import { Home } from "./pages/Home";

// Halaman Admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProfilePage } from "./pages/admin/profile/AdminProfilePage";
import { AdminEditProfile } from "./pages/admin/profile/AdminEditProfile";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminCoursesPage } from "./pages/admin/course/AdminCoursesPage";
import { AdminFormCoursePage } from "./pages/admin/course/FormCoursePage";
import { AdminMentorsPage } from "./pages/admin/AdminMentorsPage";
import { AdminPaymentsPage } from "./pages/admin/AdminPaymentsPage";
// Halaman Mentor
import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "./pages/mentor/MentorSchedulePage";
import { MentorCoursesPage } from "./pages/mentor/course/MentorCoursesPage";
import { MentorStudentsPage } from "./pages/mentor/MentorStudentsPage";
import { MentorFormCoursePage } from "./pages/mentor/course/FormCoursePage";
import { MentorProfilePage } from "./pages/mentor/profile/MentorProfilePage";
import { MentorEditProfile } from "./pages/mentor/profile/MentorEditProfile";
import { motion, AnimatePresence } from "framer-motion"; // Impor Framer Motion

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
	"admin-manage-courses",
	"admin-add-course",
	"admin-edit-course",
	"admin-manage-mentors",
	"admin-profile",
	"admin-edit-profile",
];
const mentorPages = [
	"mentor-dashboard",
	"mentor-manage-schedule",
	"mentor-manage-courses",
	"mentor-manage-students",
	"mentor-add-course",
	"mentor-edit-course",
	"mentor-profile",
	"mentor-edit-profile",
];
const protectedPages = [
	...adminPages,
	...mentorPages,
	"profile",
	"history",
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
					? { Authorization: `Bearer ${localStorage.getItem("token")}` }
					: {},
			});
			// console.log("API Response:", response.data); // Debug: Periksa data dari API
			const mappedCourses = response.data.map((course) => ({
				id: course.id,
				mentor_id: course.mentor_id,
				courseName: course.namaKursus,
				courseDescription: course.deskripsi,
				courseImage: course.fotoKursus
					? `/storage/${course.fotoKursus}`
					: "/foto_kursus/default.jpg",
				learnMethod:
					course.gayaMengajar === "online"
						? "Online Learning"
						: course.gayaMengajar === "offline"
						? "Offline Learning"
						: "Belum diatur",
				price_per_hour: course.mentor?.biayaPerSesi || 0,
				mentors: [
					{
						id: course.mentor?.id || null,
						mentorName: course.mentor?.user?.nama || "Unknown Mentor",
						mentorImage: course.mentor?.user?.avatar
							? `/${course.mentor?.user?.avatar}`
							: "/foto_mentor/default.png",
						mentorRating: course.mentor?.rating || 0,
						mentorAbout: course.mentor?.deskripsi || "No description",
						availableLearnMethod: [
							// buat menampilkan gaya mengajar yang tersedia di mentorcard
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
						schedules: course.jadwal_kursus || [], // Pastikan schedules ada di sini

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
								schedules: course.jadwal_kursus || [], // Pastikan schedules ada di sini
							},
						],
					},
				],
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
				setCurrentPage("history");
				history.push("/history");
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
		if (!isAuthenticated && ["profile", "history", "settings"].includes(page)) {
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
					case "admin-manage-courses":
						return <AdminCoursesPage onNavigate={handleNavigate} />;
					case "admin-add-course":
						return <AdminFormCoursePage onNavigate={handleNavigate} />;
					case "admin-manage-mentors":
						return <AdminMentorsPage />;
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
					case "mentor-manage-students":
						return <MentorStudentsPage />;
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
				case "history":
					return isAuthenticated ? (
						<HistoryPage
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
						/>
					);
				default:
					return "menu yang kamu cari tidak ada (soon bakal dibuat tampilan lebih bagus)";
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
						courses={selectedMentor.courses || []}
						onSelect={handleCourseSelect}
						onClose={handleCourseSelectionClose}
						onConfirm={() => {
							setShowCourseSelection(false);
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
		</div>
	);
}

export default App;
