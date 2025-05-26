import React from "react";
import { useQuery } from "@tanstack/react-query";
import defaultPhoto from "../assets/foto_profil.png";
import {
	User,
	Mail,
	MapPin,
	Phone,
	Calendar,
	BookOpen,
	Star,
	Award,
} from "lucide-react";
import api from "../api";

export function ProfilePage({ userData, userRole, onNavigate }) {
	// Fetch mentor profile data using useQuery
	const {
		data: mentorProfile,
		isLoading: profileLoading,
		error: profileError,
	} = useQuery({
		queryKey: ["mentorProfile"],
		queryFn: async () => {
			if (!userData || userData.peran !== "mentor") return null;
			const response = await api.get("/mentor/profil-saya", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return response.data;
		},
		enabled: !!userData && userData.peran === "mentor",
	});

	const currentUser = {
		name: userData?.nama || mentorProfile?.user?.nama || "Unknown User",
		email: userData?.email || mentorProfile?.user?.email || "No email provided",
		avatar: userData?.avatar || mentorProfile?.user?.image || defaultPhoto,
		location:
			userData?.alamat ||
			mentorProfile?.user?.alamat ||
			"Location not specified",
		phone:
			userData?.nomorTelepon ||
			mentorProfile?.user?.nomorTelepon ||
			"Phone not specified",
		joinedDate:
			userData?.created_at || mentorProfile?.user?.created_at
				? new Date(
						userData?.created_at || mentorProfile?.user?.created_at
				  ).toLocaleDateString("id-ID", {
						year: "numeric",
						month: "long",
						day: "numeric",
				  })
				: "Unknown",
		peran: userData?.peran || mentorProfile?.user?.peran || "unknown",
	};

	const roleSpecificData = {
		mentor: {
			completedCourses: userData?.completedCourses || 0,
			averageRating: mentorProfile?.rating || 0,
			deskripsi: mentorProfile?.deskripsi || "No description",
			gayaMengajar: mentorProfile?.gayaMengajar || "Not specified",
		},
		pelanggan: {
			coursesEnrolled: userData?.coursesEnrolled || 0,
			paymentStatus: userData?.statusPembayaran || "Not specified",
		},
	};

	if (profileLoading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading profile data...</p>
			</div>
		);
	}

	if (profileError) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-red-500">
				<p>{profileError.message || "Gagal mengambil data profile"}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded">
					Reload
				</button>
			</div>
		);
	}

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
							{currentUser.peran === "mentor" ? (
								<>
									<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<BookOpen className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.mentor.completedCourses}
										</div>
										<div className="text-sm text-gray-600">
											Courses Completed
										</div>
									</div>
									<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.mentor.averageRating}
										</div>
										<div className="text-sm text-gray-600">Average Rating</div>
									</div>
								</>
							) : currentUser.peran === "pelanggan" ? (
								<>
									<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<BookOpen className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.pelanggan.coursesEnrolled}
										</div>
										<div className="text-sm text-gray-600">
											Courses Enrolled
										</div>
									</div>
									<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Calendar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.pelanggan.paymentStatus}
										</div>
										<div className="text-sm text-gray-600">Payment Status</div>
									</div>
									<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">0</div>
										<div className="text-sm text-gray-600">Achievements</div>
									</div>
								</>
							) : null}
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

						{/* Mentor Details (hanya untuk mentor) */}
						{currentUser.peran === "mentor" && (
							<div className="bg-gray-50 rounded-xl p-6 mt-6 space-y-4">
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									Mentor Details
								</h3>
								<div className="space-y-2">
									<p className="text-gray-600">
										<strong>Deskripsi:</strong>{" "}
										{roleSpecificData.mentor.deskripsi}
									</p>
									<p className="text-gray-600">
										<strong>Gaya Mengajar:</strong>{" "}
										{roleSpecificData.mentor.gayaMengajar}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
