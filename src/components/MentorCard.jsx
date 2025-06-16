import { useState, useEffect } from "react";
import {
    Star,
    Phone,
    MapPinIcon,
    Monitor,
    BookOpen,
    MonitorX,
    AlertCircle,
} from "lucide-react";
import { CourseSelectionModal } from "./CourseSelectionModal";

export function MentorCard({
    mentor,
    onSchedule,
    selectedCourse = null,
    resetCourseSelection,
}) {
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [selectedMentorCourse, setSelectedMentorCourse] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [modeError, setModeError] = useState("");

    useEffect(() => {
        setSelectedMentorCourse(null);
    }, [resetCourseSelection]);

    // --- Perubahan: Ambil semua mode valid dari jadwal, bukan dari course level ---
    const allSchedules = (mentor.courses || []).flatMap(
        (c) => c.schedules || []
    );
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
            onSchedule(mentor, selectedMentorCourse);
        }
    };

    const handleCloseCourseModal = () => {
        setShowCourseModal(false);
        setSelectedMentorCourse(null);
    };

    const buttonText = selectedCourse
        ? "Book Selected Course"
        : "Select Course";

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
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium cursor-pointer">
                            {showDetails ? "Show Less" : "View Details"}
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
                                No valid teaching mode
                            </span>
                        )}
                    </div>

                    {/* --- Perubahan: Tampilkan error jika tidak ada mode valid --- */}
                    {modeError && (
                        <div className="mb-2 flex items-center gap-2 text-red-600 bg-red-50 rounded p-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{modeError}</span>
                        </div>
                    )}

                    {showDetails && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">
                                    About
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {mentor.mentorAbout}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">
                                    Teaching Locations
                                </h4>
                                <div className="space-y-2">
                                    {/* --- Perubahan: Lokasi hanya dari jadwal offline valid --- */}
                                    {(() => {
                                        const offlineSchedules =
                                            allSchedules.filter(
                                                (s) =>
                                                    s.gayaMengajar ===
                                                        "offline" && s.tempat
                                            );
                                        const uniqueLocations = [
                                            ...new Set(
                                                offlineSchedules.map(
                                                    (s) => s.tempat
                                                )
                                            ),
                                        ];
                                        return uniqueLocations.length > 0 ? (
                                            uniqueLocations.map((location) => (
                                                <div
                                                    key={location}
                                                    className="">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPinIcon className="w-4 h-4 mr-2 text-blue-600" />
                                                        <span className="text-sm">
                                                            {location}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-600 text-sm ml-2">
                                                Jadwal offline belum tersedia.
                                            </div>
                                        );
                                    })()}
                                    {/* --- Perubahan: Status online hanya dari mode valid --- */}
                                    <div className="flex items-center text-gray-600">
                                        {validModes.includes("online") ? (
                                            <>
                                                <Monitor className="w-4 h-4 mr-2 text-blue-600" />
                                                <span className="text-sm">
                                                    Available for online
                                                    sessions
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
                                    <span className="text-sm">
                                        {mentor.phone}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleScheduleClick}
                        disabled={validModes.length === 0}
                        className={`w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                            validModes.length > 0
                                ? "bg-black text-white hover:bg-gray-900 outline-none focus:outline-none"
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
                    onClose={handleCloseCourseModal}
                />
            )}
        </>
    );
}
