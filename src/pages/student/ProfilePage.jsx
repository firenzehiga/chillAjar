import React from "react";
import {
	Mail,
	MapPin,
	Phone,
	Calendar,
	BookOpen,
	AlertCircle,
	Users,
	Building2Icon,
	Loader2,
} from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import { usePelangganProfileInfoQuery } from "../../hooks/useProfile";
import { ProfileSkeletonUser } from "../../components/ui/Skeleton/ProfileSkeleton";
import { useDocumentTitle } from "@/hooks/utils/useDocumentTitle";

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
	useDocumentTitle("Profil Saya");

	const currentUser = {
		name: userData?.nama || "Unknown User",
		email: userData?.email || "No email provided",
		avatar: getImageUrl(userData?.foto_profil, "/foto_mentor/default.png"),
		location: userData?.alamat || "Location not specified",
		phone: userData?.nomorTelepon || "Phone not specified",
		joinedDate: userData?.created_at
			? new Date(userData?.created_at).toLocaleDateString("id-ID", {
					year: "numeric",
					month: "long",
					day: "numeric",
			  })
			: "Unknown",
		peran: userData?.peran || "unknown",
	};
	const { data: statistik, isLoading, error } = usePelangganProfileInfoQuery();

	// Tentukan tier badge
	const tier = getTier(statistik?.jumlah_sesi || 0);

	if (isLoading) {
		return <ProfileSkeletonUser />;
	}
	return (
		<div className="py-8 px-4 min-h-screen">
			<div className="max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
					<div className="h-28 bg-gradient-to-r from-chill-blue to-chill-blue-dark relative">
						<div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-8 md:translate-x-0">
							<img
								src={getImageUrl(
									userData?.foto_profil,
									"/foto_mentor/default.png"
								)}
								alt={currentUser.name}
								className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_mentor/default.png";
								}}
							/>
						</div>
					</div>
					<div className="pt-20 px-4 sm:px-8 pb-8">
						<div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<h1 className="text-lg sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
										{currentUser.name}
									</h1>
									{/* Badge Tier */}
									{error ? null : isLoading ? (
										<span
											className="inline-block h-7 w-24 rounded-full bg-gray-100 animate-pulse"
											aria-label="Loading tier badge"></span>
									) : (
										<span
											className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white
                                            bg-gradient-to-r ${tier.color} shadow-md border-2 border-white
                                            transition-transform cursor-pointer`}
											title={tier.desc}>
											<span className="text-lg">{tier.icon}</span>
											{tier.label}
										</span>
									)}
								</div>
								<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600 text-xs sm:text-sm mb-2">
									<span className="flex items-center">
										<Calendar className="w-4 h-4 mr-1 text-blue-600" />
										Joined {currentUser.joinedDate}
									</span>
									<span className="flex items-center">
										<MapPin className="w-4 h-4 mr-1 text-blue-600" />
										{currentUser.location}
									</span>
								</div>
							</div>
							<button
								className="bg-chill-blue-dark text-white px-2 py-2 rounded-full font-medium ml-0 md:ml-4 mt-2 md:mt-0 whitespace-nowrap transform transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
								onClick={() => onNavigate("edit-profile")}>
								Edit Profile
							</button>
						</div>
						<div className="grid grid-cols-2 gap-6 mb-8">
							{error ? (
								<div className="col-span-2 flex flex-col items-center justify-center bg-red-50 p-6 rounded-xl min-h-[110px]">
									<AlertCircle className="w-8 h-8 text-red-400 mb-2" />
									<div className="text-base font-semibold text-red-700 mb-1">
										Gagal memuat statistik
									</div>
									<div className="text-sm text-red-500 text-center">
										Silakan coba beberapa saat lagi.
									</div>
								</div>
							) : (
								<>
									{/* Card statistik */}
									<div className="bg-blue-50 p-4 rounded-xl text-center flex flex-col justify-center min-h-[110px]">
										<BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										{isLoading ? (
											<div className="mx-auto h-8 w-12 rounded bg-gray-100 animate-pulse mb-1"></div>
										) : (
											<div className="text-2xl font-bold text-gray-900">
												{statistik?.jumlah_kursus ?? 0}
											</div>
										)}
										<div className="text-sm text-gray-600">
											Courses Enrolled
										</div>
									</div>
									<div className="bg-blue-50 p-4 rounded-xl text-center flex flex-col justify-center min-h-[110px]">
										<Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										{isLoading ? (
											<div className="mx-auto h-8 w-12 rounded bg-gray-100 animate-pulse mb-1"></div>
										) : (
											<div className="text-2xl font-bold text-gray-900">
												{statistik?.jumlah_mentor ?? 0}
											</div>
										)}
										<div className="text-sm text-gray-600">Mentors Booked</div>
									</div>
									<div className="bg-blue-50 p-4 rounded-xl text-center flex flex-col justify-center min-h-[110px]">
										<Building2Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
										{isLoading ? (
											<div className="mx-auto h-8 w-12 rounded bg-gray-100 animate-pulse mb-1"></div>
										) : (
											<div className="text-2xl font-bold text-gray-900">
												{statistik?.jumlah_sesi ?? 0}
											</div>
										)}
										<div className="text-sm text-gray-600">
											Sessions Completed
										</div>
									</div>
								</>
							)}
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
									<Phone className="w-5 h-5 mr-3 text-blue-600" />
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
