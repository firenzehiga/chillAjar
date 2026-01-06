import { useState, useEffect, useRef } from "react";
import { X, Clock, Video, MapPin, Bell, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/utils/getImageUrl";
import useAppStore from "@/stores/useAppStore";
import { usePelangganSessionsQuery } from "@/hooks/useSessions";

// Constants
const AUTO_DISMISS_DURATION = 5; // seconds
const POLL_INTERVAL = 30000; // 30 seconds (via React Query)
const UPCOMING_SESSION_THRESHOLD = 120; // minutes

export function FloatingSessionReminder({ onNavigate }) {
	// Zustand store
	const { userRole, userData, isAuthenticated, openTestimoniModal } = useAppStore();
	const pelangganId = userData?.pelanggan?.id;

	// Component state
	const [currentSession, setCurrentSession] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);
	const [timeLeft, setTimeLeft] = useState(AUTO_DISMISS_DURATION);

	// Refs
	const countdownTimerRef = useRef(null);

	// Fetch sessions data
	const { data: sessions = [] } = usePelangganSessionsQuery(pelangganId);

	// Main effect - find urgent session and manage timer
	useEffect(() => {
		if (!isAuthenticated || userRole !== "pelanggan") {
			return;
		}

		const urgentSession = findUrgentSession(sessions);

		if (urgentSession && !isDismissed) {
			showSession(urgentSession);
		} else {
			hideSession();
		}

		// Cleanup timer on unmount or dependency change
		return () => {
			clearTimer();
		};
	}, [isAuthenticated, sessions, isDismissed, userRole]);

	// Helper: Find the most urgent session
	const findUrgentSession = (sessions) => {
		const now = new Date();

		for (const session of sessions) {
			// Skip reviewed sessions
			if (session.statusSesi === "reviewed") continue;

			// Priority 1: Live session
			if (session.statusSesi === "started") {
				return {
					...session,
					status: "live",
					minutesUntil: 0,
				};
			}

			// Priority 2: Needs review
			if (session.statusSesi === "end") {
				return {
					...session,
					status: "needReview",
					minutesUntil: 0,
				};
			}

			// Priority 3: Upcoming session (within threshold)
			if (session.statusSesi === "pending" && session.jadwal_kursus) {
				const sessionDate = new Date(session.jadwal_kursus.tanggal);
				const [hours, minutes] = session.jadwal_kursus.waktu.split(":");
				sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

				const diffMs = sessionDate.getTime() - now.getTime();
				const minutesUntil = Math.floor(diffMs / (1000 * 60));

				if (minutesUntil <= UPCOMING_SESSION_THRESHOLD && minutesUntil > 0) {
					return {
						...session,
						status: "upcoming",
						minutesUntil,
					};
				}
			}
		}

		return null;
	};

	// Helper: Show session with countdown
	const showSession = (session) => {
		setCurrentSession(session);
		setIsVisible(true);
		setTimeLeft(AUTO_DISMISS_DURATION);

		// Clear existing timer
		clearTimer();

		// Start countdown
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 0.1;

				if (newTime <= 0) {
					clearInterval(timer);
					hideSession();
					setIsDismissed(true);
					return 0;
				}
				return newTime;
			});
		}, 100);

		countdownTimerRef.current = timer;
	};

	// Helper: Hide session
	const hideSession = () => {
		setIsVisible(false);
	};

	// Helper: Clear timer
	const clearTimer = () => {
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
	};

	// Handler: Manual dismiss
	const handleDismiss = () => {
		clearTimer();
		hideSession();
		setIsDismissed(true);
	};

	// Handler: Primary action (Join/Review/View)
	const handlePrimaryAction = () => {
		clearTimer();

		if (currentSession.status === "live") {
			// Handle join live session
			setIsDismissed(true);
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
			hideSession();
			setIsDismissed(true);
		} else {
			// Navigate to session history
			onNavigate("session-history");
			hideSession();
			setIsDismissed(true);
		}
	};

	// Helper: Get status configuration
	const getStatusConfig = (status) => {
		switch (status) {
			case "live":
				return {
					label: "Sesi Dimulai",
					progressColor: "bg-red-500",
					headerGradient: "bg-gradient-to-r from-red-500 to-red-600",
					buttonClass: "bg-red-500 hover:bg-red-600 text-white",
					buttonText: "Oke",
					showPulse: true,
				};
			case "needReview":
				return {
					label: "Sesi Selesai",
					progressColor: "bg-green-500",
					headerGradient: "bg-gradient-to-r from-green-500 to-green-600",
					buttonClass: "bg-green-500 hover:bg-green-600 text-white",
					buttonText: "Tulis Ulasan",
					showPulse: false,
				};
			default: // upcoming
				return {
					label: "Sesi Segera Dimulai",
					progressColor: "bg-chill-blue",
					headerGradient: "bg-gradient-to-r from-blue-500 to-blue-600",
					buttonClass: "bg-chill-blue hover:bg-blue-600 text-white",
					buttonText: "Lihat Detail",
					showPulse: false,
				};
		}
	};

	// Don't render for non-customers
	if (!isAuthenticated || userRole !== "pelanggan") {
		return null;
	}

	if (!isVisible || !currentSession) return null;

	const config = getStatusConfig(currentSession.status);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 100, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 100, scale: 0.8 }}
					className="fixed bottom-6 right-6 z-50 max-w-lg min-w-[320px]">
					<div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
						{/* Progress bar */}
						<div className="h-1 bg-gray-200">
							<div
								className={`h-full transition-all ease-linear ${config.progressColor}`}
								style={{
									width: `${Math.max(0, (timeLeft / AUTO_DISMISS_DURATION) * 100)}%`,
									transitionDuration: "100ms",
								}}
							/>
						</div>

						{/* Header */}
						<div className={`p-4 ${config.headerGradient}`}>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<div
										className={`w-3 h-3 rounded-full ${config.showPulse ? "bg-white animate-pulse" : "bg-white/80"
											}`}
									/>
									<span className="text-white font-medium text-sm">
										{config.label}
									</span>
								</div>
								<div className="flex items-center space-x-2">
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
							{/* Session info */}
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

							{/* Session details */}
							<div className="flex items-center justify-between text-xs text-gray-500 mb-4">
								<span className="flex items-center">
									<Clock className="w-3 h-3 mr-1" />
									{currentSession.jadwal_kursus?.waktu?.slice(0, 5) || "No time"}
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

							{/* Action button */}
							<button
								onClick={handlePrimaryAction}
								className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${config.buttonClass}`}>
								{config.buttonText}
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Top Banner Notification (kept as is, but with consistent patterns)
export function SessionBanner({ isAuthenticated }) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentSession, setCurrentSession] = useState(null);

	const { userRole, userData, openTestimoniModal } = useAppStore();
	const pelangganId = userData?.pelanggan?.id;

	const { data: sessions = [] } = usePelangganSessionsQuery(pelangganId);

	useEffect(() => {
		if (!isAuthenticated || userRole !== "pelanggan" || !sessions.length) {
			return;
		}

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
	}, [isAuthenticated, sessions, userRole]);

	if (!isAuthenticated || userRole !== "pelanggan") {
		return null;
	}

	if (!isVisible || !currentSession) return null;

	const handleBannerAction = () => {
		if (currentSession.statusSesi === "started") {
			// Handle join live session
		} else if (currentSession.statusSesi === "end") {
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
			className={`text-white py-3 px-4 ${currentSession.statusSesi === "started"
					? "bg-gradient-to-r from-red-500 to-red-600"
					: "bg-gradient-to-r from-green-500 to-green-600"
				}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
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
		return null;
	}

	return (
		<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
			{sessionCount > 99 ? "99+" : sessionCount}
		</div>
	);
}
