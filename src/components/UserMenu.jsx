import React, { useState } from "react";
import { LogOut, User, Settings, History } from "lucide-react";
import userChill from "../assets/default.png";
import Swal from "sweetalert2";

export function UserMenu({ onNavigate, onLogout, userData }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleNavigate = (page) => {
		onNavigate(page);
		setIsOpen(false);
	};

	// Gunakan userData jika ada, jika tidak gunakan default
	const currentUser = {
		...userData,
		namaDefault: "Chill Ajar",
		emailDefault: "chillajar@gmail.com",
		image: userChill,
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
				onLogout(); // Panggil fungsi logout dari App.jsx
				setIsOpen(false);
				Swal.fire({
					icon: "success",
					title: "Logged Out!",
					text: "You have been successfully logged out.",
					position: "top-end",
					toast: true,
					timer: 2000,
					showConfirmButton: false,
				});
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
					src={currentUser.image} // Gunakan avatar dari userData jika ada
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

					<button
						onClick={() => handleNavigate("profile")}
						className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<User className="w-4 h-4 mr-2" />
						Your Profile
					</button>

					<button
						onClick={() => handleNavigate("history")}
						className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<History className="w-4 h-4 mr-2" />
						Session History
					</button>

					<button
						onClick={() => handleNavigate("settings")}
						className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
						<Settings className="w-4 h-4 mr-2" />
						Settings
					</button>

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
