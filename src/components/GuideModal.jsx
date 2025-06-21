import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
	{
		title: "Cari Kursus/Mentor",
		desc: "Jelajahi daftar kursus atau mentor yang tersedia sesuai kebutuhanmu.",
		icon: (
			<span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<circle cx="11" cy="11" r="8" />
					<path d="M21 21l-4.35-4.35" />
				</svg>
			</span>
		),
	},
	{
		title: "Klik Pesan/Booking",
		desc: "Pilih kursus/mentor lalu klik tombol 'Pesan' atau 'Booking'.",
		icon: (
			<span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<path d="M12 8v4l3 3" />
					<circle cx="12" cy="12" r="10" />
				</svg>
			</span>
		),
	},
	{
		title: "Pilih Jadwal & Metode",
		desc: "Tentukan jadwal dan pilih metode belajar (online/offline).",
		icon: (
			<span className="bg-yellow-100 text-yellow-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<rect x="3" y="4" width="18" height="18" rx="2" />
					<path d="M16 2v4M8 2v4M3 10h18" />
				</svg>
			</span>
		),
	},
	{
		title: "Konfirmasi & Bayar",
		desc: "Konfirmasi pemesanan dan lakukan pembayaran sesuai instruksi.",
		icon: (
			<span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<path d="M12 8v4l3 3" />
					<circle cx="12" cy="12" r="10" />
				</svg>
			</span>
		),
	},
	{
		title: "Upload Bukti Pembayaran",
		desc: "Unggah bukti pembayaran jika diperlukan pada halaman transaksi.",
		icon: (
			<span className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<path d="M12 16v-8m0 0l-4 4m4-4l4 4" />
					<rect x="4" y="4" width="16" height="16" rx="2" />
				</svg>
			</span>
		),
	},
	{
		title: "Tunggu Verifikasi",
		desc: "Admin/mentor akan memverifikasi pembayaran dan pemesananmu.",
		icon: (
			<span className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<path d="M12 8v4l3 3" />
					<circle cx="12" cy="12" r="10" />
				</svg>
			</span>
		),
	},
	{
		title: "Mulai Sesi Belajar",
		desc: "Setelah terverifikasi, tunggu mentor kamu untuk memulai sesi belajar",
		icon: (
			<span className="bg-teal-100 text-teal-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					viewBox="0 0 24 24">
					<path d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</span>
		),
	},
];

export function GuideModal({ show, onClose }) {
	return (
		<AnimatePresence>
			{show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<motion.div
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 40, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="relative bg-white rounded-2xl shadow-2xl p-0 max-h-[90vh] overflow-y-auto w-full max-w-[95vw] sm:max-w-lg mx-2">
						{/* Tombol Tutup di pojok kanan atas */}
						<button
							className="absolute top-3 right-3 bg-white border border-gray-200 shadow px-3 py-1.5 rounded-full font-semibold text-gray-600 hover:text-red-500 transition focus:outline-none z-10"
							onClick={onClose}
							style={{ minWidth: 60 }}>
							Tutup
						</button>

						{/* Header & Illustration */}
						<div className="bg-gradient-to-r from-yellow-300 via-yellow-300 to-yellow-100 px-4 sm:px-8 pt-8 pb-4 flex flex-col items-center">
							<span className="mb-2">
								<svg width="60" height="60" viewBox="0 0 60 60" fill="none">
									<circle cx="30" cy="30" r="30" fill="#FDE68A" />
									<text
										x="50%"
										y="54%"
										textAnchor="middle"
										fill="#F59E42"
										fontSize="36"
										fontWeight="bold"
										dy=".3em">
										?
									</text>
								</svg>
							</span>
							<h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
								Langkah Pemesanan
							</h2>
							<p className="text-sm text-gray-600 text-center mb-2">
								Ikuti langkah berikut untuk memesan kursus atau sesi belajar di
								ChillAjar.
							</p>
						</div>

						{/* Stepper/Langkah-langkah */}
						<div className="px-4 sm:px-8 py-6">
							<ol className="space-y-4">
								{steps.map((step, idx) => (
									<li key={idx} className="flex items-start">
										{step.icon}
										<div>
											<div className="font-semibold text-gray-800">
												{idx + 1}. {step.title}
											</div>
											<div className="text-xs text-gray-500">{step.desc}</div>
										</div>
									</li>
								))}
							</ol>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
