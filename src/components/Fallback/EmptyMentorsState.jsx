import React from "react";
import { Users, MessageSquare, ArrowLeft, Book } from "lucide-react";

export function EmptyMentorsState({ context = "mentors" }) {
	const getContent = () => {
		switch (context) {
			case "courses":
				return {
					icon: <Book className="w-16 h-16 text-gray-400" />,
					title: "Kursus Sedang Tidak Tersedia",
					description:
						"Saat ini belum ada mentor aktif untuk kursus ini. Tim kami sedang mencari mentor terbaik untuk Anda.",
					actionText: "Lihat Kursus Lain",
					actionHandler: () => onNavigate("courses"),
				};
			case "mentors":
				return {
					icon: <Users className="w-16 h-16 text-gray-400" />,
					title: "Mentor Sedang Tidak Tersedia",
					description:
						"Saat ini semua mentor sedang tidak aktif. Tim kami sedang bekerja untuk menyediakan mentor terbaik.",
					actionText: "Lihat Kursus",
					actionHandler: () => onNavigate("courses"),
				};
			default:
				return {
					icon: <Users className="w-16 h-16 text-gray-400" />,
					title: "Tidak Ada Mentor",
					description: "Belum ada mentor yang tersedia saat ini.",
					actionText: "Kembali",
					actionHandler: () => onNavigate("home"),
				};
		}
	};

	const { icon, title, description, actionText, actionHandler } = getContent();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			<div className="text-center max-w-md">
				{/* Icon */}
				<div className="flex justify-center mb-6">{icon}</div>

				{/* Title */}
				<h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>

				{/* Description */}
				<p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					{/* Contact Support Button */}
					<a
						href="https://wa.me/6283871417229?text=Halo%20admin%2C%20saya%20ingin%20menanyakan%20tentang%20ketersediaan%20mentor"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
						<MessageSquare className="w-5 h-5 mr-2" />
						Hubungi Admin
					</a>
				</div>

				{/* Additional Info */}
				<div className="mt-8 p-4 bg-blue-50 rounded-lg">
					<p className="text-sm text-blue-800">
						💡 <strong>Tips:</strong> Anda bisa mendaftar akun dulu atau
						menunggu update dari admin tentang ketersediaan mentor baru.
					</p>
				</div>
			</div>
		</div>
	);
}
