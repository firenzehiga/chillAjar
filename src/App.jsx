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
// Halaman mentor
import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "./pages/mentor/MentorSchedulePage";
import { MentorCoursesPage } from "./pages/mentor/MentorCoursesPage";
import { MentorStudentsPage } from "./pages/mentor/MentorStudentsPage";
import coursesData from "./utils/constants/CourseData";
import Swal from "sweetalert2";

// Sample data
const courses = coursesData;

function App() {
	const [currentPage, setCurrentPage] = useState("home");
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMentor, setSelectedMentor] = useState(null);
	const [bookingCourse, setBookingCourse] = useState(null);
	const [showPayment, setShowPayment] = useState(false);
	const [currentBooking, setCurrentBooking] = useState(null);
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);

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
			setCurrentBooking(null);
			window.location.hash = "history";
		});
	};

	const handleNavigate = (page) => {
		if (!isAuthenticated && ["profile", "history"].includes(page)) {
			//
			setShowAuthModal(true);
			return;
		}

		if (page === "home") {
			setSelectedCourse(null);
		}
		setCurrentPage(page);
		window.location.hash = page;
	};

	const handleAuthSuccess = (role) => {
		setIsAuthenticated(true);
		setUserRole(role);
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
		setIsAuthenticated(false);
		setUserRole(null);
		setCurrentPage("home");
		window.location.hash = "home";
	};

	const handleCourseClick = (course) => {
		console.log("Course clicked:", course);
		setSelectedCourse(course);
	};

	const renderContent = () => {
		const protectedPages = [
			"admin-dashboard",
			"manage-users",
			"manage-courses",
			"manage-mentors",
			"mentor-dashboard",
			"manage-schedule",
			"manage-students",
			"profile",
			"history",
			"settings",
		];

		// Jika belum login dan mencoba mengakses halaman terproteksi, langsung render Home
		if (!isAuthenticated && protectedPages.includes(currentPage)) {
			// Ubah currentPage dan hash untuk konsistensi
			setCurrentPage("home");
			window.location.hash = "home";
			setShowAuthModal(true); // Tampilkan modal login kalau belum login atau nyoba akses halaman terproteksi
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

		// Role-specific dashboards
		if (userRole === "admin" && currentPage === "admin-dashboard") {
			return <AdminDashboard />;
		}
		if (userRole === "mentor" && currentPage === "mentor-dashboard") {
			return <MentorDashboard />;
		}

		// Mengatur Halaman khusus admin
		if (userRole === "admin") {
			switch (currentPage) {
				case "manage-users":
					return <AdminUsersPage />;
				case "manage-courses":
					return <AdminCoursesPage />;
				default:
					break;
			}
		}

		// Mengatur Halaman khusus mentor
		if (userRole === "mentor") {
			switch (currentPage) {
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

		// Regular content
		const content = (() => {
			switch (currentPage) {
				case "profile":
					return isAuthenticated ? <ProfilePage userRole={userRole} /> : null;
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

		return <div className="page-transition ">{content}</div>;
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
