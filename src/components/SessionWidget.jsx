import { useState } from "react";
import {
	Calendar,
	Clock,
	Monitor,
	MapPin,
	Video,
	MessageCircle,
	Bell,
	Star,
	CalendarClock,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { usePelangganSessionsQuery } from "@/hooks/useSessions"; // Import hook baru
import { getImageUrl } from "@/utils/getImageUrl";
import useAppStore from "@/stores/useAppStore";

export function SessionsWidget({
	variant = "full",
	maxSessions = null,
	onNavigate,
}) {
	const [expandedSession, setExpandedSession] = useState(null);

	// Zustand / auth
	const { userRole, userData, openTestimoniModal } = useAppStore();
	const userId = userData?.id;
	const pelangganId = userData?.pelanggan?.id;

	const queryClient = useQueryClient();

	// Transaksi (buat filter accepted & badge)
	// NOTE: backend should already return only sessions that have accepted transaksi
	// so we don't need to fetch /transaksi separately. If backend includes
	// transaksi inside sesi (sesi.transaksi) we'll use that when needed.

	// Hanya untuk pelanggan
	if (userRole !== "pelanggan") {
		return (
			<div className="p-4 text-center text-gray-500">
				<p>Session widget is only available for students</p>
			</div>
		);
	}

	// Daftar sesi
	const {
		data: sessions = [],
		isLoading,
		isFetching: fetchingSessions,
		error: errorSessions,
	} = usePelangganSessionsQuery(pelangganId);

	const sortedSessions = (sessions || [])
		.filter((session) => {
			const validStatus =
				session.statusSesi === "started" ||
				session.statusSesi === "pending" ||
				session.statusSesi === "end";
			if (!validStatus) return false;
			// Backend already filters by accepted transaksi, so keep the session
			return true;
		})
		.sort((a, b) => {
			if (a.statusSesi === "started" && b.statusSesi !== "started") return -1;
			if (b.statusSesi === "started" && a.statusSesi !== "started") return 1;
			const aNeedReview = a.statusSesi === "end" && !a.testimoni;
			const bNeedReview = b.statusSesi === "end" && !b.testimoni;
			if (aNeedReview && !bNeedReview) return -1;
			if (bNeedReview && !aNeedReview) return 1;
			if (a.statusSesi === "pending" && b.statusSesi === "pending") {
				const dateA = new Date(
					a.jadwal_kursus?.tanggal + " " + a.jadwal_kursus?.waktu
				);
				const dateB = new Date(
					b.jadwal_kursus?.tanggal + " " + b.jadwal_kursus?.waktu
				);
				return dateA - dateB;
			}
			return 0;
		});

	const activeSessions = sessions.filter(
		(s) => s.statusSesi === "started"
	).length;

	const upcomingSessions = sessions.filter(
		(s) => s.statusSesi === "pending"
	).length;

	const needReviewSessions = sessions.filter(
		(s) => s.statusSesi === "end" && !s.testimoni
	).length;

	const sessionsToShow = maxSessions
		? sortedSessions.slice(0, maxSessions)
		: sortedSessions;

	const getStatusColor = (statusSesi) => {
		switch (statusSesi) {
			case "started":
				return "bg-red-500";
			case "reviewed":
				return "bg-gray-500";
			default:
				return null;
		}
	};

	const getStatusText = (statusSesi) => {
		switch (statusSesi) {
			case "started":
				return "Live Now";
			case "pending":
				return "Upcoming";
			case "end":
				return "Need Review";
			case "reviewed":
				return "Reviewed";
			default:
				return "Undefined";
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "No date";
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (date.toDateString() === today.toDateString()) return "Hari Ini";
		if (date.toDateString() === tomorrow.toDateString()) return "Besok";
		return date.toLocaleDateString("id-ID", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	const handleOpenTestimoni = (session) => {
		const testimoniData = {
			id: session.id,
			sesi_id: session.id,
			pelanggan_id: pelangganId,
			mentor_id: session.mentor?.id,
			user_id: userId,
			// Callback untuk refetch setelah submit testimoni berhasil
			onSuccess: () => {
				// Refetch data sessions untuk update widget
				queryClient.invalidateQueries(["sessionsWidget", userId]);
			},
		};
		openTestimoniModal(testimoniData);
	};

	// Loading guard - show loading untuk initial load DAN background fetching
	const isBusy = isLoading;
	const isBackgroundFetching = fetchingSessions;
	const showLoading = isBusy || isBackgroundFetching;

	// ------------- Variant compact-dropdown -------------
	if (variant === "compact-dropdown") {
		return (
			<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
				<div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base flex-shrink-0">
							<CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600 flex-shrink-0" />
							<span className=" sm:inline">Daftar Sesi</span>
						</h3>
						<div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
							{activeSessions > 0 ? (
								<>
									<span className="inline-flex items-center py-1 text-red-600 rounded-full text-sm font-medium">
										<span className="relative flex h-2 w-2">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
											<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
										</span>
									</span>
									<span className="text-xs font-medium text-red-600 whitespace-nowrap">
										{activeSessions} Live
									</span>
								</>
							) : needReviewSessions > 0 ? (
								<>
									<span className="inline-flex items-center py-1 text-orange-600 rounded-full text-sm font-medium">
										<Bell className="w-3 h-3 sm:w-4 sm:h-4" />
									</span>
									<span className="text-xs font-medium text-orange-600 whitespace-nowrap">
										{needReviewSessions} Review
									</span>
								</>
							) : upcomingSessions > 0 ? (
								<>
									<span className="inline-flex items-center py-1 text-blue-600 rounded-full text-sm font-medium">
										<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
									</span>
									<span className="text-xs font-medium text-blue-600 whitespace-nowrap">
										{upcomingSessions} Upcoming
									</span>
								</>
							) : (
								<span className="text-xs text-gray-500">No sessions</span>
							)}
						</div>
					</div>
				</div>

				{showLoading ? (
					<div className="p-4 text-center text-gray-600 font-semibold flex flex-col items-center">
						{/* Animated loading dots */}
						<span className="flex items-center space-x-1">
							<p className="mr-1 animate-pulse">Loading sessions</p>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce [animation-delay:-0.3s]"></span>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce [animation-delay:-0.15s]"></span>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce"></span>
						</span>
					</div>
				) : sessionsToShow.length === 0 ? (
					<div className="p-4 text-center text-gray-500">
						<p>Belum ada data</p>
					</div>
				) : (
					<div className="p-2 sm:p-3 space-y-2 max-h-64 overflow-y-auto">
						{sessionsToShow.map((session) => {
							const rawPhone = session.mentor?.user?.nomorTelepon || "";
							const waPhone = rawPhone.replace(/^0/, "62");

							return (
								<div
									key={session.id}
									className="p-2 sm:p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-gray-900 text-sm truncate">
												{session.kursus?.namaKursus || "Course Name"}
											</h4>
											<p className="text-xs text-gray-500 mt-0.5">
												with {session.mentor?.user?.nama || "Mentor"}
											</p>
											<div className="flex items-center mt-1 text-xs text-gray-600">
												<Calendar className="w-3 h-3 mr-1" />
												<span className="truncate">
													{formatDate(session.jadwal_kursus?.tanggal)} •{" "}
													{session.jadwal_kursus?.waktu?.slice(0, 5)}
												</span>
											</div>
										</div>
										<div className="flex items-center space-x-1 flex-shrink-0">
											<div
												className={`w-2 h-2 rounded-full ${getStatusColor(
													session.statusSesi
												)}`}
											/>
											<span
												className={`text-xs px-1.5 py-0.5 rounded ${session.statusSesi === "started"
													? "text-red-600 bg-red-50"
													: session.statusSesi === "end"
														? "text-orange-600 bg-orange-50"
														: "text-blue-600 bg-blue-50"
													}`}>
												{getStatusText(session.statusSesi)}
											</span>
										</div>
									</div>

									<div className="flex mt-2 space-x-1">
										{session.statusSesi === "started" ? (
											<span className="flex-1 bg-red-500 text-center text-white py-1.5 px-2 rounded text-xs font-medium">
												Segera Bergabung!
											</span>
										) : session.statusSesi === "end" && !session.testimoni ? (
											<button
												disabled={showLoading}
												onClick={() =>
													!showLoading && handleOpenTestimoni(session)
												}
												className={`outline-none focus:outline-none flex-1 text-white py-1.5 px-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${showLoading
													? "opacity-60 bg-blue-200 cursor-not-allowed"
													: "bg-yellow-500 hover:bg-yellow-600"
													}`}>
												<MdRateReview className="w-4 h-4 text-white" />
												Beri Testimoni
											</button>
										) : (
											<>
												<button
													onClick={() =>
														onNavigate && onNavigate("session-history")
													}
													className="flex-1 bg-chill-blue text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-blue-600 transition-colors">
													Lihat Detail
												</button>
												<button
													onClick={() =>
														window.open(
															`https://wa.me/${waPhone}?text=Halo, saya ingin menanyakan tentang sesi ${session.kursus?.namaKursus || "Course Name"
															}`
														)
													}
													className="px-2 py-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors">
													<FaWhatsapp className="w-3 h-3" />
												</button>
											</>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div className="p-3 bg-gray-50 border-t">
					<button
						onClick={() => onNavigate && onNavigate("session-history")}
						className="w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium">
						Lihat Semua Sesi →
					</button>
				</div>
			</div>
		);
	}

	// ------------- Variant full -------------
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Your Sessions
					</h2>
					<p className="text-gray-600 mt-1">
						Manage your upcoming and ongoing learning sessions
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
					<span className="text-sm text-green-600 font-medium">
						{sessionsToShow.length} Active Sessions
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{showLoading ? (
					<div className="col-span-2 text-center py-8 text-gray-600 font-semibold flex flex-col items-center">
						{/* Animated loading dots */}
						<span className="flex items-center space-x-1">
							<p className="mr-1 animate-pulse">Loading sessions</p>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce [animation-delay:-0.3s]"></span>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce [animation-delay:-0.15s]"></span>
							<span className="w-2 h-2 mt-1 bg-chill-blue rounded-full animate-bounce"></span>
						</span>
					</div>
				) : sessionsToShow.length === 0 ? (
					<div className="col-span-2 text-center py-8 text-gray-500">
						No active sessions found
					</div>
				) : (
					sessionsToShow.map((session) => (
						<div
							key={session.id}
							className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-blue-100 hover:border-blue-200">
							<div className="absolute top-4 right-4 flex items-center space-x-2">
								<div
									className={`w-3 h-3 rounded-full ${getStatusColor(
										session.statusSesi
									)} animate-pulse`}
								/>
								<span
									className={`text-xs font-medium px-2 py-1 rounded-full ${session.statusSesi === "started"
										? "text-red-600 bg-red-50"
										: "text-green-600 bg-green-50"
										}`}>
									{getStatusText(session.statusSesi)}
								</span>
							</div>

							<div className="relative p-6">
								<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
									{session.kursus?.namaKursus || "Course Name"}
								</h3>

								<div className="flex items-center mb-4">
									<div className="relative">
										<img
											src={getImageUrl(
												session.mentor?.user?.foto_profil,
												"/foto_mentor/default.png"
											)}
											alt={session.mentor?.user?.nama || "Mentor"}
											className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
										/>
										<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
									</div>
									<div className="ml-3">
										<p className="font-medium text-gray-900">
											{session.mentor?.user?.nama || "Mentor Name"}
										</p>
										<div className="flex items-center">
											<Star className="w-4 h-4 text-blue-400 fill-current" />
											<span className="text-sm text-gray-500 ml-1">
												{session.mentor?.rating || "5.0"}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-3 mb-6">
									<div className="flex items-center text-gray-600">
										<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
											<Calendar className="w-4 h-4 text-blue-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">
												{formatDate(session.jadwal_kursus?.tanggal)}
											</p>
											<p className="text-sm text-gray-500">Session Date</p>
										</div>
									</div>

									<div className="flex items-center text-gray-600">
										<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors duration-300">
											<Clock className="w-4 h-4 text-purple-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">
												{session.jadwal_kursus?.waktu?.slice(0, 5) || "No time"}{" "}
												(1 hour)
											</p>
											<p className="text-sm text-gray-500">Duration</p>
										</div>
									</div>

									<div className="flex items-center text-gray-600">
										<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-300">
											{session.jadwal_kursus?.gayaMengajar === "online" ? (
												<Monitor className="w-4 h-4 text-green-600" />
											) : (
												<MapPin className="w-4 h-4 text-green-600" />
											)}
										</div>
										<div>
											<p className="font-medium text-gray-900 capitalize">
												{session.jadwal_kursus?.gayaMengajar || "online"}{" "}
												Session
											</p>
											<p className="text-sm text-gray-500">
												{session.jadwal_kursus?.tempat || "Virtual Meeting"}
											</p>
										</div>
									</div>
								</div>

								<div className="flex space-x-3">
									{session.statusSesi === "started" ? (
										<button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
											<div className="flex items-center justify-center space-x-2">
												<Video className="w-5 h-5" />
												<span>Join Live Session</span>
											</div>
										</button>
									) : session.statusSesi === "pending" ? (
										<>
											<button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
												<div className="flex items-center justify-center space-x-2">
													<Calendar className="w-5 h-5" />
													<span>View Details</span>
												</div>
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													window.open(
														`https://wa.me/6282139436043?text=Halo, saya ingin menanyakan tentang sesi ${session.kursus?.namaKursus || "Course Name"
														} yang akan dimulai pada ${formatDate(
															session.jadwal_kursus?.tanggal
														)}`
													);
												}}
												className="px-4 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300">
												<MessageCircle className="w-5 h-5" />
											</button>
										</>
									) : session.statusSesi === "end" && !session.testimoni ? (
										<button
											disabled={showLoading}
											onClick={(e) => {
												e.stopPropagation();
												!showLoading && handleOpenTestimoni(session);
											}}
											className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${showLoading
												? "opacity-60 cursor-not-allowed"
												: "hover:from-green-600 hover:to-green-700"
												}`}>
											<div className="flex items-center justify-center space-x-2">
												<Star className="w-5 h-5" />
												<span>Write Review</span>
											</div>
										</button>
									) : session.statusSesi === "end" && session.testimoni ? (
										<button className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-xl font-medium cursor-not-allowed">
											<div className="flex items-center justify-center space-x-2">
												<Star className="w-5 h-5" />
												<span>Reviewed</span>
											</div>
										</button>
									) : (
										<button className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-xl font-medium cursor-not-allowed">
											<div className="flex items-center justify-center space-x-2">
												<Calendar className="w-5 h-5" />
												<span>Reviewed</span>
											</div>
										</button>
									)}
								</div>

								<div className="mt-4 pt-4 border-t border-gray-100">
									<div className="flex items-center justify-between text-sm">
										<span className="text-gray-500">Session Fee</span>
										<span className="font-semibold text-gray-900">
											Rp {session.mentor?.biayaPerSesi?.toLocaleString() || "0"}
										</span>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default SessionsWidget;
