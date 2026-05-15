import {
	FileQuestion,
	UserCircleIcon,
	CalendarOff,
	User,
	Maximize2,
	X,
} from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "../utils/getImageUrl";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
export function CourseCard({ course, onClick }) {
	const [expanded, setExpanded] = useState(false);
	const [showImagePreview, setShowImagePreview] = useState(false);
	const formatMentorName = (name) => {
		if (!name) return "";
		const parts = name.trim().split(/\s+/);
		if (parts.length <= 2) return parts.join(" ");
		const lastInitial = parts[parts.length - 1][0].toUpperCase() + ".";
		const firstParts = parts.slice(0, -1).join(" ");
		return `${firstParts} ${lastInitial}`;
	};
	return (
		<>
			<div
				onClick={() => onClick(course)}
				className="bg-gray-50 rounded-xl shadow-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl cursor-pointer group mb-8 flex flex-col h-full">
				<div className="relative overflow-hidden">
					<AsyncImage
						loading="lazy"
						Transition={Fade}
						loader={
							<div className="w-full h-48 bg-gray-300 animate-pulse"></div>
						}
						src={getImageUrl(course.courseImage)}
						alt={course.courseName}
						className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "/foto_kursus/default.jpg";
						}}
					/>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setShowImagePreview(true);
						}}
						className="absolute top-2 right-2 rounded-full bg-white/50 p-2 text-gray-700 shadow-sm backdrop-blur opacity-0 transition-opacity duration-200 hover:bg-white/60 group-hover:opacity-100"
						aria-label="Perbesar gambar">
						<Maximize2 className="h-4 w-4" />
					</button>
					{/* Avatar mentor utama */}
					{course.mentor && course.mentor.user && (
						<AsyncImage
							src={getImageUrl(course.mentor.user.foto_profil)}
							alt={course.mentor.user.nama || "Mentor"}
							className="absolute bottom-2 left-2 w-12 h-12 rounded-full border-2 border-chill-blue shadow object-fill bg-white"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/foto_mentor/default.png";
							}}
						/>
					)}
					{/* <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105">
					Mulai dari Rp{course.price_per_hour.toLocaleString("id-ID")}/sesi
				</div> */}
					{/* Harga dihilangkan karena sekarang ada di paket */}
				</div>
				<div className="p-3 flex flex-col flex-1">
					<h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
						{course.courseName}
					</h3>
					{/* Description with collapse/expand */}
					<div className="mb-1">
						<p
							className={`text-gray-800 text-sm mb-2 transition-all duration-200 text-justify ${
								expanded ? "" : "line-clamp-3"
							}`}
							aria-expanded={expanded}>
							{course.courseDescription}
						</p>
						{/* Show toggle when description is long */}
						{course.courseDescription &&
							course.courseDescription.length > 160 && (
								<div className="flex justify-end">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setExpanded((s) => !s);
										}}
										className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer focus:outline-none"
										aria-controls="course-desc"
										aria-expanded={expanded}>
										{expanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
									</button>
								</div>
							)}
					</div>
					{/* [gayaMengajar JADWAL ONLY] Refactor: Badge/label mode belajar kini hanya berdasarkan jadwal_kursus, bukan course.learnMethod. */}
					<div className="mt-auto flex items-center justify-between text-sm text-gray-500">
						<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
							<UserCircleIcon className="w-4 h-4 mr-1 text-blue-800" />
							{formatMentorName(course?.mentorName)}
						</span>
						<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
							{/* Ambil semua mode unik dari jadwal_kursus */}
							{(() => {
								const schedules = course.jadwal_kursus || [];
								if (!schedules.length) {
									return (
										<div className="flex items-center text-gray-600">
											<CalendarOff className="w-4 h-4 mr-1" />
											Jadwal belum tersedia
										</div>
									);
								}
								// Ambil semua mode valid (online/offline) dari jadwal_kursus
								const validModes = Array.from(
									new Set(
										schedules
											.map((j) => j.gayaMengajar)
											.filter((m) => m === "online" || m === "offline"),
									),
								);
								if (!validModes.length) {
									return (
										<>
											<FileQuestion className="w-4 h-4 mr-1 text-blue-800" />
											Tidak ada jadwal dengan mode valid
										</>
									);
								}
								// Gantikan badge dengan tombol kecil "Pilih Mentor" (inline)
								return (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											onClick && onClick(course);
										}}
										disabled={validModes.length === 0}
										className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all transform focus:outline-none ${
											validModes.length > 0
												? "bg-gradient-to-r shadow-lg shadow-blue-600/25 from-blue-500 to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}>
										<User className="w-4 h-4" />
										Pilih Mentor
									</button>
								);
							})()}
						</span>
					</div>
				</div>
			</div>
			{showImagePreview && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
					onClick={() => setShowImagePreview(false)}
					role="dialog"
					aria-modal="true">
					<div
						className="relative w-full max-w-3xl"
						onClick={(e) => e.stopPropagation()}>
						<button
							type="button"
							onClick={() => setShowImagePreview(false)}
							className="absolute top-2 right-2 z-10 rounded-full bg-white p-2 text-gray-600 shadow hover:bg-gray-100"
							aria-label="Tutup">
							<X className="h-4 w-4" />
						</button>
						<div className="w-full max-h-[80vh] aspect-[16/9] rounded-2xl overflow-hidden bg-white">
							<AsyncImage
								Transition={Fade}
								loader={
									<div className="w-full h-full bg-gray-200 animate-pulse" />
								}
								src={getImageUrl(course.courseImage)}
								alt={course.courseName}
								className="w-full h-full object-contain"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_kursus/default.jpg";
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
