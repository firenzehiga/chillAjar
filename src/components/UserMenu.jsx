import React, { useState } from "react";
import { LogOut, User, Settings, History, BookCopy } from "lucide-react";
import userChill from "../assets/foto_profil.png";
import Swal from "sweetalert2";

export function UserMenu({ onNavigate, onLogout, userData, userRole }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleNavigate = (page) => {
		onNavigate(page);
		setIsOpen(false);
	};

	// Definisikan currentUser dengan data terbaru dari userData
	const currentUser = {
		nama: userData?.nama || "Chill Ajar",
		email: userData?.email || "chillajar@gmail.com",
		image: userData?.foto_profil
			? `/storage/${userData.foto_profil}`
			: userChill,
	};

	const handleLogout = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "You will be logged out of your account.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3B82F6",
			cancelButtonColor: "#EF4444",
			confirmButtonText: "Yes, log me out",
			cancelButtonText: "Cancel",
		}).then((result) => {
			if (result.isConfirmed) {
				onLogout();
				setIsOpen(false);
			}
		});
	};

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center space-x-3 focus:outline-none group">
				<span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-gray-600">
					{currentUser.nama}
				</span>
				<img
					src={currentUser.image}
					alt={currentUser.nama}
					className="h-8 w-8 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-200"
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
					<div className="px-4 py-2 border-b">
						<p className="text-sm font-medium text-gray-900">
							{currentUser.nama}
						</p>
						<p className="text-sm text-gray-500">{currentUser.email}</p>
					</div>

					{userRole === "admin" && (
						<button
							onClick={() => handleNavigate("admin-profile")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<User className="w-4 h-4 mr-2" />
							Profil Saya
						</button>
					)}
					{userRole === "mentor" && (
						<button
							onClick={() => handleNavigate("mentor-profile")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<User className="w-4 h-4 mr-2" />
							Profile Saya
						</button>
					)}
					{userRole === "pelanggan" && (
						<button
							onClick={() => handleNavigate("profile")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<User className="w-4 h-4 mr-2" />
							Profil Saya
						</button>
					)}

					{userRole === "pelanggan" && (
						<button
							onClick={() => handleNavigate("session-history")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<BookCopy className="w-4 h-4 mr-2" />
							Riwayat Sesi
						</button>
					)}
					{userRole === "pelanggan" && (
						<button
							onClick={() => handleNavigate("transaction-history")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<History className="w-4 h-4 mr-2" />
							Riwayat Pemesanan
						</button>
					)}
					{userRole === "admin" && (
						<button
							onClick={() => handleNavigate("admin-manage-history")}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
							<History className="w-4 h-4 mr-2" />
							Riwayat Pemesanan
						</button>
					)}

					<button
						onClick={handleLogout}
						className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
						<LogOut className="w-4 h-4 mr-2" />
						Sign out
					</button>
				</div>
			)}
		</div>
	);
}

export default UserMenu;
