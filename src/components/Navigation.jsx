import React, { useState } from "react";
import titleLogo from "../assets/title2.png";
import {
	GraduationCap,
	Users,
	BookOpen,
	Menu,
	Home,
	X,
	ChevronRight,
	Info,
	LogIn,
	Clock,
	Calendar,
	UserCheck,
	LucideUserSquare2,
	CircleDollarSign,
	UserSquare2,
	Building,
	Users2,
	DollarSign,
} from "lucide-react";
import { UserMenu } from "./UserMenu";

export function Navigation({
	currentPage,
	onNavigate,
	isAuthenticated,
	userRole,
	onAuthClick,
	onLogout,
	userData,
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const getPageTitle = (page) => {
		switch (page) {
			case "courses":
				return "Courses";
			case "mentors":
				return "Mentors";
			case "profile":
				return "Profile";
			case "transaction-history":
				return "Riwayat Transaksi";
			case "session-history":
				return "Riwayat Sesi";
			case "settings":
				return "Settings";
			case "about":
				return "About Us";
			// Halaman Admin
			case "admin-dashboard":
				return "Admin Dashboard";
			case "admin-profile":
				return "Admin Profile";
			case "admin-edit-profile":
				return "Admin Edit Profile";
			case "admin-manage-users":
				return "Users";
			case "admin-manage-payments":
				return "Payments";
			case "admin-manage-sessions":
				return "Sessions";
			case "admin-edit-session":
				return "Edit Session";
			case "admin-manage-courses":
				return "Courses";
			case "admin-add-course":
				return "Add Course";
			case "admin-edit-course":
				return "Edit Course";
			case "admin-manage-mentors":
				return "Mentors";
			case "admin-testimonial":
				return "Mentor Testimonials";
			case "admin-edit-testimonial":
				return "Edit Mentor Testimonials";

			// Halaman Mentor
			case "mentor-dashboard":
				return "Mentor Dashboard";
			case "mentor-profile":
				return "Mentor Profile";
			case "mentor-edit-profile":
				return "Mentor Edit Profile";
			case "mentor-manage-schedule":
				return "Schedule";
			case "mentor-manage-courses":
				return "My Courses";
			case "mentor-testimonial":
				return "Testimonies";
			case "mentor-add-course":
				return "Add Course";
			case "mentor-edit-course":
				return "Edit Course";
			default:
				return "Home";
		}
	};

	const roleCheck = {
		admin: {
			redirect: "admin-dashboard",
		},
		mentor: {
			redirect: "mentor-dashboard",
		},
		user: {
			redirect: "home",
		},
	};
	const renderNavLinks = () => {
		if (userRole === "admin") {
			return (
				<>
					<a
						onClick={() => onNavigate("admin-dashboard")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-dashboard"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Home className="w-4 h-4 inline-block mr-1" />
						Dashboard
					</a>
					<a
						onClick={() => onNavigate("admin-manage-users")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-users"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Users className="w-4 h-4 inline-block mr-1" />
						Users
					</a>
					<a
						onClick={() => onNavigate("admin-manage-payments")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-payments"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<CircleDollarSign className="w-4 h-4 inline-block mr-1" />
						Payments
					</a>
					<a
						onClick={() => onNavigate("admin-manage-sessions")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-sessions"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Clock className="w-4 h-4 inline-block mr-1" />
						Sessions
					</a>
					<a
						onClick={() => onNavigate("admin-manage-courses")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-courses"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<BookOpen className="w-4 h-4 inline-block mr-1" />
						Courses
					</a>
					<a
						onClick={() => onNavigate("admin-manage-mentors")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-mentors"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<LucideUserSquare2 className="w-4 h-4 inline-block mr-1" />
						Mentors
					</a>
					<a
						onClick={() => onNavigate("admin-testimonial")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-testimonial"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<UserCheck className="w-4 h-4 inline-block mr-1" />
						Testimonials
					</a>
				</>
			);
		} else if (userRole === "mentor") {
			return (
				<>
					<a
						onClick={() => onNavigate("mentor-dashboard")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "mentor-dashboard"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Home className="w-4 h-4 inline-block mr-1" />
						Dashboard
					</a>
					<a
						onClick={() => onNavigate("mentor-manage-schedule")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "mentor-manage-schedule"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Calendar className="w-4 h-4 inline-block mr-1" />
						Schedule
					</a>
					<a
						onClick={() => onNavigate("mentor-manage-courses")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "mentor-manage-courses" ||
							currentPage === "mentor-add-course" ||
							currentPage.startsWith("mentor-edit-course")
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<BookOpen className="w-4 h-4 inline-block mr-1" />
						My Courses
					</a>
					<a
						onClick={() => onNavigate("mentor-testimonial")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "mentor-testimonial"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<Users className="w-4 h-4 inline-block mr-1" />
						Testimonies
					</a>
				</>
			);
		}

		return (
			<>
				<a
					onClick={() => onNavigate("home")}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
						currentPage === "home"
							? "bg-yellow-500 text-gray-900"
							: "text-gray-900 hover:bg-yellow-500"
					}`}>
					<Home className="w-4 h-4 inline-block mr-1" />
					Home
				</a>
				<a
					onClick={() => onNavigate("courses")}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
						currentPage === "courses"
							? "bg-yellow-500 text-gray-900"
							: "text-gray-900 hover:bg-yellow-500"
					}`}>
					<BookOpen className="w-4 h-4 inline-block mr-1" />
					Courses
				</a>
				<a
					onClick={() => onNavigate("mentors")}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
						currentPage === "mentors"
							? "bg-yellow-500 text-gray-900"
							: "text-gray-900 hover:bg-yellow-500"
					}`}>
					<Users className="w-4 h-4 inline-block mr-1" />
					Mentors
				</a>
				<a
					onClick={() => onNavigate("about")}
					className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
						currentPage === "about"
							? "bg-yellow-500 text-gray-900"
							: "text-gray-900 hover:bg-yellow-500"
					}`}>
					<Info className="w-4 h-4 inline-block mr-1" />
					About Us
				</a>
			</>
		);
	};

	const renderMobileNavLinks = () => {
		if (userRole === "admin") {
			return (
				<>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-dashboard");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Home className="w-5 h-5 mr-3" />
						Dashboard
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-users");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Users className="w-5 h-5 mr-3" />
						Users
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-payments");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<DollarSign className="w-5 h-5 mr-3" />
						Payments
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-sessions");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Users className="w-5 h-5 mr-3" />
						Sessions
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-courses");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<BookOpen className="w-5 h-5 mr-3" />
						Courses
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-mentors");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<UserCheck className="w-5 h-5 mr-3" />
						Mentors
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-testimonial");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Users2 className="w-5 h-5 mr-3" />
						Testimonials
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
				</>
			);
		} else if (userRole === "mentor") {
			return (
				<>
					<button
						type="button"
						onClick={() => {
							onNavigate("mentor-dashboard");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Calendar className="w-5 h-5 mr-3" />
						Dashboard
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("mentor-manage-schedule");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Calendar className="w-5 h-5 mr-3" />
						Schedule
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("mentor-manage-courses");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<BookOpen className="w-5 h-5 mr-3" />
						My Courses
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("mentor-testimonial");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Users className="w-5 h-5 mr-3" />
						Testimonials
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
				</>
			);
		}

		return (
			<>
				<button
					type="button"
					onClick={() => {
						onNavigate("home");
						setIsMobileMenuOpen(false);
					}}
					className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
					<Home className="w-5 h-5 mr-3" />
					Home
					<ChevronRight className="w-5 h-5 ml-auto" />
				</button>
				<button
					type="button"
					onClick={() => {
						onNavigate("courses");
						setIsMobileMenuOpen(false);
					}}
					className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
					<BookOpen className="w-5 h-5 mr-3" />
					Courses
					<ChevronRight className="w-5 h-5 ml-auto" />
				</button>
				<button
					type="button"
					onClick={() => {
						onNavigate("mentors");
						setIsMobileMenuOpen(false);
					}}
					className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
					<Users className="w-5 h-5 mr-3" />
					Mentors
					<ChevronRight className="w-5 h-5 ml-auto" />
				</button>
				<button
					type="button"
					onClick={() => {
						onNavigate("about");
						setIsMobileMenuOpen(false);
					}}
					className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
					<Info className="w-5 h-5 mr-3" />
					About Us
					<ChevronRight className="w-5 h-5 ml-auto" />
				</button>
			</>
		);
	};

	return (
		<header className="bg-chill-yellow shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div
							className="flex items-center cursor-pointer"
							onClick={() => onNavigate(roleCheck[userRole].redirect)}>
							<img
								src={titleLogo}
								alt="Logo ChillAjar"
								className="h-10 w-auto relative -top-2"
							/>
						</div>

						<nav className="hidden md:flex ml-8 space-x-4">
							{renderNavLinks()}
						</nav>
					</div>

					<div className="flex items-center">
						{isAuthenticated ? (
							<UserMenu
								onNavigate={onNavigate}
								onLogout={onLogout}
								userRole={userRole}
								userData={userData}
							/>
						) : (
							<button
								type="button"
								onClick={onAuthClick}
								className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-colors">
								<LogIn className="w-4 h-4 mr-2" />
								Sign In
							</button>
						)}
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="ml-4 md:hidden">
							{isMobileMenuOpen ? (
								<X className="h-6 w-6 text-gray-600" />
							) : (
								<Menu className="h-6 w-6 text-gray-600" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<nav className="md:hidden mt-4 pb-3 border-t border-gray-200">
						<div className="pt-3 space-y-1">{renderMobileNavLinks()}</div>
						{!isAuthenticated && (
							<button
								type="button"
								onClick={() => {
									onAuthClick();
									setIsMobileMenuOpen(false);
								}}
								className="w-full flex items-center px-3 py-2 text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors rounded-md">
								<LogIn className="w-5 h-5 mr-3" />
								Sign In
								<ChevronRight className="w-5 h-5 ml-auto" />
							</button>
						)}
					</nav>
				)}
			</div>

			{/* Breadcrumb - Only show on non-home pages */}
			{currentPage !== "home" && (
				<div className="bg-gray-50 border-t border-gray-200">
					<div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
						<div className="flex items-center space-x-2 text-sm text-gray-600">
							<button
								type="button"
								onClick={() => onNavigate("home")}
								className="hover:text-yellow-600">
								{userRole !== "admin" && "mentor" ? "Home" : "Dashboard"}
							</button>
							<ChevronRight className="w-4 h-4" />
							<span className="font-medium   text-gray-900">
								{getPageTitle(currentPage)}
							</span>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}

export default Navigation;
