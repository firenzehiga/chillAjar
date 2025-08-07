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
	ChevronDown,
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
	Package,
	Gift,
	Settings,
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import useAppStore from "../stores/useAppStore";

export function Navigation({ onNavigate, onLogout }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
		useState(false);

	// Get state from Zustand store
	const { currentPage, isAuthenticated, userRole, userData, setShowAuthModal } =
		useAppStore();

	// Close dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (isManagementDropdownOpen && !event.target.closest(".relative")) {
				setIsManagementDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isManagementDropdownOpen]);

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
			case "admin-manage-items":
				return "Items";
			case "admin-add-item":
				return "Tambah Item";
			case "admin-edit-item":
				return "Edit Item";
			case "admin-manage-packages":
				return "Paket";
			case "admin-add-package":
				return "Tambah Paket";
			case "admin-edit-package":
				return "Edit Paket";
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
						onClick={() => onNavigate("admin-manage-mentors")}
						className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
							currentPage === "admin-manage-mentors"
								? "bg-yellow-500 text-gray-900"
								: "text-gray-900 hover:bg-yellow-500"
						}`}>
						<LucideUserSquare2 className="w-4 h-4 inline-block mr-1" />
						Mentors
					</a>

					{/* Management Dropdown */}
					<div className="relative">
						<button
							onClick={() =>
								setIsManagementDropdownOpen(!isManagementDropdownOpen)
							}
							className={`outline-none focus:outline-none px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center ${
								currentPage === "admin-manage-items" ||
								currentPage === "admin-manage-packages" ||
								currentPage === "admin-manage-courses"
									? "bg-yellow-500 text-gray-900"
									: "text-gray-900 hover:bg-yellow-500"
							}`}>
							<Settings className="w-4 h-4 inline-block mr-1" />
							Management
							{isManagementDropdownOpen ? (
								<ChevronDown className="w-4 h-4 ml-1" />
							) : (
								<ChevronRight className="w-4 h-4 ml-1" />
							)}
						</button>

						{isManagementDropdownOpen && (
							<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
								<a
									onClick={() => {
										onNavigate("admin-manage-courses");
										setIsManagementDropdownOpen(false);
									}}
									className={`block px-4 py-2 text-sm hover:bg-yellow-50 cursor-pointer first:rounded-t-lg ${
										currentPage === "admin-manage-courses"
											? "bg-yellow-100 text-yellow-800"
											: "text-gray-700"
									}`}>
									<BookOpen className="w-4 h-4 inline-block mr-2" />
									Kursus
								</a>
								<a
									onClick={() => {
										onNavigate("admin-manage-items");
										setIsManagementDropdownOpen(false);
									}}
									className={`block px-4 py-2 text-sm hover:bg-yellow-50 cursor-pointer ${
										currentPage === "admin-manage-items"
											? "bg-yellow-100 text-yellow-800"
											: "text-gray-700"
									}`}>
									<Package className="w-4 h-4 inline-block mr-2" />
									Items
								</a>
								<a
									onClick={() => {
										onNavigate("admin-manage-packages");
										setIsManagementDropdownOpen(false);
									}}
									className={`block px-4 py-2 text-sm hover:bg-yellow-50 cursor-pointer last:rounded-b-lg ${
										currentPage === "admin-manage-packages"
											? "bg-yellow-100 text-yellow-800"
											: "text-gray-700"
									}`}>
									<Gift className="w-4 h-4 inline-block mr-2" />
									Paket
								</a>
							</div>
						)}
					</div>

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
					<button
						onClick={() => onNavigate("mentor-dashboard")}
						className={`focus:outline-none outline-none group relative px-3 py-2 
							rounded-xl text-sm font-semibold flex items-center transition-all duration-200
      					${
									currentPage === "mentor-dashboard"
										? "bg-yellow-500 text-gray-900 shadow"
										: "bg-transparent text-gray-900 hover:bg-yellow-500"
								}`}>
						<Home
							className={`w-5 h-5 mr-2 transition-transform duration-200 text-gray-900
      	 					 ${currentPage !== "mentor-dashboard" ? "group-hover:scale-110" : ""}`}
						/>
						Dashboard{" "}
					</button>
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
				<button
					onClick={() => onNavigate("home")}
					className={`focus:outline-none outline-none group relative px-3 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-200
      					${
									currentPage === "home"
										? "bg-yellow-500 text-gray-900 shadow"
										: "bg-transparent text-gray-900 hover:bg-yellow-500"
								}`}>
					<Home
						className={`w-5 h-5 mr-2 transition-transform duration-200 text-gray-900
      	  ${currentPage !== "home" ? "group-hover:scale-110" : ""}`}
					/>
					Beranda
				</button>
				<button
					onClick={() => onNavigate("courses")}
					className={`focus:outline-none outline-none group relative px-3 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-200
      			${
							currentPage === "courses"
								? "bg-yellow-500 text-gray-900 shadow"
								: "bg-transparent text-gray-900 hover:bg-yellow-500"
						}`}>
					<BookOpen
						className={`w-5 h-5 mr-2 transition-transform duration-200 text-gray-900
        	${currentPage !== "courses" ? "group-hover:scale-110" : ""}`}
					/>
					Kursus
				</button>
				<button
					onClick={() => onNavigate("mentors")}
					className={`focus:outline-none outline-none group relative px-3 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-200
     		${
					currentPage === "mentors"
						? "bg-yellow-500 text-gray-900 shadow"
						: "bg-transparent text-gray-900 hover:bg-yellow-500"
				}`}>
					<Users
						className={`w-5 h-5 mr-2 transition-transform duration-200 text-gray-900
        ${currentPage !== "mentors" ? "group-hover:scale-110" : ""}
      `}
					/>
					Mentor
				</button>
				<button
					onClick={() => onNavigate("about")}
					className={`focus:outline-none outline-none group relative px-3 py-2 rounded-xl text-sm font-semibold flex items-center transition-all duration-200
      ${
				currentPage === "about"
					? "bg-yellow-500 text-gray-900 shadow"
					: "bg-transparent text-gray-900 hover:bg-yellow-500"
			}
    `}>
					<Info
						className={`w-5 h-5 mr-2 transition-transform duration-200 text-gray-900
        ${currentPage !== "about" ? "group-hover:scale-110" : ""}
      `}
					/>
					Tentang Kami
				</button>
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
							onNavigate("admin-manage-items");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Package className="w-5 h-5 mr-3" />
						Items
						<ChevronRight className="w-5 h-5 ml-auto" />
					</button>
					<button
						type="button"
						onClick={() => {
							onNavigate("admin-manage-packages");
							setIsMobileMenuOpen(false);
						}}
						className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:bg-yellow-500 rounded-md">
						<Gift className="w-5 h-5 mr-3" />
						Paket
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
								onClick={() => {
									onNavigate("home");
									setIsMobileMenuOpen(false);
								}}
							/>
						</div>

						<nav className="hidden md:flex ml-8 space-x-4">
							{renderNavLinks()}
						</nav>
					</div>

					{/* Right Side */}
					<div className="flex items-center space-x-4">
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
									onClick={() => setShowAuthModal(true)}
									className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all duration-200">
									<LogIn className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
									Masuk
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
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<nav className="md:hidden mt-4 pb-3 border-t border-gray-200">
						<div className="pt-3 space-y-1">{renderMobileNavLinks()}</div>
						{!isAuthenticated && (
							<button
								type="button"
								onClick={() => {
									setShowAuthModal(true);
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
