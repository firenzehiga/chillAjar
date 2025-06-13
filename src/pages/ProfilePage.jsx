import React from "react";
import defaultPhoto from "../assets/foto_profil.png";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import {
	Mail,
	MapPin,
	Phone,
	Calendar,
	BookOpen,
	Users,
	Building2Icon,
	Loader2,
} from "lucide-react";

// Fungsi untuk menentukan tier badge
function getTier(jumlahSesi) {
	if (jumlahSesi > 10)
		return {
			label: "Expert",
			color: "from-green-400 to-green-600",
			icon: "🥇",
			desc: "Lebih dari 10 sesi",
		};
	if (jumlahSesi > 5)
		return {
			label: "Active Learner",
			color: "from-blue-400 to-blue-600",
			icon: "🏅",
			desc: "4-10 sesi",
		};
	if (jumlahSesi > 0)
		return {
			label: "Beginner",
			color: "from-orange-400 to-orange-600",
			icon: "🎖️",
			desc: "1-3 sesi",
		};
	return {
		label: "Newbie",
		color: "from-gray-400 to-gray-600",
		icon: "⭐",
		desc: "0-3 sesi",
	};
}

export function ProfilePage({ userData, userRole, onNavigate }) {
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

	const {
		data: statistik,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["pelangganStatistik"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const res = await api.get("/pelanggan/profil-info", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return res.data;
		},
	});

	// Tentukan tier badge
	const tier = getTier(statistik?.jumlah_sesi || 0);

	if (error) {
		console.log(error);
		return <div>Gagal memuat data</div>;
	}

	return (
		<div className="py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
					<div className="h-28 bg-gradient-to-r from-yellow-500 to-yellow-600 relative">
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
								<div className="flex items-center gap-2 mb-2">
									<h1 className="text-3xl font-bold text-gray-900">
										{currentUser.name}
									</h1>
									{/* Badge Tier */}
									{isLoading ? (
										<span
											className={`inline-block h-7 w-24 rounded-full bg-gray-200 animate-pulse`}
											aria-label="Loading tier badge"></span>
									) : (
										<span
											className={`
												flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white
												bg-gradient-to-r ${tier.color} shadow-md border-2 border-white
												transition-transform cursor-pointer
											`}
											title={tier.desc}>
											<span className="text-lg">{tier.icon}</span>
											{tier.label}
										</span>
									)}
								</div>
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
							{/* Kursus */}
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 min-h-[110px] flex flex-col justify-center">
								<BookOpen className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								{isLoading ? (
									<Loader2 className="animate-spin mx-auto text-yellow-600" />
								) : (
									<div className="text-2xl font-bold text-gray-900">
										{statistik?.jumlah_kursus ?? 0}
									</div>
								)}
								<div className="text-sm text-gray-600">Courses Enrolled</div>
							</div>
							{/* Mentor */}
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 min-h-[110px] flex flex-col justify-center">
								<Users className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								{isLoading ? (
									<Loader2 className="animate-spin mx-auto text-yellow-600" />
								) : (
									<div className="text-2xl font-bold text-gray-900">
										{statistik?.jumlah_mentor ?? 0}
									</div>
								)}
								<div className="text-sm text-gray-600">Mentors Booked</div>
							</div>
							{/* Sesi */}
							<div className="bg-yellow-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105 min-h-[110px] flex flex-col justify-center">
								<Building2Icon className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
								{isLoading ? (
									<Loader2 className="animate-spin mx-auto text-yellow-600" />
								) : (
									<div className="text-2xl font-bold text-gray-900">
										{statistik?.jumlah_sesi ?? 0}
									</div>
								)}
								<div className="text-sm text-gray-600">Sessions Completed</div>
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
