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

// Halaman admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminCoursesPage } from "./pages/admin/AdminCoursesPage";
// Halaman mentor
import { MentorDashboard } from "./pages/mentor/MentorDashboard";
import { MentorSchedulePage } from "./pages/mentor/MentorSchedulePage";
import { MentorCoursesPage } from "./pages/mentor/MentorCoursesPage";
import { MentorStudentsPage } from "./pages/mentor/MentorStudentsPage";

import Swal from "sweetalert2";

// Sample data
const courses = [
	{
		id: "1",
		title: "Statistika Probabilitas",
		description:
			"Master complex mathematical concepts with expert peer tutors.",
		image:
			"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
		category: "Mathematics",
		price_per_hour: 50,
		mentors: [
			{
				id: "m1",
				name: "Alex Thompson",
				avatar:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
				rating: 4.8,
				expertise: ["Calculus", "Linear Algebra"],
				availability: { online: true, offline: true },
				phone: "+1234567890",
				location: "Central Library, Building A",
			},
		],
	},

	{
		id: "2",
		title: "Dasar Dasar Pemrograman",
		description:
			"Learn essential programming concepts and algorithms with python.",
		image:
			"https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
		category: "Computer Science",
		price_per_hour: 25,
		mentors: [
			{
				id: "m2",
				name: "Eko Muchamad Haryono",
				avatar:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
				rating: 4.9,
				expertise: ["Algorithms", "Python"],
				availability: { online: true, offline: false },
				phone: "+1234567891",
			},
		],
	},
	{
		id: "3",
		title: "Pemrograman Web",
		description:
			"Learn essential programming concepts and algorithms with python.",
		image: "../public/webpro.jpg",
		category: "Software Engineering",
		price_per_hour: 25,
		mentors: [
			{
				id: "m2",
				name: "Eko Muchamad Haryono",
				avatar: "../public/eko.JPG",
				rating: 4.9,
				expertise: ["Algorithms", "Python"],
				availability: { online: true, offline: false },
				phone: "+1234567891",
			},
		],
	},
];

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
			course.category.toLowerCase().includes(searchQuery.toLowerCase()),
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
			setShowAuthModal(true);
			return;
		}

		if (page === "home") {
			setSelectedCourse(null); // Reset selectedCourse saat ke halaman home
		}
		setCurrentPage(page);
		window.location.hash = page;
	};

	const handleAuthSuccess = (role) => {
		setIsAuthenticated(true);
		setUserRole(role);
		setShowAuthModal(false);

		// Redirect based on role
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
					return selectedCourse ? ( // Kalo course di klik akan menampilkan mentor tersedia
						<div className="py-4">
							<button
								type="button"
								onClick={() => setSelectedCourse(null)}
								className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
							>
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
						//sebaliknya kalo course belum di klik akan tampilkan semua course
					) : (
						<CoursesPage courses={courses} onCourseClick={setSelectedCourse} />
					);

				case "about":
					return <AboutPage />;
				default:
					return selectedCourse ? ( // Kalo course di klik akan menampilkan mentor tersedia
						<div className="py-4">
							<button
								type="button"
								onClick={() => setSelectedCourse(null)}
								className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
							>
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
						</div> //sebaliknya kalo course belum di klik
					) : (
						<div className="space-y-8">
							<CourseCarousel
								courses={courses}
								onCourseClick={handleCourseClick}
							/>
							<div>
								<h2 className="text-2xl font-bold text-gray-900 mb-6">
									All Courses
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
									{filteredCourses.map((course) => (
										<CourseCard
											key={course.id}
											course={course}
											onClick={handleCourseClick}
										/>
									))}
								</div>
							</div>
						</div>
					);
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
			/>

			<main className="flex-grow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{currentPage === "home" &&
						userRole !== "admin" &&
						userRole !== "mentor" && (
							<div className="relative py-4">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
								<input
									type="text"
									placeholder="Search courses..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
								/>
							</div>
						)}

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
