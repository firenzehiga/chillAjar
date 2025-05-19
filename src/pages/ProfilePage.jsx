import React from "react";
import { useQuery } from "@tanstack/react-query"; // Impor React Query
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

const defaultAvatar =
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200";

export function ProfilePage({ userData }) {
	// Fetch deskripsi menggunakan useQuery
	const {
		data: deskripsi,
		isLoading: deskripsiLoading,
		error: deskripsiError,
	} = useQuery({
		queryKey: ["mentorProfile"], // Key unik untuk caching
		queryFn: async () => {
			if (!userData || userData.peran !== "mentor") return "No description";
			const response = await api.get("/mentor/profil-saya", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return response.data.deskripsi || "No description";
		},
		enabled: !!userData && userData.peran === "mentor", // Hanya fetch jika peran adalah mentor
	});

	const currentUser = {
		name: userData?.nama || "Unknown User",
		email: userData?.email || "No email provided",
		avatar: userData?.avatar || defaultAvatar,
		location: userData?.alamat || "Location not specified",
		phone: userData?.nomorTelepon || "Phone not specified",
		joinedDate: userData?.created_at || "Unknown",
		peran: userData?.peran || "unknown",
	};

	const roleSpecificData = {
		mentor: {
			completedCourses: userData?.completedCourses || 0,
			averageRating: userData?.averageRating || 0,
			deskripsi: deskripsi,
		},
		pelanggan: {
			coursesEnrolled: userData?.coursesEnrolled || 0,
			paymentStatus: userData?.statusPembayaran || "Not specified",
		},
	};

	return (
		<div className="py-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
					<div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
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
								<h2 className="text-3xl font-bold text-gray-900 mb-2">
									{currentUser.name}
								</h2>
								<p className="text-gray-600 flex items-center">
									<Calendar className="w-4 h-4 mr-2" />
									Joined{" "}
									{new Date(currentUser.joinedDate).toLocaleDateString(
										"id-ID",
										{
											year: "numeric",
											month: "long",
											day: "numeric",
										}
									)}
								</p>
							</div>
							<button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium transform transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
								Edit Profile
							</button>
						</div>
						<div className="grid grid-cols-2 gap-6 mb-8">
							{currentUser.peran === "mentor" ? (
								<>
									<div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.mentor.completedCourses}
										</div>
										<div className="text-sm text-gray-600">
											Courses Completed
										</div>
									</div>
									<div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.mentor.averageRating}
										</div>
										<div className="text-sm text-gray-600">Average Rating</div>
									</div>
								</>
							) : currentUser.peran === "pelanggan" ? (
								<>
									<div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.pelanggan.coursesEnrolled}
										</div>
										<div className="text-sm text-gray-600">
											Courses Enrolled
										</div>
									</div>
									<div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										<div className="text-2xl font-bold text-gray-900">
											{roleSpecificData.pelanggan.paymentStatus}
										</div>
										<div className="text-sm text-gray-600">Payment Status</div>
									</div>
									<div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
										<Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
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
									<Mail className="w-5 h-5 mr-3 text-blue-600" />
									<span>{currentUser.email}</span>
								</div>
								<div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
									<MapPin className="w-5 h-5 mr-3 text-blue-600" />
									<span>{currentUser.location}</span>
								</div>
								<div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
									<Phone className="w-5 h-5 mr-3 text-blue-600" />
									<span>{currentUser.phone}</span>
								</div>
							</div>
						</div>

						{/* Deskr (hanya untuk mentor) */}
						{currentUser.peran === "mentor" && (
							<div className="bg-gray-50 rounded-xl p-6 mt-6 space-y-4">
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									Description
								</h3>
								<p className="text-gray-600">
									{roleSpecificData.mentor.deskripsi}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
