import React, { useState, useEffect } from "react";
import {
	Star,
	Phone,
	MapPinIcon,
	Monitor,
	BookOpen,
	Award,
	Clock,
	MonitorX,
} from "lucide-react";
import { CourseSelectionModal } from "./CourseSelectionModal";

// Komponen MentorCard untuk menampilkan informasi mentor dan memilih kursus
export function MentorCard({
	mentor,
	onSchedule,
	showCourseSelect = false,
	selectedCourse = null,
	resetCourseSelection,
	schedules,
}) {
	const [showCourseModal, setShowCourseModal] = useState(false);
	const [selectedMentorCourse, setSelectedMentorCourse] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	// Reset pilihan kursus jika resetCourseSelection berubah (dari App.jsx)
	useEffect(() => {
		setSelectedMentorCourse(null);
	}, [resetCourseSelection]);

	// Fungsi untuk menangani klik tombol berdasarkan konteks
	const handleScheduleClick = () => {
		if (selectedCourse) {
			// Jika selectedCourse ada (dari halaman Courses), langsung ke BookingModal
			onSchedule(mentor, selectedCourse);
		} else if (mentor.courses) {
			// Jika tidak ada selectedCourse, buka CourseSelectionModal
			setShowCourseModal(true);
		}
	};

	// Fungsi untuk memilih kursus sementara di CourseSelectionModal
	const handleCourseSelect = (course) => {
		setSelectedMentorCourse(course);
	};

	// Fungsi untuk mengonfirmasi pilihan kursus dan membuka BookingModal
	const handleConfirmCourse = () => {
		if (selectedMentorCourse) {
			setShowCourseModal(false);
			onSchedule(mentor, selectedMentorCourse);
		}
	};

	// Fungsi untuk menutup CourseSelectionModal dan reset pilihan kursus
	const handleCloseCourseModal = () => {
		setShowCourseModal(false);
		setSelectedMentorCourse(null); // Reset kursus jika Cancel ditekan
	};

	// Tentukan teks tombol berdasarkan konteks
	const buttonText = selectedCourse ? "Book Selected Course" : "Select Course";
	// Contoh: Tampilkan jumlah slot tersedia
	return (
		<>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
				{/* Header Profil Mentor */}
				<div className="relative">
					<div className="h-32 bg-gradient-to-r bg-yellow-500" />
					<div className="absolute -bottom-12 left-6">
						<img
							src={mentor.mentorImage}
							alt={mentor.mentorName}
							className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover object-center"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/foto_mentor/default.png"; // Jika gagal memuat gambar(path ada di db tapi file gaada di folder), gunakan gambar default
							}}
						/>
					</div>
				</div>

				{/* Informasi Utama Mentor */}
				<div className="pt-14 px-6 pb-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-xl font-bold text-gray-900">
								{mentor.mentorName || "Chill Ajar"}{" "}
							</h3>
							<div className="flex items-center text-yellow-400 mt-1">
								<Star className="w-4 h-4 fill-current" />
								<span className="ml-1 text-sm font-medium">
									{mentor.mentorRating}
								</span>
								<span className="text-gray-500 text-sm ml-2">
									({mentor.totalReviews || "50+"} reviews)
								</span>
							</div>
						</div>
						<a
							onClick={() => setShowDetails(!showDetails)}
							className="text-yellow-600 hover:text-yellow-800 text-sm font-medium cursor-pointer">
							{showDetails ? "Show Less" : "View Details"}
						</a>
					</div>

					{/* Tag Keahlian Mentor */}
					<div className="flex flex-wrap gap-2 mb-4">
						{mentor.expertise.map((skill, index) => (
							<span
								key={index}
								className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
								{skill}
							</span>
						))}
					</div>

					{/* Detail Mentor (Jika Diperluas) */}
					{showDetails && (
						<div className="mt-4 space-y-4 border-t pt-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="bg-gray-50 p-3 rounded-lg">
									<div className="flex items-center text-gray-600 mb-1">
										<Clock className="w-4 h-4 text-blue-600 mr-2" />
										<span className="text-sm font-medium">Experience</span>
									</div>
									<p className="text-gray-900">
										{mentor.experience || "5+ years"}
									</p>
								</div>
								<div className="bg-gray-50 p-3 rounded-lg">
									<div className="flex items-center text-gray-600 mb-1">
										<Award className="w-4 h-4 text-blue-600 mr-2" />
										<span className="text-sm font-medium">Students</span>
									</div>
									<p className="text-gray-900">
										{mentor.totalStudents || "100+"}
									</p>
								</div>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">About</h4>
								<p className="text-gray-600 text-sm">{mentor.mentorAbout}</p>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">
									Teaching Locations
								</h4>
								<div className="space-y-2">
									{mentor.availability.offline && mentor.location && (
										<div className="flex items-center text-gray-600">
											<MapPinIcon className="w-4 h-4 mr-2 text-blue-600" />
											<span className="text-sm">{mentor.location}</span>
										</div>
									)}
									<div className="flex items-center text-gray-600">
										{mentor.availability.online ? (
											<>
												<Monitor className="w-4 h-4 mr-2 text-blue-600" />
												<span className="text-sm">
													Available for online sessions
												</span>
											</>
										) : (
											<>
												<MonitorX className="w-4 h-4 mr-2 text-gray-400" />
												<span className="text-sm text-gray-500">
													Online sessions unavailable
												</span>
											</>
										)}
										{/* <Monitor className="w-4 h-4 mr-2 text-blue-600" />
										<span className="text-sm">
											{mentor.availability.online
												? "Available for online sessions"
												: "Online sessions unavailable"}
										</span> */}
									</div>
								</div>
							</div>

							{mentor.mentorPhone && (
								<div className="flex items-center text-gray-600">
									<Phone className="w-4 h-4 mr-2 text-blue-600" />
									<span className="text-sm">{mentor.mentorPhone}</span>
								</div>
							)}
						</div>
					)}

					{/* Tombol untuk Memilih atau Membooking Mentor */}
					<button
						type="button"
						onClick={handleScheduleClick}
						className="w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors bg-black text-white hover:bg-gray-900">
						<BookOpen className="w-4 h-4" />
						{buttonText}
					</button>
				</div>
			</div>

			{/* Modal untuk Memilih Kursus */}
			{showCourseModal && (
				<CourseSelectionModal
					courses={mentor.courses || []}
					selectedCourse={selectedMentorCourse}
					onSelect={handleCourseSelect}
					onConfirm={handleConfirmCourse}
					onClose={handleCloseCourseModal}
				/>
			)}
		</>
	);
}
