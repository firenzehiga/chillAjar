import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAppStore from "@/stores/useAppStore";
import api from "@/api";

export default function TransactionReminder() {
	const { isAuthenticated, userRole, setCurrentPage } = useAppStore();
	const [pendingTx, setPendingTx] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [txStatus, setTxStatus] = useState(null);
	const [snoozedUntil, setSnoozedUntil] = useState(0);

	const acceptedShownRef = React.useRef(null);
	const acceptedTimeoutRef = React.useRef(null);
	useEffect(() => {
		if (!isAuthenticated || userRole !== "pelanggan") return;

		const pelangganId = useAppStore.getState().userData?.pelanggan?.id;
		if (!pelangganId) return;

		let mounted = true;
		const checkForPendingTransactions = async () => {
			try {
				const res = await api.get("/transaksi");
				if (!mounted) return;
				const allTx = Array.isArray(res.data) ? res.data : [];
				// prefer waiting_verification, then rejected, then accepted
				const myPending = allTx.find(
					(t) =>
						String(t.pelanggan_id) === String(pelangganId) &&
						[
							"menunggu_verifikasi",
							"waiting_verification",
							"rejected",
							"accepted",
						].includes(t.statusPembayaran)
				);

				if (myPending) {
					const status = myPending.statusPembayaran ?? myPending.status ?? null;
					// accepted: show once then auto-hide
					if (status === "accepted") {
						if (acceptedShownRef.current === String(myPending.id)) {
							// already shown
							setPendingTx(null);
							setIsVisible(false);
							setTxStatus(null);
							return;
						}
						// show accepted briefly
						setPendingTx(myPending);
						setTxStatus(status);
						setIsVisible(true);
						acceptedShownRef.current = String(myPending.id);
						if (acceptedTimeoutRef.current)
							clearTimeout(acceptedTimeoutRef.current);
						acceptedTimeoutRef.current = setTimeout(() => {
							if (!mounted) return;
							setIsVisible(false);
							setPendingTx(null);
							setTxStatus(null);
						}, 6000);
						return;
					}

					// rejected: always show (unless snoozed)
					if (status === "rejected") {
						if (Date.now() < snoozedUntil) {
							setPendingTx(null);
							setIsVisible(false);
							return;
						}
						setPendingTx(myPending);
						setTxStatus(status);
						setIsVisible(true);
						return;
					}

					// default: menunggu_verifikasi
					if (Date.now() < snoozedUntil) {
						setPendingTx(null);
						setIsVisible(false);
						return;
					}

					setPendingTx(myPending);
					setTxStatus(status);
					setIsVisible(true);
				} else {
					setPendingTx(null);
					setTxStatus(null);
					setIsVisible(false);
				}
			} catch (err) {
				// network error — don't collapse the UI; keep invisible
				if (!mounted) return;
				setIsVisible(false);
			}
		};

		checkForPendingTransactions();
		const interval = setInterval(checkForPendingTransactions, 30_000);
		return () => {
			mounted = false;
			clearInterval(interval);
		};
	}, [isAuthenticated, userRole, snoozedUntil]);

	if (!isVisible || !pendingTx) return null;

	const handleOpenTransactions = () => {
		// navigate to transaction page; reminder will be managed by backend polling
		setCurrentPage("transaction-history");
		try {
			window.history.pushState({}, "", "/transaction-history");
		} catch (e) {}
		// hide UI for now; backend check will re-show if still pending
		setIsVisible(false);
	};

	const handleDismiss = () => {
		// snooze reminder for 30 minutes so user can dismiss briefly
		setSnoozedUntil(Date.now() + 30 * 60 * 1000);
		setIsVisible(false);
	};

	function getStatusMeta(status) {
		const s = (status || "").toString().toLowerCase();
		const defaults = {
			messageTitle: "Ada Transaksi yang Menunggu Verifikasi",
			messageBody:
				"Kamu memiliki transaksi yang belum selesai. Silakan cek Riwayat Transaksi untuk langkah selanjutnya atau hubungi kami jika butuh bantuan.",
			badgeClass: "bg-gray-100 text-gray-800",
			badgeText: "Status",
		};

		if (s.includes("accepted")) {
			return {
				messageTitle: "Pembayaran Diterima",
				messageBody:
					"Pembayaran Anda telah diterima. Sesi akan dikonfirmasi segera. Lihat Riwayat Transaksi untuk detail.",
				badgeClass: "bg-green-100 text-green-800",
				badgeText: "Diterima",
			};
		}

		if (s.includes("rejected")) {
			return {
				messageTitle: "Pembayaran Ditolak",
				messageBody:
					"Bukti pembayaran Anda ditolak. Silakan unggah ulang bukti pembayaran melalui Riwayat Transaksi atau hubungi kami via WhatsApp.",
				badgeClass: "bg-red-100 text-red-800",
				badgeText: "Ditolak",
			};
		}

		if (s.includes("menunggu_verifikasi")) {
			return {
				messageTitle: "Pembayaran Sedang Diverifikasi",
				messageBody:
					"Kami sedang memeriksa bukti pembayaran Anda. Proses ini biasanya singkat. Jika perlu bantuan, hubungi kami via WhatsApp.",
				badgeClass: "bg-yellow-100 text-yellow-800",
				badgeText: "Menunggu Verifikasi",
			};
		}

		return defaults;
	}

	const { messageTitle, messageBody, badgeClass, badgeText } =
		getStatusMeta(txStatus);
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 40 }}
					className="fixed top-6 right-6 z-50 max-w-sm">
					<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
						<div className="p-4">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										{/* Status badge */}
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>
											{badgeText}
										</span>

										{/* Title */}
										<span className="text-sm font-medium text-gray-900">
											{messageTitle}
										</span>
									</div>

									{/* <div className="text-xs text-gray-500">
                                        Transaksi: {pendingTx.id}
                                    </div> */}
									<div className="mt-2 text-xs text-gray-600 leading-5">
										{messageBody}
									</div>
								</div>
								<button
									onClick={handleDismiss}
									className="text-gray-400 hover:text-gray-600 ml-3">
									<X className="w-4 h-4" />
								</button>
							</div>

							<div className="mt-3 flex gap-2">
								<button
									onClick={handleOpenTransactions}
									className="px-3 py-1 rounded-md text-xs font-medium bg-chill-blue hover:bg-blue-600 text-white">
									Lihat Transaksi
								</button>
								<a
									href={`https://wa.me/6283871417229?text=${encodeURIComponent(
										`Halo admin, saya butuh bantuan verifikasi pembayaran. ID transaksi: ${pendingTx.id}`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium">
									<svg
										className="w-3 h-3"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.18 1.6 6.01L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.24-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
									</svg>
									<span>Hubungi WA</span>
								</a>
								{/* <button
                                    onClick={handleDismiss}
                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-xs font-medium">
                                    Tutup
                                </button> */}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
