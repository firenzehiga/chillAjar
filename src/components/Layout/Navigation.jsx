import { useState, useEffect } from "react";
import titleLogo from "@/assets/title2.png";
import {
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
	Users2,
	DollarSign,
	Package,
	Gift,
	Settings,
} from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import useAppStore from "@/stores/useAppStore";
import { adminPages, mentorPages, getPageTitle } from "@/constants/pages";

export function Navigation({ onNavigate, onLogout }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isManagementDropdownOpen, setIsManagementDropdownOpen] =
		useState(false);

	// Get state from Zustand store
	const { currentPage, isAuthenticated, userRole, userData, setShowAuthModal } =
		useAppStore();

	// Close dropdown when clicking outside
	useEffect(() => {
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

	// derive role default redirect from pages lists so we don't hardcode routes twice
	const getRoleRedirect = (role) => {
		if (role === "admin") return adminPages?.[0] || "admin-dashboard";
		if (role === "mentor") return mentorPages?.[0] || "mentor-dashboard";
		return "home";
	};
	const roleCheck = {
		admin: { redirect: getRoleRedirect("admin") },
		mentor: { redirect: getRoleRedirect("mentor") },
		user: { redirect: getRoleRedirect("user") },
	};

	const [hoveredItem, setHoveredItem] = useState(null);

	const NavLink = ({ to, Icon, label, activeWhen, onClickExtra }) => {
		const isActive = activeWhen ? activeWhen(currentPage) : currentPage === to;

		return (
			<a
				href={`/${to}`}
				onClick={(e) => {
					e.preventDefault();
					if (onClickExtra) onClickExtra();
					onNavigate(to);
				}}
				onMouseEnter={() => setHoveredItem(to)}
				onMouseLeave={() => setHoveredItem(null)}
				className={`focus:outline-none inline-flex items-center relative px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ease-out overflow-hidden ${
					isActive
						? "bg-blue-500 text-white shadow-lg shadow-blue-600/25 scale-105"
						: "text-white hover:text-white hover:bg-blue-500"
				}`}>
				{Icon && (
					<Icon
						className={`w-5 h-5 mr-1 transition-transform duration-300 ${
							isActive
								? "text-white scale-110"
								: hoveredItem === to
								? "text-white scale-110"
								: "text-white"
						}`}
					/>
				)}
				{label}
			</a>
		);
	};

	const renderNavLinks = () => {
		if (userRole === "admin") {
			return (
				<>
					<NavLink to="admin-dashboard" Icon={Home} label="Dashboard" />
					<NavLink to="admin-manage-users" Icon={Users} label="Users" />
					<NavLink
						to="admin-manage-payments"
						Icon={CircleDollarSign}
						label="Payments"
					/>

					<NavLink to="admin-manage-sessions" Icon={Clock} label="Sessions" />
					<NavLink
						to="admin-manage-mentors"
						Icon={LucideUserSquare2}
						label="Mentors"
					/>

					{/* Management Dropdown */}
					<div className="relative">
						<button
							onClick={() =>
								setIsManagementDropdownOpen(!isManagementDropdownOpen)
							}
							className={`focus:outline-none inline-flex items-center relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out overflow-hidden ${
								currentPage === "admin-manage-items" ||
								currentPage === "admin-manage-packages" ||
								currentPage === "admin-manage-courses"
									? "bg-blue-500 text-white"
									: "text-white hover:bg-blue-500"
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
									className={`block px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer first:rounded-t-lg ${
										currentPage === "admin-manage-courses"
											? "bg-blue-100 text-blue-800"
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
									className={`block px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
										currentPage === "admin-manage-items"
											? "bg-blue-100 text-blue-800"
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
									className={`block px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer last:rounded-b-lg ${
										currentPage === "admin-manage-packages"
											? "bg-blue-100 text-blue-800"
											: "text-gray-700"
									}`}>
									<Gift className="w-4 h-4 inline-block mr-2" />
									Paket
								</a>
							</div>
						)}
					</div>

					<NavLink
						to="admin-testimonial"
						Icon={UserCheck}
						label="Testimonials"
					/>
				</>
			);
		} else if (userRole === "mentor") {
			return (
				<>
					<NavLink to="mentor-dashboard" Icon={Home} label="Dashboard" />
					<NavLink
						to="mentor-manage-schedule"
						Icon={Calendar}
						label="Schedule"
					/>
					<NavLink
						to="mentor-manage-courses"
						Icon={BookOpen}
						label="My Courses"
					/>
					<NavLink to="mentor-testimonial" Icon={Users} label="Testimonies" />
				</>
			);
		}

		return (
			<>
				<NavLink to="home" Icon={Home} label="Beranda" />
				<NavLink to="courses" Icon={BookOpen} label="Kursus" />
				<NavLink to="mentors" Icon={Users} label="Mentor" />
				<NavLink to="about" Icon={Info} label="Tentang Kami" />
			</>
		);
	};

	const MobileNavLink = ({ to, Icon, label, activeWhen, onClickExtra }) => {
		const isActive = activeWhen ? activeWhen(currentPage) : currentPage === to;

		return (
			<button
				type="button"
				onMouseEnter={() => setHoveredItem(to)}
				onMouseLeave={() => setHoveredItem(null)}
				onClick={() => {
					if (onClickExtra) onClickExtra();
					onNavigate(to);
					setIsMobileMenuOpen(false);
				}}
				className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${
					isActive
						? "bg-blue-500 text-white shadow-lg shadow-blue-600/25"
						: "text-white hover:bg-blue-500"
				}`}>
				{Icon && (
					<Icon
						className={`w-5 h-5 mr-3 transition-transform duration-300 ${
							isActive ? "scale-110" : hoveredItem === to ? "scale-110" : ""
						}`}
					/>
				)}
				{label}
				<ChevronRight className="w-5 h-5 ml-auto" />
			</button>
		);
	};

	const renderMobileNavLinks = () => {
		if (userRole === "admin") {
			return (
				<>
					<MobileNavLink to="admin-dashboard" Icon={Home} label="Dashboard" />
					<MobileNavLink to="admin-manage-users" Icon={Users} label="Users" />
					<MobileNavLink
						to="admin-manage-payments"
						Icon={DollarSign}
						label="Payments"
					/>
					<MobileNavLink
						to="admin-manage-sessions"
						Icon={Users}
						label="Sessions"
					/>
					<MobileNavLink
						to="admin-manage-mentors"
						Icon={Users}
						label="Mentors"
					/>
					<MobileNavLink
						to="admin-manage-courses"
						Icon={BookOpen}
						label="Kursus"
					/>
					<MobileNavLink to="admin-manage-items" Icon={Package} label="Item" />
					<MobileNavLink to="admin-manage-packages" Icon={Gift} label="Paket" />
					<MobileNavLink
						to="admin-testimonial"
						Icon={Users2}
						label="Testimonials"
					/>
				</>
			);
		} else if (userRole === "mentor") {
			return (
				<>
					<MobileNavLink to="mentor-dashboard" Icon={Home} label="Dashboard" />
					<MobileNavLink
						to="mentor-manage-schedule"
						Icon={Calendar}
						label="Schedule"
					/>
					<MobileNavLink
						to="mentor-manage-courses"
						Icon={BookOpen}
						label="My Courses"
					/>
					<MobileNavLink
						to="mentor-testimonial"
						Icon={Users}
						label="Testimonies"
					/>
				</>
			);
		}

		return (
			<>
				<MobileNavLink to="home" Icon={Home} label="Beranda" />
				<MobileNavLink to="courses" Icon={BookOpen} label="Kursus" />
				<MobileNavLink to="mentors" Icon={Users} label="Mentor" />
				<MobileNavLink to="about" Icon={Info} label="Tentang Kami" />
			</>
		);
	};

	return (
		<header
			className={`bg-chill-blue ${
				currentPage !== "home" ? "shadow-sm" : ""
			} sticky top-0 z-50`}>
			<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div
							className="flex items-center cursor-pointer"
							onClick={() => onNavigate(roleCheck[userRole].redirect)}>
							<img
								src={titleLogo}
								alt="Logo ChillAjar"
								className="h-14 w-auto -top-1 relative"
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
								className="w-full flex items-center px-3 py-2 text-base font-medium text-white bg-chill-blue hover:bg-blue-600 transition-colors rounded-md">
								<LogIn className="w-5 h-5 mr-3" />
								Sign In
								<ChevronRight className="w-5 h-5 ml-auto" />
							</button>
						)}
					</nav>
				)}
			</div>

			{/* Breadcrumb - Only show on non-home pages (updated style) */}
			{currentPage !== "home" && (
				<div className="bg-gray-50 border-t border-gray-200">
					<div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
						<nav className="flex" aria-label="Breadcrumb">
							<ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
								<li className="inline-flex items-center">
									<a
										href=""
										onClick={(e) => {
											e.preventDefault();
											onNavigate(roleCheck[userRole]?.redirect || "home");
										}}
										className="focus:outline-none inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 ">
										<svg
											className="w-3 h-3 me-2.5"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
										</svg>
										{userRole === "pelanggan" ? "Beranda" : "Dashboard"}
									</a>
								</li>

								<li aria-current="page">
									<div className="flex items-center">
										<svg
											className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 6 10">
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="m1 9 4-4-4-4"
											/>
										</svg>
										<span className="ms-1 text-sm font-medium text-gray-500 md:ms-2">
											{getPageTitle(currentPage)}
										</span>
									</div>
								</li>
							</ol>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}

export default Navigation;
