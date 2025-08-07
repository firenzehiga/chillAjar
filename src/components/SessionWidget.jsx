import React, { useState } from "react";
import {
	Calendar,
	Clock,
	Monitor,
	MapPin,
	Video,
	Phone,
	MessageCircle,
	ChevronRight,
	Bell,
	Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "../utils/getImageUrl";
import useAppStore from "../stores/useAppStore";

export function SessionsWidget({
	variant = "full",
	maxSessions = null,
	onNavigate,
}) {
	const [expandedSession, setExpandedSession] = useState(null);

	// Get state from Zustand store
	const { userRole, userData } = useAppStore();
	const userId = userData?.id;
	const pelangganId = userData?.pelanggan?.id;

	const {
		data: transactions = [],
		isLoading: loadingTransactions,
		error: errorTransactions,
	} = useQuery({
		queryKey: ["statusTransactions", pelangganId],
		queryFn: async () => {
			const res = await api.get("/transaksi");
			return res.data.filter((t) => t.pelanggan_id === pelangganId);
		},
		enabled: !!pelangganId,
	});

	// 1. Filter transaksi yang statusnya "accepted"
	// Hanya ambil transaksi yang sudah pembayaran diterima
	const acceptedTransactions = transactions.filter(
		(trx) => trx.statusPembayaran === "accepted"
	);

	// Hanya tampilkan untuk role pelanggan
	if (userRole !== "pelanggan") {
		return (
			<div className="p-4 text-center text-gray-500">
				<p>Session widget is only available for students</p>
			</div>
		);
	}

	// Fetch daftar sesi pelanggan berdasarkan userId
	const { data: sessions = [], isLoading } = useQuery({
		queryKey: ["sessionsWidget", userId],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get(
				`/pelanggan/daftar-sesi?user_id=${userId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		},
		enabled: !!userId && userRole === "pelanggan",
	});

	// Filter dan sort sesi berdasarkan prioritas DAN status transaksi
	const sortedSessions = sessions
		.filter((session) => {
			// Filter berdasarkan statusSesi
			const validStatus =
				session.statusSesi === "started" ||
				session.statusSesi === "pending" ||
				session.statusSesi === "end";

			if (!validStatus) return false;

			// Cek apakah ada transaksi accepted untuk session ini
			const hasAcceptedTransaction = acceptedTransactions.some(
				(trx) => trx.sesi_id === session.id
			);

			return hasAcceptedTransaction;
		})
		.sort((a, b) => {
			// Prioritaskan sesi yang sedang live
			if (a.statusSesi === "started" && b.statusSesi !== "started") return -1;
			if (b.statusSesi === "started" && a.statusSesi !== "started") return 1;

			// Lalu sesi yang sudah selesai (perlu review)
			if (a.statusSesi === "end" && b.statusSesi === "pending") return -1;
			if (b.statusSesi === "end" && a.statusSesi === "pending") return 1;

			// Jika sama-sama pending, sort berdasarkan waktu
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

	// Update hitung jumlah untuk badge - dengan filter transaksi accepted (sama seperti SessionHistoryPage)
	const activeSessions = sessions.filter((s) => {
		return (
			s.statusSesi === "started" &&
			acceptedTransactions.some((trx) => trx.sesi_id === s.id)
		);
	}).length;

	const upcomingSessions = sessions.filter((s) => {
		return (
			s.statusSesi === "pending" &&
			acceptedTransactions.some((trx) => trx.sesi_id === s.id)
		);
	}).length;

	const needReviewSessions = sessions.filter((s) => {
		return (
			s.statusSesi === "end" &&
			acceptedTransactions.some((trx) => trx.sesi_id === s.id)
		);
	}).length;

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

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return "Tomorrow";
		} else {
			return date.toLocaleDateString("id-ID", {
				weekday: "short",
				month: "short",
				day: "numeric",
			});
		}
	};

	// Variant compact-dropdown untuk navigation (include container)
	if (variant === "user-menu-dropdown") {
		return (
			<div
				className="absolute 
            top-full left-0 mt-1 w-full min-w-[280px]
            sm:top-0 sm:right-full sm:left-auto sm:mr-2 sm:mt-0 sm:w-80
            z-50">
				<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
					<SessionsWidget
						variant="compact"
						maxSessions={maxSessions}
						onNavigate={onNavigate}
					/>
					<div className="p-3 bg-gray-50 border-t">
						<button
							onClick={() => {
								onNavigate("session-history");
							}}
							className="outline-none focus:outline-none w-full text-center text-gray-600 hover:text-gray-900 text-sm font-medium">
							Lihat Semua Sesi →
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Variant compact-dropdown untuk dropdown positioning (without absolute container)
	if (variant === "compact-dropdown") {
		return (
			<div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
				<div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-gray-50 border-b">
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base flex-shrink-0">
							<Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-600 flex-shrink-0" />
							<span className="hidden sm:inline">Your Sessions</span>
							<span className="sm:hidden">Sessions</span>
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

				{isLoading ? (
					<div className="p-4 text-center text-gray-500">
						<p>Loading sessions...</p>
					</div>
				) : sessionsToShow.length === 0 ? (
					<div className="p-4 text-center text-gray-500">
						<p>No active sessions</p>
					</div>
				) : (
					<div className="p-2 sm:p-3 space-y-2 max-h-64 overflow-y-auto">
						{sessionsToShow.map((session) => (
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
											)}`}></div>
										<span
											className={`text-xs px-1.5 py-0.5 rounded ${
												session.statusSesi === "started"
													? "text-red-600 bg-red-50"
													: session.statusSesi === "end"
													? "text-orange-600 bg-orange-50"
													: "text-blue-600 bg-blue-50"
											}`}>
											{getStatusText(session.statusSesi)}
										</span>
									</div>
								</div>

								{/* Action buttons untuk mobile/small screens */}
								<div className="flex mt-2 space-x-1">
									{session.statusSesi === "started" ? (
										<button className="flex-1 bg-red-500 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-red-600 transition-colors">
											Join Live
										</button>
									) : session.statusSesi === "end" ? (
										<button className="flex-1 bg-orange-500 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-orange-600 transition-colors">
											Write Review
										</button>
									) : (
										<button
											onClick={() =>
												onNavigate && onNavigate("session-history")
											}
											className="flex-1 bg-blue-500 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-blue-600 transition-colors">
											View Details
										</button>
									)}
									<button
										onClick={() =>
											window.open(
												`https://wa.me/6282139436043?text=Halo, saya ingin menanyakan tentang sesi ${
													session.kursus?.namaKursus || "Course Name"
												}`
											)
										}
										className="px-2 py-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors">
										<FaWhatsapp className="w-3 h-3" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Footer dengan link ke semua sesi */}
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

	if (variant === "compact") {
		return (
			<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-[95vw] sm:max-w-[420px] md:max-w-[480px]">
				<div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-gray-50 border-b">
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base flex-shrink-0">
							<Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-600 flex-shrink-0" />
							<span className="hidden sm:inline">Your Sessions</span>
							<span className="sm:hidden">Sessions</span>
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
									<div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
									<span className="text-xs font-medium text-blue-600 whitespace-nowrap">
										{needReviewSessions} Review
									</span>
								</>
							) : upcomingSessions > 0 ? (
								<>
									<div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
									<span className="text-xs font-medium text-yellow-600 whitespace-nowrap">
										{upcomingSessions} Upcoming
									</span>
								</>
							) : (
								<span className="text-xs font-medium text-gray-500 whitespace-nowrap">
									No sessions
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="max-h-64 sm:max-h-80 overflow-y-auto">
					{isLoading ? (
						<div className="p-3 text-center text-gray-500">Loading...</div>
					) : sessionsToShow.length === 0 ? (
						<div className="p-3 text-center text-gray-500">
							No active sessions
						</div>
					) : (
						sessionsToShow.map((session) => {
							// Convert nomorTelepon to WhatsApp format (replace leading 0 with 62)
							const rawPhone = session.mentor?.user?.nomorTelepon || "";
							const waPhone = rawPhone.replace(/^0/, "62");
							return (
								<div
									key={session.id}
									className="p-2 sm:p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
									<div className="flex items-center gap-2">
										<div className="flex items-center flex-1 min-w-0 gap-2">
											<img
												src={getImageUrl(
													session.mentor?.user?.foto_profil,
													"/foto_mentor/default.png"
												)}
												alt={session.mentor?.user?.nama || "Mentor"}
												className="w-8 h-8 rounded-full object-cover flex-shrink-0"
											/>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
													{session.kursus?.namaKursus || "Course"}
												</p>
												<p className="text-xs text-gray-500 truncate">
													{formatDate(session.jadwal_kursus?.tanggal)} at{" "}
													{session.jadwal_kursus?.waktu?.slice(0, 5) ||
														"No time"}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
											<div
												className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(
													session.statusSesi
												)}`}></div>
											{session.statusSesi === "started" ? (
												<button
													disabled
													className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium cursor-not-allowed whitespace-nowrap">
													Live
												</button>
											) : session.statusSesi === "pending" ? (
												<button
													onClick={(e) => {
														e.stopPropagation();
														window.open(
															`https://wa.me/${waPhone}?text=Halo, saya ingin menanyakan tentang sesi ${
																session.kursus?.namaKursus || "Course"
															} yang akan dimulai pada ${formatDate(
																session.jadwal_kursus?.tanggal
															)}`
														);
													}}
													className="bg-green-500 text-white p-1 rounded-full text-xs font-medium hover:bg-green-600 transition-colors flex-shrink-0">
													<FaWhatsapp className="w-5 h-5" />
												</button>
											) : session.statusSesi === "end" ? (
												<button
													onClick={() => {
														onNavigate("session-history");
													}}
													className="bg-green-500 outline-none text-white px-2 py-1 rounded-full text-xs font-medium hover:bg-green-600 transition-colors whitespace-nowrap">
													Beri Testimoni
												</button>
											) : null}
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		);
	}

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
				{isLoading ? (
					<div className="col-span-2 text-center py-8 text-gray-500">
						Loading sessions...
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
							{/* Background Pattern */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

							{/* Status Indicator */}
							<div className="absolute top-4 right-4 flex items-center space-x-2">
								<div
									className={`w-3 h-3 rounded-full ${getStatusColor(
										session.statusSesi
									)} animate-pulse`}></div>
								<span
									className={`text-xs font-medium px-2 py-1 rounded-full ${
										session.statusSesi === "started"
											? "text-red-600 bg-red-50"
											: "text-green-600 bg-green-50"
									}`}>
									{getStatusText(session.statusSesi)}
								</span>
							</div>

							<div className="relative p-6">
								{/* Course Title */}
								<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
									{session.kursus?.namaKursus || "Course Name"}
								</h3>

								{/* Mentor Info */}
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
											<Star className="w-4 h-4 text-yellow-400 fill-current" />
											<span className="text-sm text-gray-500 ml-1">
												{session.mentor?.rating || "5.0"}
											</span>
										</div>
									</div>
								</div>

								{/* Session Details */}
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

								{/* Action Buttons */}
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
														`https://wa.me/6282139436043?text=Halo, saya ingin menanyakan tentang sesi ${
															session.kursus?.namaKursus || "Course Name"
														} yang akan dimulai pada ${formatDate(
															session.jadwal_kursus?.tanggal
														)}`
													);
												}}
												className="px-4 py-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors duration-300">
												<MessageCircle className="w-5 h-5" />
											</button>
										</>
									) : session.statusSesi === "end" ? (
										<>
											<button
												onClick={(e) => {
													e.stopPropagation();
													// TODO: Open review/testimonial modal
												}}
												className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
												<div className="flex items-center justify-center space-x-2">
													<Star className="w-5 h-5" />
													<span>Write Review</span>
												</div>
											</button>
											<button className="px-4 py-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300">
												<MessageCircle className="w-5 h-5" />
											</button>
										</>
									) : (
										<button className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 px-4 rounded-xl font-medium cursor-not-allowed">
											<div className="flex items-center justify-center space-x-2">
												<Calendar className="w-5 h-5" />
												<span>Reviewed</span>
											</div>
										</button>
									)}
								</div>

								{/* Price Info */}
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
