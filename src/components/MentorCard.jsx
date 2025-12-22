import { useState, useEffect } from "react";
import {
	Star,
	MapPinIcon,
	Monitor,
	MonitorX,
	CalendarX,
	AlertCircle,
	Lightbulb,
	BookOpen,
} from "lucide-react";
import { CourseSelectionModal } from "./CourseSelectionModal";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
import useAppStore from "@/stores/useAppStore";
import { FaWhatsapp } from "react-icons/fa";
export function MentorCard({
	mentor,
	onSchedule,
	onCoursePackageSelect, // New prop for package selection
	selectedCourse = null,
	resetCourseSelection,
}) {
	const { setShowBookingModal, setShowPayment } = useAppStore();
	const [showCourseModal, setShowCourseModal] = useState(false);
	const [selectedMentorCourse, setSelectedMentorCourse] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [modeError, setModeError] = useState("");

	useEffect(() => {
		setSelectedMentorCourse(null);
	}, [resetCourseSelection]);

	// --- Perubahan: Ambil semua mode valid dari jadwal, bukan dari course level ---
	const allSchedules = (mentor.courses || []).flatMap((c) => c.schedules || []);
	// Hanya ambil gayaMengajar yang valid (online/offline) dari semua jadwal
	const validModes = Array.from(
		new Set(
			allSchedules
				.map((s) => s.gayaMengajar)
				.filter((m) => m === "online" || m === "offline")
		)
	);

	// --- Perubahan: Validasi jika tidak ada jadwal dengan gayaMengajar valid ---
	useEffect(() => {
		if (allSchedules.length === 0 || validModes.length === 0) {
			setModeError("Mentor belum memiliki jadwal.");
		} else {
			setModeError("");
		}
	}, [mentor]);

	const handleScheduleClick = () => {
		if (selectedCourse) {
			onSchedule(mentor, selectedCourse);
		} else if (mentor.courses) {
			setShowCourseModal(true);
		}
	};

	const handleCourseSelect = (course) => {
		setSelectedMentorCourse(course);
	};

	const handleConfirmCourse = () => {
		if (selectedMentorCourse) {
			setShowCourseModal(false);
			// Use package selection flow instead of direct scheduling
			if (onCoursePackageSelect) {
				onCoursePackageSelect(selectedMentorCourse);
			} else {
				// Fallback to old behavior if no package selection handler
				onSchedule(mentor, selectedMentorCourse);
			}
		}
	};

	const handleCloseCourseModal = () => {
		setShowCourseModal(false);
		setSelectedMentorCourse(null);
	};

	const buttonText = selectedCourse ? "Pesan Kursus" : "Pilih Kursus";

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
		<>
			<style>{`
				@keyframes floaty { 0% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-8px) rotate(3deg); } 100% { transform: translateY(0) rotate(6deg); } }
				@keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
				.deco-float { animation: floaty 3.8s ease-in-out infinite; }
				.deco-pop { animation: pop 2.6s ease-in-out infinite; }
			`}</style>
			<div className="group relative bg-gray-50 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
				{/* small ribbon to match app theme */}
				<div className="absolute top-4 left-4 bg-white/90 text-xs font-semibold text-blue-700 px-2 py-1 rounded-md shadow-sm">
					ChillAjar
				</div>
				<div className="relative">
					<div className="h-36 bg-gradient-to-r from-indigo-500 to-blue-500 relative overflow-hidden">
						{/* wave decoration */}
						<svg
							className="absolute left-0 bottom-0 w-full h-16 text-white/40 opacity-40"
							viewBox="0 0 1440 320"
							preserveAspectRatio="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fill="currentColor"
								d="M0,192L48,170.7C96,149,192,107,288,96C384,85,480,107,576,112C672,117,768,107,864,106.7C960,107,1056,117,1152,133.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
							/>
						</svg>
						<svg
							className="absolute right-6 top-6 w-20 h-20 opacity-20"
							viewBox="0 0 100 100"
							xmlns="http://www.w3.org/2000/svg">
							<circle cx="20" cy="20" r="6" fill="white" />
							<circle cx="50" cy="40" r="4" fill="white" />
							<circle cx="80" cy="25" r="5" fill="white" />
						</svg>

						{/* decorative icon (mentoring theme) */}
						<Lightbulb className="absolute left-20 top-6 w-16 h-16 text-white opacity-20 transform rotate-6 deco-float transition-transform duration-500 group-hover:translate-y-1 group-hover:rotate-3" />
					</div>
					<div className="absolute -bottom-14 left-6">
						<div className="rounded-full p-1 bg-gradient-to-r from-indigo-500 to-blue-500">
							<AsyncImage
								Transition={Fade}
								src={mentor.mentorImage}
								alt={mentor.mentorName}
								className="w-24 h-24 rounded-full shadow-lg object-cover object-center"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_mentor/default.png";
								}}
							/>
						</div>
					</div>
				</div>

				<div className="pt-14 px-6 pb-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-xl font-bold text-gray-900">
								{formatMentorName(mentor.mentorName) || "Mentor"}
							</h3>
							<div className="flex items-center text-yellow-400 mt-1">
								<Star className="w-4 h-4 fill-current" />
								<span className="ml-1 text-sm">
									{/*
										Pastikan rating bertipe number dan valid sebelum menggunakan .toFixed(1).
										Ini penting karena data dari backend/public API bisa saja null, string, atau NaN.
										Jika rating tidak valid, tampilkan 0.0 agar UI tetap aman di semua environment.
									*/}
									{typeof mentor.mentorRating === "number" &&
									!isNaN(mentor.mentorRating)
										? mentor.mentorRating.toFixed(1)
										: Number(mentor.mentorRating) &&
										  !isNaN(Number(mentor.mentorRating))
										? Number(mentor.mentorRating).toFixed(1)
										: "0.0"}
								</span>
							</div>
						</div>
						<a
							onClick={() => setShowDetails(!showDetails)}
							className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
							{showDetails ? "Tutup" : "Lihat Detail"}
						</a>
					</div>

					{/* Show badges for all unique valid modes from schedules */}
					<div className="flex flex-wrap gap-2 mb-4">
						{/* --- Perubahan: Badge hanya dari mode valid hasil agregasi jadwal --- */}
						{validModes.length > 0 ? (
							validModes.map((mode) => (
								<span
									key={mode}
									className={`text-xs px-3 py-1 rounded-full font-medium ${
										mode === "online"
											? "bg-blue-50 text-blue-700"
											: mode === "offline"
											? "bg-red-50 text-red-700"
											: "bg-gray-100 text-gray-700"
									}`}>
									{mode === "online" ? "Online" : "Offline"}
								</span>
							))
						) : (
							<span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
								Metode mengajar belum tersedia
							</span>
						)}
					</div>

					{/* --- Perubahan: Tampilkan error jika tidak ada mode valid --- */}
					{modeError && (
						<div className="mb-2 flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 rounded p-2">
							<AlertCircle className="w-3 h-3" />
							<span>{modeError}</span>
						</div>
					)}

					{showDetails && (
						<div className="mt-4 space-y-4 border-t pt-4">
							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">Tentang Mentor</h4>
								<p className="text-gray-600 text-sm line-clamp-4">
									{mentor.mentorAbout}
								</p>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">
									Lokasi &amp; Ketersediaan
								</h4>
								<div className="space-y-2">
									{/* --- Perubahan: Lokasi hanya dari jadwal offline valid --- */}
									{(() => {
										const offlineSchedules = allSchedules.filter(
											(s) => s.gayaMengajar === "offline" && s.tempat
										);
										const uniqueLocations = [
											...new Set(offlineSchedules.map((s) => s.tempat)),
										];
										return uniqueLocations.length > 0 ? (
											uniqueLocations.map((location) => (
												<div key={location} className="">
													<div className="flex items-center text-gray-600">
														<MapPinIcon className="w-4 h-4 mr-2 text-blue-600" />
														<span className="text-sm">{location}</span>
													</div>
												</div>
											))
										) : (
											<div className="flex items-center text-gray-600">
												<CalendarX className="w-4 h-4 mr-2 text-gray-400" />
												<span className="text-gray-500 text-sm">
													Sesi offline belum tersedia
												</span>
											</div>
										);
									})()}
									{/* --- Perubahan: Status online hanya dari mode valid --- */}
									<div className="flex items-center text-gray-600">
										{validModes.includes("online") ? (
											<>
												<Monitor className="w-4 h-4 mr-2 text-blue-600" />
												<span className="text-sm">Tersedia sesi online</span>
											</>
										) : (
											<>
												<MonitorX className="w-4 h-4 mr-2 text-gray-400" />
												<span className="text-sm text-gray-500">
													Sesi online belum tersedia
												</span>
											</>
										)}
									</div>
								</div>
							</div>

							{mentor.phone && (
								<div className="mt-3">
									<a
										href={(() => {
											const raw = mentor.phone || "";
											const digits = raw.replace(/\D/g, "");
											const normalized = digits.startsWith("0")
												? `62${digits.slice(1)}`
												: digits;
											return normalized ? `https://wa.me/${normalized}` : "#";
										})()}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors text-sm"
										aria-label={`Chat WhatsApp ${mentor.mentorName}`}>
										<FaWhatsapp className="w-4 h-4" />
										<span className="font-medium">WhatsApp</span>
									</a>
								</div>
							)}
						</div>
					)}

					<button
						type="button"
						onClick={handleScheduleClick}
						disabled={validModes.length === 0}
						className={`w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform ${
							validModes.length > 0
								? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:scale-105 outline-none focus:outline-none"
								: "bg-gray-300 text-gray-500 cursor-not-allowed"
						}`}>
						<BookOpen className="w-4 h-4" />
						{buttonText}
					</button>
				</div>
			</div>

			{showCourseModal && (
				<CourseSelectionModal
					courses={mentor.courses || []}
					selectedCourse={selectedMentorCourse}
					onSelect={handleCourseSelect}
					onConfirm={handleConfirmCourse}
					onCoursePackageSelect={onCoursePackageSelect}
					onClose={handleCloseCourseModal}
				/>
			)}
		</>
	);
}
