import { useState, useEffect, useRef } from "react";
import { X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "@/stores/useAppStore";
import api from "@/api";

// Constants
const AUTO_DISMISS_DURATION = 5; // seconds
const POLL_INTERVAL = 30000; // 30 seconds

export default function TransactionReminder() {
	// Zustand store
	const { isAuthenticated, userRole, userData, setCurrentPage } = useAppStore();
	const pelangganId = userData?.pelanggan?.id;

	// Component state
	const [pendingTransaction, setPendingTransaction] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);
	const [timeLeft, setTimeLeft] = useState(AUTO_DISMISS_DURATION);

	// Refs
	const countdownTimerRef = useRef(null);
	const acceptedShownRef = useRef(new Set());

	// Main effect - fetch transactions and manage timer
	useEffect(() => {
		if (!isAuthenticated || userRole !== "pelanggan" || !pelangganId) {
			return;
		}

		let mounted = true;

		const checkForPendingTransactions = async () => {
			try {
				const res = await api.get("/transaksi");
				if (!mounted) return;

				const allTransactions = Array.isArray(res.data) ? res.data : [];
				const urgentTransaction = findUrgentTransaction(
					allTransactions,
					pelangganId
				);

				if (urgentTransaction && !isDismissed) {
					showTransaction(urgentTransaction);
				} else {
					hideTransaction();
				}
			} catch (error) {
				// Network error - keep UI invisible
				if (mounted) {
					hideTransaction();
				}
			}
		};

		checkForPendingTransactions();
		const interval = setInterval(checkForPendingTransactions, POLL_INTERVAL);

		return () => {
			mounted = false;
			clearInterval(interval);
			clearTimer();
		};
	}, [isAuthenticated, userRole, pelangganId, isDismissed]);

	// Helper: Find the most urgent transaction
	const findUrgentTransaction = (transactions, pelangganId) => {
		return transactions.find(
			(tx) =>
				String(tx.pelanggan_id) === String(pelangganId) &&
				["menunggu_verifikasi", "waiting_verification", "rejected", "accepted"].includes(
					tx.statusPembayaran
				)
		);
	};

	// Helper: Show transaction with countdown
	const showTransaction = (transaction) => {
		const status = transaction.statusPembayaran;
		const txId = String(transaction.id);

		// Skip if "accepted" was already shown
		if (status === "accepted" && acceptedShownRef.current.has(txId)) {
			hideTransaction();
			return;
		}

		setPendingTransaction(transaction);
		setIsVisible(true);
		setTimeLeft(AUTO_DISMISS_DURATION);

		// Mark "accepted" as shown
		if (status === "accepted") {
			acceptedShownRef.current.add(txId);
		}

		// Clear existing timer
		clearTimer();

		// Start countdown
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 0.1;

				if (newTime <= 0) {
					clearInterval(timer);
					hideTransaction();
					setIsDismissed(true);
					return 0;
				}
				return newTime;
			});
		}, 100);

		countdownTimerRef.current = timer;
	};

	// Helper: Hide transaction
	const hideTransaction = () => {
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
		hideTransaction();
		setIsDismissed(true);
	};

	// Handler: View transaction
	const handleViewTransaction = () => {
		clearTimer();
		setCurrentPage("transaction-history");
		window.history.pushState({}, "", "/transaction-history");
		hideTransaction();
		setIsDismissed(true);
	};

	// Helper: Get status configuration
	const getStatusConfig = (status) => {
		const statusLower = (status || "").toString().toLowerCase();

		if (statusLower.includes("accepted")) {
			return {
				title: "Pembayaran Diterima",
				message: "Pembayaran Anda telah diterima. Sesi akan dikonfirmasi segera.",
				badgeClass: "bg-green-100 text-green-800",
				badgeText: "Diterima",
				progressColor: "bg-green-500",
				headerGradient: "bg-gradient-to-r from-green-500 to-green-600",
			};
		}

		if (statusLower.includes("rejected")) {
			return {
				title: "Pembayaran Ditolak",
				message:
					"Bukti pembayaran Anda ditolak. Silakan unggah ulang bukti pembayaran yang valid.",
				badgeClass: "bg-red-100 text-red-800",
				badgeText: "Ditolak",
				progressColor: "bg-red-500",
				headerGradient: "bg-gradient-to-r from-red-500 to-red-600",
			};
		}

		// Default: menunggu_verifikasi
		return {
			title: "Pembayaran Sedang Diverifikasi",
			message: "Kami sedang memeriksa bukti pembayaran Anda. Proses ini biasanya singkat.",
			badgeClass: "bg-yellow-100 text-yellow-800",
			badgeText: "Menunggu Verifikasi",
			progressColor: "bg-yellow-500",
			headerGradient: "bg-gradient-to-r from-yellow-500 to-yellow-600",
		};
	};

	// Don't render for non-customers
	if (!isAuthenticated || userRole !== "pelanggan") {
		return null;
	}

	if (!isVisible || !pendingTransaction) return null;

	const config = getStatusConfig(pendingTransaction.statusPembayaran);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -100, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -100, scale: 0.8 }}
					className="fixed top-6 right-6 z-50 max-w-md min-w-[320px]">
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
									<AlertCircle className="w-4 h-4 text-white" />
									<span className="text-white font-medium text-sm">
										Notifikasi Transaksi
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
							{/* Status info */}
							<div className="mb-3">
								<div className="flex items-center gap-2 mb-2">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.badgeClass}`}>
										{config.badgeText}
									</span>
									<span className="text-sm font-semibold text-gray-900">
										{config.title}
									</span>
								</div>
								<p className="text-xs text-gray-600 leading-relaxed">
									{config.message}
								</p>
							</div>

							{/* Action buttons */}
							<div className="flex gap-2">
								<button
									onClick={handleViewTransaction}
									className="flex-1 py-2 px-3 bg-chill-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">
									Lihat Transaksi
								</button>
								<a
									href={`https://wa.me/6283871417229?text=${encodeURIComponent(
										`Halo admin, saya butuh bantuan verifikasi pembayaran. ID transaksi: ${pendingTransaction.id}`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">
									<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.18 1.6 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
									</svg>
									<span>WA</span>
								</a>
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
