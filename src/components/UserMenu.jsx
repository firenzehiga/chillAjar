import { useState, useRef, useEffect } from "react";
import { LogOut, User, Clock, History, BookCopy } from "lucide-react";
import { getImageUrl } from "@/utils/getImageUrl";
import { SessionsWidget } from "@/components/SessionWidget";
import useAppStore from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu({ onNavigate, onLogout, userRole }) {
	const { isAuthenticated, userData } = useAppStore();

	const [isOpen, setIsOpen] = useState(false);
	const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);
	const [showMobileSessionsDropdown, setShowMobileSessionsDropdown] =
		useState(false);

	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
				setShowSessionsDropdown(false);
				setShowMobileSessionsDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, []);

	const handleNavigate = (page) => {
		onNavigate(page);
		setIsOpen(false);
	};

	const defaultFoto = "/foto_mentor/default.png";

	// Definisikan currentUser dengan data terbaru dari userData
	const currentUser = {
		nama: userData?.nama || "Chill Ajar",
		email: userData?.email || "chillajar@gmail.com",
		image: getImageUrl(userData?.foto_profil, defaultFoto),
	};

	const handleLogout = () => {
		// Swal.fire({
		// 	title: "Are you sure?",
		// 	text: "You will be logged out of your account.",
		// 	icon: "warning",
		// 	showCancelButton: true,
		// 	confirmButtonColor: "#3B82F6",
		// 	cancelButtonColor: "#EF4444",
		// 	confirmButtonText: "Yes, log me out",
		// 	cancelButtonText: "Cancel",
		// }).then((result) => {
		// 	if (result.isConfirmed) {
		onLogout();
		setIsOpen(false);
		// 	}
		// });
	};

	const getDisplayName = (nama) => {
		if (!nama) return "";
		const parts = nama.trim().split(" ");
		if (parts.length === 3) {
			return `${parts[0]} ${parts[1]}`;
		}
		return nama;
	};

	return (
		<div ref={menuRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-3 focus:outline-none group">
				<span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-gray-600">
					{getDisplayName(currentUser.nama)}
				</span>
				<img
					src={currentUser.image}
					alt={currentUser.nama}
					className="h-8 w-8 rounded-full aspect-square ring-2 ring-gray-200 group-hover:ring-blue-200 object-cover"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = defaultFoto;
					}}
				/>
			</button>

			{isOpen && (
				<AnimatePresence>
					<motion.div
						initial={{ scale: 0.8, y: -40, opacity: 0 }}
						animate={{ scale: 1, y: 0, opacity: 1 }}
						exit={{ scale: 0.8, y: -40, opacity: 0 }}
						transition={{ type: "spring", stiffness: 400, damping: 25 }}
						style={{ transformOrigin: "top right" }}
						className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
						<div className="px-4 py-2 border-b">
							<p className="text-sm font-medium text-gray-900">
								{getDisplayName(currentUser.nama)}
							</p>
							<p className="text-sm text-gray-500">{currentUser.email}</p>
						</div>

						{userRole === "admin" && (
							<button
								onClick={() => handleNavigate("admin-profile")}
								className="focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<User className="w-4 h-4 mr-2" />
								Profil Saya
							</button>
						)}
						{userRole === "mentor" && (
							<button
								onClick={() => handleNavigate("mentor-profile")}
								className="focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<User className="w-4 h-4 mr-2" />
								Profile Saya
							</button>
						)}
						{userRole === "pelanggan" && (
							<button
								onClick={() => handleNavigate("profile")}
								className=" focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<User className="w-4 h-4 mr-2" />
								Profil Saya
							</button>
						)}

						{userRole === "pelanggan" && isAuthenticated && (
							<div className="relative">
								<button
									onClick={() => {
										// Desktop: toggle sessions dropdown
										if (window.innerWidth >= 768) {
											setShowSessionsDropdown(!showSessionsDropdown);
										} else {
											// Mobile: close user menu and show mobile sessions
											setIsOpen(false);
											setShowMobileSessionsDropdown(true);
										}
									}}
									className=" focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
									<Clock className="w-4 h-4 mr-2" />
									Sesi Saya
								</button>

								{/* Desktop Sessions Dropdown */}
								{showSessionsDropdown && (
									<div
										className="
									hidden md:block absolute z-50
									top-0 right-full left-auto mr-2 mt-0 w-80
								">
										<SessionsWidget
											variant="compact-dropdown"
											maxSessions={10}
											onNavigate={(page) => {
												onNavigate(page);
												setShowSessionsDropdown(false);
											}}
										/>
									</div>
								)}
							</div>
						)}
						{userRole === "pelanggan" && (
							<button
								onClick={() => handleNavigate("session-history")}
								className="focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<BookCopy className="w-4 h-4 mr-2" />
								Riwayat Sesi
							</button>
						)}
						{userRole === "pelanggan" && (
							<button
								onClick={() => handleNavigate("transaction-history")}
								className="focus:outline-none flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<History className="w-4 h-4 mr-2" />
								Riwayat Transaksi
							</button>
						)}
						<button
							onClick={handleLogout}
							className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none">
							<LogOut className="w-4 h-4 mr-2" />
							Keluar
						</button>
					</motion.div>
				</AnimatePresence>
			)}

			{/* Mobile Sessions Dropdown - Fixed overlay */}
			{showMobileSessionsDropdown && (
				<div
					className="
					md:hidden fixed inset-0 z-[70] bg-black bg-opacity-50
					flex items-center justify-center p-4
				">
					<div className="w-full max-w-sm">
						<div className="mb-2 flex justify-end">
							<button
								onClick={() => setShowMobileSessionsDropdown(false)}
								className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<SessionsWidget
							variant="compact-dropdown"
							maxSessions={3}
							onNavigate={(page) => {
								onNavigate(page);
								setShowMobileSessionsDropdown(false);
							}}
						/>
					</div>
				</div>
			)}

			{/* Sessions Dropdown (only for pelanggan role) */}
		</div>
	);
}

export default UserMenu;
