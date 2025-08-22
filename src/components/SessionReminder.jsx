import React, { useState, useEffect } from "react";
import { X, Clock, Video, MapPin, Bell, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { useQuery } from "@tanstack/react-query";
import { getImageUrl } from "../utils/getImageUrl";
import useAppStore from "../stores/useAppStore";

// Floating Session Reminder
export function FloatingSessionReminder() {
	const [currentSession, setCurrentSession] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);
	const [timeLeft, setTimeLeft] = useState(5);
	const [countdownTimer, setCountdownTimer] = useState(null);

	// Get state from Zustand store
	const { userRole, userData, isAuthenticated, openTestimoniModal } =
		useAppStore();
	const userId = userData?.id;

	// Fetch daftar sesi pelanggan berdasarkan userId
	const {
		data: sessions = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["sessionReminder", userId],
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
		enabled: !!userId && isAuthenticated && userRole === "pelanggan",
		refetchInterval: 30000, // Refetch setiap 30 detik untuk update real-time
	});

	useEffect(() => {
		if (!isAuthenticated || userRole !== "pelanggan") {
			return;
		}

		// Cari sesi yang paling urgent (live, upcoming, atau need review)
		const now = new Date();
		let urgentSession = null;

		for (const session of sessions) {
			// Skip jika sesi sudah direview
			if (session.statusSesi === "reviewed") continue;

			// Jika sesi sedang berlangsung (prioritas tertinggi)
			if (session.statusSesi === "started") {
				urgentSession = {
					...session,
					status: "live",
					minutesUntil: 0,
				};
				break;
			}

			// Jika sesi sudah selesai dan perlu review (prioritas kedua)
			if (session.statusSesi === "end") {
				urgentSession = {
					...session,
					status: "needReview",
					minutesUntil: 0,
				};
				break;
			}

			// Jika sesi akan dimulai (prioritas ketiga)
			if (session.statusSesi === "pending" && session.jadwal_kursus) {
				const sessionDate = new Date(session.jadwal_kursus.tanggal);
				const [hours, minutes] = session.jadwal_kursus.waktu.split(":");
				sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

				const diffMs = sessionDate.getTime() - now.getTime();
				const minutesUntil = Math.floor(diffMs / (1000 * 60));

				// Jika kurang dari 120 menit (2 jam)
				if (minutesUntil <= 120 && minutesUntil > 0) {
					urgentSession = {
						...session,
						status: "upcoming",
						minutesUntil,
					};
					// Jangan break, cari yang lebih urgent dulu
				}
			}
		}

		if (urgentSession && !isDismissed) {
			setCurrentSession(urgentSession);
			setIsVisible(true);
			setTimeLeft(5); // Reset countdown

			// Clear existing timer jika ada
			if (countdownTimer) {
				clearInterval(countdownTimer);
			}

			// Set countdown timer
			const timer = setInterval(() => {
				setTimeLeft((prev) => {
					const newTime = prev - 0.1; // Update setiap 100ms untuk smoothness

					if (newTime <= 0) {
						clearInterval(timer);
						setIsVisible(false);
						setIsDismissed(true);
						return 0;
					}
					return newTime;
				});
			}, 100);

			setCountdownTimer(timer);
		} else {
			setIsVisible(false);
		}

		// Cleanup timer saat dependency berubah
		return () => {
			if (countdownTimer) {
				clearInterval(countdownTimer);
			}
		};
	}, [isAuthenticated, sessions, isDismissed, userRole, userId]);

	// Hanya tampilkan untuk role pelanggan - pindahkan conditional return ke akhir
	if (!isAuthenticated || userRole !== "pelanggan") {
		return null;
	}

	if (!isVisible || !currentSession) return null;

	const handleDismiss = () => {
		// Clear countdown timer jika user manual dismiss
		if (countdownTimer) {
			clearInterval(countdownTimer);
			setCountdownTimer(null);
		}

		setIsVisible(false);
		setIsDismissed(true);
	};

	const handleJoin = () => {
		// Clear timer saat user interact
		if (countdownTimer) {
			clearInterval(countdownTimer);
			setCountdownTimer(null);
		}

		if (currentSession.status === "live") {
			// Handle join live session
			null;
			// window.open("https://meet.google.com/your-meeting-link", "_blank");
		} else if (currentSession.status === "needReview") {
			// Open testimoni modal
			const testimoniData = {
				id: currentSession.id,
				sesi_id: currentSession.id,
				pelanggan_id: userData?.pelanggan?.id,
				mentor_id: currentSession.mentor?.id,
			};
			openTestimoniModal(testimoniData);
			// Dismiss reminder setelah buka modal
			setIsVisible(false);
			setIsDismissed(true);
		} else {
			// Handle view details for upcoming sessions
			console.log("View session details:", currentSession.id);
		}
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 100, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 100, scale: 0.8 }}
					className="fixed bottom-6 right-6 z-50 max-w-sm">
					<div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
						{/* Progress bar untuk countdown */}
						<div className="h-1 bg-gray-200">
							<div
								className={`h-full transition-all ease-linear ${
									currentSession.status === "live"
										? "bg-red-500"
										: currentSession.status === "needReview"
										? "bg-green-500"
										: "bg-blue-500"
								}`}
								style={{
									width: `${Math.max(0, (timeLeft / 5) * 100)}%`,
									transitionDuration: "100ms",
								}}
							/>
						</div>

						{/* Header */}
						<div
							className={`p-4 ${
								currentSession.status === "live"
									? "bg-gradient-to-r from-red-500 to-red-600"
									: currentSession.status === "needReview"
									? "bg-gradient-to-r from-green-500 to-green-600"
									: "bg-gradient-to-r from-blue-500 to-blue-600"
							}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<div
										className={`w-3 h-3 rounded-full ${
											currentSession.status === "live"
												? "bg-white animate-pulse"
												: "bg-white/80"
										}`}></div>
									<span className="text-white font-medium text-sm">
										{currentSession.status === "live"
											? "Sesi Dimulai"
											: currentSession.status === "needReview"
											? "Sesi Selesai"
											: "Sesi Segera Dimulai"}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									{/* Countdown indicator */}
									<span className="text-white/80 text-xs font-medium">
										{Math.ceil(timeLeft)}s
									</span>
									<button
										onClick={handleDismiss}
										className="outline-none focus:outline-none text-white/80 hover:text-white transition-colors">
										<X className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>

						{/* Content */}
						<div className="p-4">
							<div className="flex items-center space-x-3 mb-3">
								<img
									src={getImageUrl(
										currentSession.mentor?.user?.foto_profil,
										"/foto_mentor/default.png"
									)}
									alt={currentSession.mentor?.user?.nama || "Mentor"}
									className="w-10 h-10 rounded-full object-cover"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "/foto_mentor/default.png";
									}}
								/>
								<div>
									<h3 className="font-semibold text-gray-900 text-sm">
										{currentSession.kursus?.namaKursus || "Course"}
									</h3>
									<p className="text-gray-600 text-xs">
										with {currentSession.mentor?.user?.nama || "Mentor"}
									</p>
								</div>
							</div>

							<div className="flex items-center justify-between text-xs text-gray-500 mb-4">
								<span className="flex items-center">
									<Clock className="w-3 h-3 mr-1" />
									{currentSession.jadwal_kursus?.waktu?.slice(0, 5) ||
										"No time"}
								</span>
								<span className="flex items-center">
									{currentSession.jadwal_kursus?.gayaMengajar === "online" ? (
										<Video className="w-3 h-3 mr-1" />
									) : (
										<MapPin className="w-3 h-3 mr-1" />
									)}
									{currentSession.jadwal_kursus?.gayaMengajar || "mode"}
								</span>
								{currentSession.status === "upcoming" && (
									<span className="flex items-center text-orange-600 font-medium">
										<Bell className="w-3 h-3 mr-1" />
										{currentSession.minutesUntil}m left
									</span>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2 mt-3">
								<button
									onClick={handleJoin}
									className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
										currentSession.status === "live"
											? "bg-red-500 hover:bg-red-600 text-white"
											: currentSession.status === "needReview"
											? "bg-green-500 hover:bg-green-600 text-white"
											: "bg-blue-500 hover:bg-blue-600 text-white"
									}`}>
									{currentSession.status === "live"
										? "Segera Bergabung"
										: currentSession.status === "needReview"
										? "Tulis Ulasan"
										: "Lihat Detail"}
								</button>
								<button
									onClick={handleDismiss}
									className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors">
									Later
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Top Banner Notification
export function SessionBanner({ isAuthenticated }) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentSession, setCurrentSession] = useState(null);

	// Get state from Zustand store
	const { userRole, userData, openTestimoniModal } = useAppStore();
	const userId = userData?.id;

	// Hanya tampilkan untuk role pelanggan
	if (!isAuthenticated || userRole !== "pelanggan") {
		return null;
	}

	// Fetch daftar sesi pelanggan berdasarkan userId
	const { data: sessions = [] } = useQuery({
		queryKey: ["sessionBanner", userId],
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
		enabled: !!userId && isAuthenticated && userRole === "pelanggan",
		refetchInterval: 30000, // Refetch setiap 30 detik
	});

	useEffect(() => {
		if (!isAuthenticated || !sessions.length) return;

		// Cari sesi yang sedang live atau need review
		const urgentSession = sessions.find(
			(session) =>
				session.statusSesi === "started" || session.statusSesi === "end"
		);

		if (urgentSession) {
			setCurrentSession(urgentSession);
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [isAuthenticated, sessions]);

	if (!isVisible || !currentSession) return null;

	const handleBannerAction = () => {
		if (currentSession.statusSesi === "started") {
			// Handle join live session
			null;
			// window.open("https://meet.google.com/your-meeting-link", "_blank");
		} else if (currentSession.statusSesi === "end") {
			// Open testimoni modal
			const testimoniData = {
				id: currentSession.id,
				sesi_id: currentSession.id,
				pelanggan_id: userData?.pelanggan?.id,
				mentor_id: currentSession.mentor?.id,
			};
			openTestimoniModal(testimoniData);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			className={`text-white py-3 px-4 ${
				currentSession.statusSesi === "started"
					? "bg-gradient-to-r from-red-500 to-red-600"
					: "bg-gradient-to-r from-green-500 to-green-600"
			}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
						<span className="font-medium">
							{currentSession.statusSesi === "started"
								? "Sesi Dimulai"
								: "Sesi Selesai"}
						</span>
					</div>
					<div className="flex items-center space-x-4 text-sm">
						<span>{currentSession.kursus?.namaKursus || "Course"}</span>
						<span>•</span>
						<span>with {currentSession.mentor?.user?.nama || "Mentor"}</span>
					</div>
				</div>
				<div className="flex items-center space-x-3">
					<button
						onClick={handleBannerAction}
						className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm font-medium transition-colors">
						{currentSession.statusSesi === "started"
							? "Segera Bergabung"
							: "Tulis Ulasan"}
					</button>
					<button
						onClick={() => setIsVisible(false)}
						className="text-white/80 hover:text-white">
						<X className="w-4 h-4" />
					</button>
				</div>
			</div>
		</motion.div>
	);
}

// Navigation Badge Component
export function SessionBadge({ sessionCount = 0 }) {
	if (sessionCount === 0) {
		return null; // Jangan tampilkan badge jika tidak ada sesi
	}

	return (
		<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
			{sessionCount > 99 ? "99+" : sessionCount}
		</div>
	);
}
