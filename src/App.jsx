import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { CourseCard } from "./components/CourseCard";
import { MentorCard } from "./components/MentorCard";
import { CourseCarousel } from "./components/CourseCarousel";
import { BookingModal } from "./components/BookingModal";
import { PaymentModal } from "./components/PaymentModal";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { CoursesPage } from "./pages/CoursesPage";
import { MentorsPage } from "./pages/MentorsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HistoryPage } from "./pages/HistoryPage";
import { AboutPage } from "./pages/AboutPage";
import { AuthModal } from "./components/AuthModal";
import { Home } from "./pages/Home";
// Halaman admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminCoursesPage } from "./pages/admin/AdminCoursesPage";
import { AdminMentorsPage } from "./pages/admin/AdminMentorsPage";
// Halaman mentor
import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "./pages/mentor/MentorSchedulePage";
import { MentorCoursesPage } from "./pages/mentor/MentorCoursesPage";
import { MentorStudentsPage } from "./pages/mentor/MentorStudentsPage";
import coursesData from "./utils/constants/CourseData";
import Swal from "sweetalert2";
import api from "./api"; // Sesuaikan path ke file api.jsx

const courses = coursesData;

function App() {
	const [currentPage, setCurrentPage] = useState(
		window.location.hash.slice(1) || "home"
	);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMentor, setSelectedMentor] = useState(null);
	const [bookingCourse, setBookingCourse] = useState(null);
	const [showPayment, setShowPayment] = useState(false);
	const [currentBooking, setCurrentBooking] = useState(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [userData, setUserData] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Tambahkan state untuk loading

	// Memulihkan status autentikasi saat aplikasi dimuat
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

					const adminPages = [
						"admin-dashboard",
						"manage-users",
						"manage-courses",
						"manage-mentors",
					];
					const mentorPages = [
						"mentor-dashboard",
						"manage-schedule",
						"manage-courses",
						"manage-students",
					];
					const protectedPages = [
						...adminPages,
						...mentorPages,
						"profile",
						"history",
						"settings",
					];

					if (!protectedPages.includes(currentPage) || currentPage === "home") {
						if (roleFromBackend === "admin") {
							setCurrentPage("admin-dashboard");
							window.location.hash = "admin-dashboard";
						} else if (roleFromBackend === "mentor") {
							setCurrentPage("mentor-dashboard");
							window.location.hash = "mentor-dashboard";
						}
					}
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
					setIsAuthenticated(false);
					setUserRole(null);
					setUserData(null);
					setCurrentPage("home");
					window.location.hash = "home";
				}
			} catch (error) {
				console.error("Error parsing stored user:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUserRole(null);
				setUserData(null);
				setCurrentPage("home");
				window.location.hash = "home";
			}
		} else {
			setIsAuthenticated(false);
			setUserRole(null);
			setUserData(null);
			setCurrentPage("home");
			window.location.hash = "home";
		}
		setIsLoading(false); // Selesai memuat
	}, []);

	// Navigasi berbasis hash
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) || "home";
			setCurrentPage(hash);
		};

		window.addEventListener("hashchange", handleHashChange);
		handleHashChange();

		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	const filteredCourses = courses.filter(
		(course) =>
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSchedule = (mentor, course = null) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}
		setSelectedMentor(mentor);
		setBookingCourse(course);
	};

	const handleBookingSubmit = (date, time, mode, course) => {
		if (!isAuthenticated) {
			setShowAuthModal(true);
			return;
		}

		if (selectedMentor) {
			const booking = {
				course,
				mentor: selectedMentor.name,
				date: date.toLocaleDateString(),
				time,
				mode,
				location: mode === "offline" ? selectedMentor.location : null,
			};
			setCurrentBooking(booking);
			setSelectedMentor(null);
			setBookingCourse(null);
			setShowPayment(true);
		}
	};

	const handlePaymentSubmit = ({ paymentMethod, proofImage }) => {
		setShowPayment(false);
		Swal.fire({
			icon: "success",
			title: "Payment Submitted!",
			text: "Your booking has been confirmed. We will verify your payment shortly.",
			confirmButtonColor: "#3B82F6",
		}).then(() => {
			setCurrentPage("history");
			window.location.hash = "history";
		});
	};

	const handleNavigate = (page) => {
		if (!isAuthenticated && ["profile", "history", "settings"].includes(page)) {
			setShowAuthModal(true);
			return;
		}

		if (page === "home") {
			setSelectedCourse(null);
		}
		setCurrentPage(page);
		window.location.hash = page;
	};

	const handleAuthSuccess = (role, user) => {
		setIsAuthenticated(true);
		setUserRole(role);
		setUserData(user);
		setShowAuthModal(false);

		if (role === "admin") {
			setCurrentPage("admin-dashboard");
			window.location.hash = "admin-dashboard";
		} else if (role === "mentor") {
			setCurrentPage("mentor-dashboard");
			window.location.hash = "mentor-dashboard";
		}
	};

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
				window.location.hash = "home";
			})
			.catch((error) => {
				console.error("Logout failed:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUserRole(null);
				setUserData(null);
				setCurrentPage("home");
				window.location.hash = "home";
			});
	};

	const handleCourseClick = (course) => {
		console.log("Course clicked:", course);
		setSelectedCourse(course);
	};

	const renderContent = () => {
		const adminPages = [
			"admin-dashboard",
			"manage-users",
			"manage-courses",
			"manage-mentors",
		];
		const mentorPages = [
			"mentor-dashboard",
			"manage-schedule",
			"manage-courses",
			"manage-students",
		];
		const protectedPages = [
			...adminPages,
			...mentorPages,
			"profile",
			"history",
			"settings",
		];

		// Jika masih loading, jangan render apa-apa
		if (isLoading) {
			return <div>Loading...</div>;
		}

		// Cek apakah pengguna mencoba mengakses halaman yang dilindungi
		if (!isAuthenticated && protectedPages.includes(currentPage)) {
			setCurrentPage("home");
			window.location.hash = "home";
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

		// Cek apakah admin mencoba mengakses halaman admin
		if (userRole === "admin" && adminPages.includes(currentPage)) {
			switch (currentPage) {
				case "admin-dashboard":
					return <AdminDashboard />;
				case "manage-users":
					return <AdminUsersPage />;
				case "manage-courses":
					return <AdminCoursesPage />;
				case "manage-mentors":
					return <AdminMentorsPage />;
				default:
					break;
			}
		}

		// Cek apakah mentor mencoba mengakses halaman mentor
		if (userRole === "mentor" && mentorPages.includes(currentPage)) {
			switch (currentPage) {
				case "mentor-dashboard":
					return <MentorDashboard />;
				case "manage-schedule":
					return <MentorSchedulePage />;
				case "manage-courses":
					return <MentorCoursesPage />;
				case "manage-students":
					return <MentorStudentsPage />;
				default:
					break;
			}
		}

		// Cek apakah halaman yang diakses tidak sesuai dengan role
		if (
			(userRole === "admin" && mentorPages.includes(currentPage)) ||
			(userRole === "mentor" && adminPages.includes(currentPage))
		) {
			setCurrentPage(
				userRole === "admin" ? "admin-dashboard" : "mentor-dashboard"
			);
			window.location.hash =
				userRole === "admin" ? "admin-dashboard" : "mentor-dashboard";
			return userRole === "admin" ? <AdminDashboard /> : <MentorDashboard />;
		}

		const content = (() => {
			switch (currentPage) {
				case "profile":
					return isAuthenticated ? (
						<ProfilePage userRole={userRole} userData={userData} />
					) : null;
				case "history":
					return isAuthenticated ? <HistoryPage /> : null;
				case "mentors":
					return <MentorsPage onSchedule={handleSchedule} />;
				case "courses":
					return selectedCourse ? (
						<div className="py-4">
							<button
								type="button"
								onClick={() => setSelectedCourse(null)}
								className="px-4 py-2 mb-4 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg">
								<ArrowLeft className="w-4 h-4" />
								Back to Courses
							</button>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								{selectedCourse.title} - Available Mentors
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors.map((mentor) => (
									<MentorCard
										key={mentor.id}
										mentor={mentor}
										onSchedule={(mentor) =>
											handleSchedule(mentor, selectedCourse)
										}
										selectedCourse={selectedCourse}
									/>
								))}
							</div>
						</div>
					) : (
						<CoursesPage courses={courses} onCourseClick={setSelectedCourse} />
					);
				case "about":
					return <AboutPage />;
				case "home":
					return selectedCourse ? (
						<div className="py-4">
							<button
								type="button"
								onClick={() => setSelectedCourse(null)}
								className="px-4 py-2 mb-4 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg">
								<ArrowLeft className="w-4 h-4" />
								Back to Home
							</button>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								{selectedCourse.title} - Available Mentors
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors.map((mentor) => (
									<MentorCard
										key={mentor.id}
										mentor={mentor}
										onSchedule={(mentor) =>
											handleSchedule(mentor, selectedCourse)
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
						/>
					);
				default:
					return selectedCourse ? (
						<div className="py-4">
							<button
								type="button"
								onClick={() => setSelectedCourse(null)}
								className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
								<ArrowLeft className="w-4 h-4" />
								Back to Courses
							</button>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								{selectedCourse.title} - Available Mentors
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
								{selectedCourse.mentors.map((mentor) => (
									<MentorCard
										key={mentor.id}
										mentor={mentor}
										onSchedule={(mentor) =>
											handleSchedule(mentor, selectedCourse)
										}
										selectedCourse={selectedCourse}
									/>
								))}
							</div>
						</div>
					) : null;
			}
		})();

		return <div className="page-transition">{content}</div>;
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navigation
				currentPage={currentPage}
				onNavigate={handleNavigate}
				isAuthenticated={isAuthenticated}
				userRole={userRole}
				onAuthClick={() => setShowAuthModal(true)}
				onLogout={handleLogout}
				userData={userData}
			/>

			<main className="flex-grow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{renderContent()}
				</div>

				{selectedMentor && (
					<BookingModal
						mentor={selectedMentor}
						selectedCourse={bookingCourse}
						onClose={() => {
							setSelectedMentor(null);
							setBookingCourse(null);
						}}
						onSubmit={handleBookingSubmit}
					/>
				)}

				{showPayment && currentBooking && (
					<PaymentModal
						booking={currentBooking}
						onClose={() => {
							setShowPayment(false);
							setCurrentBooking(null);
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
