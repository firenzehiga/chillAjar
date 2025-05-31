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

export function MentorCard({
	mentor,
	onSchedule,
	showCourseSelect = false,
	selectedCourse = null,
	resetCourseSelection,
}) {
	const [showCourseModal, setShowCourseModal] = useState(false);
	const [selectedMentorCourse, setSelectedMentorCourse] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		setSelectedMentorCourse(null);
	}, [resetCourseSelection]);

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
			console.log("Course yang dipilih:", selectedMentorCourse);
			setShowCourseModal(false);
			onSchedule(mentor, selectedMentorCourse);
		}
	};

	const handleCloseCourseModal = () => {
		setShowCourseModal(false);
		setSelectedMentorCourse(null);
	};

	const buttonText = selectedCourse ? "Book Selected Course" : "Select Course";

	// Fungsi untuk mengelompokkan jadwal berdasarkan lokasi
	const getSchedulesByLocation = (course) => {
		if (!course?.schedules || course.schedules.length === 0) {
			return [];
		}

		// Kelompokkan schedules berdasarkan tempat
		const schedulesByLocation = course.schedules.reduce((acc, schedule) => {
			const location = schedule.tempat;
			if (!acc[location]) {
				acc[location] = [];
			}
			acc[location].push(schedule);
			return acc;
		}, {});

		// Ambil tanggal unik untuk setiap lokasi
		return Object.entries(schedulesByLocation).map(([location, schedules]) => ({
			location,
			dates: [...new Set(schedules.map((s) => s.tanggal))].map(
				(date) => new Date(date)
			),
		}));
	};

	return (
		<>
			<div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
				<div className="relative">
					<div className="h-32 bg-gradient-to-r bg-yellow-500" />
					<div className="absolute -bottom-12 left-6">
						<img
							src={mentor.mentorImage}
							alt={mentor.mentorName}
							className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover object-center"
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/foto_mentor/default.png";
							}}
						/>
					</div>
				</div>

				<div className="pt-14 px-6 pb-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-xl font-bold text-gray-900">
								{mentor.mentorName || "Chill Ajar"}
							</h3>
							<div className="flex items-center text-yellow-400 mt-1">
								<Star className="w-4 h-4 fill-current" />
								<span className="ml-1 text-sm çe">{mentor.mentorRating}</span>
								{/* <span className="text-gray-500 text-sm ml-2">
									({mentor.totalReviews || "50+"} reviews)
								</span> */}
							</div>
						</div>
						<a
							onClick={() => setShowDetails(!showDetails)}
							className="text-yellow-600 hover:text-yellow-800 text-sm font-medium cursor-pointer">
							{showDetails ? "Show Less" : "View Details"}
						</a>
					</div>

					<div className="flex flex-wrap gap-2 mb-4">
						{mentor.availableLearnMethod.map((skill, index) => (
							<span
								key={index}
								className={`text-xs px-3 py-1 rounded-full font-medium
                ${
									skill === "Online Learning"
										? "bg-blue-50 text-blue-700"
										: skill === "Offline Learning"
										? "bg-red-50 text-red-700"
										: "bg-gray-100 text-gray-700"
								}`}>
								{skill}
							</span>
						))}
					</div>

					{showDetails && (
						<div className="mt-4 space-y-4 border-t pt-4">
							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">About</h4>
								<p className="text-gray-600 text-sm">{mentor.mentorAbout}</p>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium text-gray-900">
									Teaching Locations
								</h4>
								<div className="space-y-2">
									{mentor.teachingMode.offline &&
									mentor.courses &&
									mentor.courses.length > 0 ? (
										// Ambil semua lokasi unik dari schedules kursus offline
										(() => {
											const offlineCourses = mentor.courses.filter(
												(course) => course.learnMethod === "Offline Learning"
											);
											const allSchedules = offlineCourses.flatMap(
												(course) => course.schedules || []
											);
											const uniqueLocations = [
												...new Set(
													allSchedules.map((s) => s.tempat).filter(Boolean)
												),
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
												<div className="text-gray-600 text-sm ml-2">
													Jadwal belum tersedia.
												</div>
											);
										})()
									) : (
										<div className="flex items-center text-gray-600">
											<MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
											<span className="text-sm text-gray-500">
												Offline sessions unavailable
											</span>
										</div>
									)}
									<div className="flex items-center text-gray-600">
										{mentor.teachingMode.online ? (
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
									</div>
								</div>
							</div>

							{mentor.phone && (
								<div className="flex items-center text-gray-600">
									<Phone className="w-4 h-4 mr-2 text-blue-600" />
									<span className="text-sm">{mentor.phone}</span>
								</div>
							)}
						</div>
					)}

					<button
						type="button"
						onClick={handleScheduleClick}
						className="w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors bg-black text-white hover:bg-gray-900">
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
					onClose={handleCloseCourseModal}
				/>
			)}
		</>
	);
}
