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
	X,
} from "lucide-react";
import { CourseSelectionModal } from "./CourseSelectionModal";
import { AsyncImage } from "loadable-image";
import DetailMentorModal from "./DetailMentorModal";
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
	const {
		setShowBookingModal,
		setShowPayment,
		showPackageSelection,
		showCourseSelection,
		selectedMentor,
		setSelectedMentor,
		setShowCourseSelection,
	} = useAppStore();
	const [selectedMentorCourse, setSelectedMentorCourse] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modeError, setModeError] = useState("");
	const [showAvatarPreview, setShowAvatarPreview] = useState(false);

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
				.filter((m) => m === "online" || m === "offline"),
		),
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
			// open global modal and mark this mentor as selected
			setSelectedMentor(mentor);
			setSelectedMentorCourse(null);
			setShowCourseSelection(true);
		}
	};

	const handleCourseSelect = (course) => {
		setSelectedMentorCourse(course);
	};

	const handleConfirmCourse = () => {
		if (selectedMentorCourse) {
			// Use package selection flow instead of direct scheduling
			if (onCoursePackageSelect) {
				onCoursePackageSelect(selectedMentorCourse);
			} else {
				// Fallback to old behavior if no package selection handler
				onSchedule(mentor, selectedMentorCourse);
			}
		}
	};

	const formatMentorName = (name) => {
		return name || "";
	};
	return (
		<>
			<style>{`
				@keyframes floaty { 0% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-8px) rotate(3deg); } 100% { transform: translateY(0) rotate(6deg); } }
				@keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
				.deco-float { animation: floaty 3.8s ease-in-out infinite; }
				.deco-pop { animation: pop 2.6s ease-in-out infinite; }
			`}</style>
			<div className="group relative bg-gray-50 rounded-xl shadow-lg overflow-hidden transform-gpu transition-transform  duration-300 will-change-transform hover:shadow-2xl hover:translate-y-1">
				{/* small ribbon to match app theme */}
				<div className="absolute top-4 left-4 bg-white/90 text-xs font-semibold text-blue-700 px-2 py-1 rounded-md shadow-sm">
					ChillAjar
				</div>
				<div className="relative">
					<div className="h-32 bg-chill-blue relative overflow-hidden">
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
						<Lightbulb className="absolute left-20 top-7 w-14 h-14 text-white opacity-20 transform rotate-6 deco-float transition-transform duration-500 group-hover:translate-y-1 group-hover:rotate-3" />
					</div>
					<div className="absolute -bottom-12 left-6">
						<button
							type="button"
							onClick={() => setShowAvatarPreview(true)}
							className="rounded-full p-1 bg-gradient-to-r from-chill-blue via-indigo-500 to-chill-blue outline-none active:outline-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white [-webkit-tap-highlight-color:transparent]"
							aria-label={`Lihat foto ${mentor.mentorName || "mentor"}`}>
							<AsyncImage
								Transition={Fade}
								src={mentor.mentorImage}
								alt={mentor.mentorName}
								className="w-20 h-20 rounded-full shadow-lg object-cover object-center"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_mentor/default.png";
								}}
							/>
						</button>
					</div>
				</div>

				<div className="pt-14 px-6 pb-6">
					<div className="flex justify-between items-start mb-4">
						<div className="min-w-0">
							<h3 className="text-xl font-bold text-gray-900 leading-tight break-words">
								{formatMentorName(mentor.mentorName) || "Mentor"}
							</h3>
							<div
								className="flex items-center text-yellow-400 mt-1"
								aria-label={`Rating ${
									typeof mentor.mentorRating === "number" &&
									!isNaN(mentor.mentorRating)
										? mentor.mentorRating.toFixed(1)
										: Number(mentor.mentorRating) &&
											  !isNaN(Number(mentor.mentorRating))
											? Number(mentor.mentorRating).toFixed(1)
											: "0.0"
								} dari 5`}
								role="img">
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
							onClick={() => setShowModal((s) => !s)}
							className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">
							{showModal ? "Tutup" : "Lihat Detail"}
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

					{/* Details now displayed in modal to avoid pushing layout */}
					<DetailMentorModal
						open={showModal}
						onClose={() => setShowModal(false)}
						mentor={mentor}
						allSchedules={allSchedules}
						validModes={validModes}
						onSchedule={(m, c) => {
							// If course provided, use it; otherwise open course modal flow
							if (c) {
								onSchedule && onSchedule(m, c);
							} else {
								handleScheduleClick();
							}
						}}
					/>
					{validModes.length > 0 && (
						<button
							type="button"
							onClick={handleScheduleClick}
							disabled={validModes.length === 0}
							className={`w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform ${
								validModes.length > 0
									? "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 outline-none focus:outline-none"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}>
							<BookOpen className="w-4 h-4" />
							{selectedCourse ? "Pesan Sekarang" : "Pilih Kursus"}
						</button>
					)}
				</div>
			</div>

			{showCourseSelection && selectedMentor?.id === mentor.id && (
				<CourseSelectionModal
					courses={mentor.courses || []}
					selectedCourse={selectedMentorCourse}
					onSelect={handleCourseSelect}
					onConfirm={handleConfirmCourse}
					onCoursePackageSelect={onCoursePackageSelect}
					onClose={() => {
						// close global modal when user cancels locally
						setShowCourseSelection(false);
						setSelectedMentor(null);
						setSelectedMentorCourse(null);
					}}
				/>
			)}

			{showAvatarPreview && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
					onClick={() => setShowAvatarPreview(false)}
					role="dialog"
					aria-modal="true">
					<div className="relative" onClick={(e) => e.stopPropagation()}>
						<div className="absolute -inset-6 rounded-full bg-blue-400/20 blur-2xl" />
						<div className="relative rounded-full p-[6px] bg-gradient-to-br from-blue-400 via-indigo-400 to-sky-300 shadow-2xl">
							<AsyncImage
								Transition={Fade}
								src={mentor.mentorImage}
								alt={mentor.mentorName}
								className="w-72 h-72 rounded-full object-cover object-center border-[6px] border-white"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "/foto_mentor/default.png";
								}}
							/>
						</div>
						<button
							type="button"
							onClick={() => setShowAvatarPreview(false)}
							className="absolute -top-3 -right-3 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
							aria-label="Tutup">
							<X className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
			)}
		</>
	);
}
