import { Users, Laptop, Building, FileQuestion } from "lucide-react";
import { getImageUrl } from "../utils/getImageUrl";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
export function CourseCard({ course, onClick }) {
	const formatMentorName = (name) => {
		if (!name) return "";
		const parts = name.trim().split(/\s+/);
		if (parts.length <= 2) return name;
		const lastTwo = parts.slice(-2);
		const initials = parts
			.slice(0, -2)
			.map((p) => p[0].toUpperCase() + ".")
			.join(" ");
		return `${initials} ${lastTwo.join(" ")}`;
	};
	return (
		<div
			onClick={() => onClick(course)}
			className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group mb-8">
			<div className="relative overflow-hidden">
				<AsyncImage
					loading="lazy"
					Transition={Fade}
					loader={<div className="w-full h-48 bg-gray-300 animate-pulse"></div>}
					src={getImageUrl(course.courseImage)}
					alt={course.courseName}
					className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
					onError={(e) => {
						e.target.onerror = null;
						e.target.src = "/foto_kursus/default.jpg";
					}}
				/>
				{/* Avatar mentor utama */}
				{course.mentor && course.mentor.user && (
					<AsyncImage
						src={getImageUrl(course.mentor.user.foto_profil)}
						alt={course.mentor.user.nama || "Mentor"}
						className="absolute bottom-2 left-2 w-10 h-10 rounded-full border-2 border-white shadow object-cover bg-white"
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
			<div className="p-5">
				<h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-800 transition-colors duration-300">
					{course.courseName}
				</h3>
				<p className="text-gray-800 text-sm mb-4 line-clamp-2">
					{course.courseDescription}
				</p>
				{/* [gayaMengajar JADWAL ONLY] Refactor: Badge/label mode belajar kini hanya berdasarkan jadwal_kursus, bukan course.learnMethod. */}
				<div className="flex items-center justify-between text-sm text-gray-500">
					<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
						{/* Ambil semua mode unik dari jadwal_kursus */}
						{(() => {
							const schedules = course.jadwal_kursus || [];
							if (!schedules.length) {
								return (
									<div className="flex items-center text-gray-600">
										<FileQuestion className="w-4 h-4 mr-1" />
										Jadwal belum tersedia
									</div>
								);
							}
							// Ambil semua mode valid (online/offline) dari jadwal_kursus
							const validModes = Array.from(
								new Set(
									schedules
										.map((j) => j.gayaMengajar)
										.filter((m) => m === "online" || m === "offline")
								)
							);
							if (!validModes.length) {
								return (
									<>
										<FileQuestion className="w-4 h-4 mr-1 text-blue-800" />
										Tidak ada jadwal dengan mode valid
									</>
								);
							}
							// Tampilkan semua mode valid sebagai badge
							return validModes.map((mode) => (
								<span key={mode} className="flex items-center mr-2">
									{mode === "online" ? (
										<Laptop className="w-4 h-4 mr-1 text-blue-800" />
									) : (
										<Building className="w-4 h-4 mr-1 text-blue-800" />
									)}
									{mode === "online" ? "Online" : "Offline"}
								</span>
							));
						})()}
					</span>
					<span className="flex items-center transform transition-transform duration-300 hover:scale-105 hover:text-blue-800">
						<Users className="w-4 h-4 mr-1 text-blue-800" />
						{formatMentorName(course?.mentorName)}
					</span>
				</div>
			</div>
		</div>
	);
}
