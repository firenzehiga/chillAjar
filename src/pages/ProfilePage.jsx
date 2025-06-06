import React from "react";
import defaultPhoto from "../assets/foto_profil.png";
import {
	Mail,
	MapPin,
	Phone,
	Calendar,
	BookOpen,
	Star,
	Award,
} from "lucide-react";

export function ProfilePage({ userData, userRole, onNavigate }) {
	console.log("UserData:", userData);

	const currentUser = {
		name: userData?.nama || "Unknown User",
		email: userData?.email || "No email provided",
		avatar: userData?.foto_profil
			? `/storage/${userData.foto_profil}?t=${Date.now()}`
			: defaultPhoto,
		location: userData?.alamat || "Location not specified",
		phone: userData?.nomorTelepon || "Phone not specified",
		joinedDate: userData?.created_at
			? new Date(userData.created_at).toLocaleDateString("id-ID", {
					year: "numeric",
					month: "long",
					day: "numeric",
			  })
			: "Unknown",
		peran: userData?.peran || "unknown",
	};

	return (
		<div className="py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
					<div className="h-48 bg-gradient-to-r from-yellow-500 to-yellow-600 relative">
						<div className="absolute -bottom-16 left-8">
							<img
								src={currentUser.avatar}
								alt={currentUser.name}
								className="w-32 h-32 rounded-full border-4 border-white shadow-lg transform transition-transform duration-300 hover:scale-105"
							/>
						</div>
					</div>
					<div className="pt-20 px-8 pb-8">
						<div className="flex justify-between items-start mb-6">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">
									{currentUser.name}
								</h1>
								<div className="flex items-center text-gray-600 space-x-4">
									<span className="flex items-center">
										<Calendar className="w-4 h-4 mr-2 text-yellow-600" />
										Joined {currentUser.joinedDate}
									</span>
									<span className="flex items-center">
										<MapPin className="w-4 h-4 mr-2 text-yellow-600" />
										{currentUser.location}
									</span>
								</div>
							</div>
							<button
								className="bg-yellow-600 text-white px-6 py-2 rounded-full font-medium transform transition-all duration-300 hover:scale-105 hover:bg-yellow-700 hover:shadow-lg"
								onClick={() => onNavigate("edit-profile")}>
								Edit Profile
							</button>
						</div>
						<div className="grid grid-cols-2 gap-6 mb-8">
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
								<BookOpen className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								<div className="text-2xl font-bold text-gray-900">
									{currentUser.coursesEnrolled || 0}
								</div>
								<div className="text-sm text-gray-600">Courses Enrolled</div>
							</div>
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
								<Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								<div className="text-2xl font-bold text-gray-900">
									{currentUser.paymentStatus || 0}
								</div>
								<div className="text-sm text-gray-600">Payment Status</div>
							</div>
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
								<Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								<div className="text-2xl font-bold text-gray-900">0</div>
								<div className="text-sm text-gray-600">Achievements</div>
							</div>
						</div>
						<div className="bg-gray-50 rounded-xl p-6 space-y-4">
							<h3 className="text-xl font-semibold text-gray-900 mb-4">
								Contact Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
									<Mail className="w-5 h-5 mr-3 text-yellow-600" />
									<span>{currentUser.email}</span>
								</div>
								<div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
									<Phone className="w-5 h-5 mr-3 text-yellow-600" />
									<span>{currentUser.phone}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
