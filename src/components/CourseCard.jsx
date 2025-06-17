import React, { useState } from "react";
import {
    Book,
    Users,
    Clock,
    Laptop,
    Building,
    FileQuestion,
} from "lucide-react";
import { getImageUrl } from "../utils/getImageUrl";

export function CourseCard({ course, onClick }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    // const filteredSchedules = course?.mentors?.[0]?.schedules || [];

    // console.log("Course in CourseCard:", course);
    // console.log("Filtered Schedules:", filteredSchedules);
    // DEBUG: log url gambar mentor utama
    const mentorImgUrl =
        course.mentor && course.mentor.user
            ? getImageUrl(
                  course.mentor.user.foto_profil,
                  "/foto_mentor/default.png"
              )
            : "/foto_mentor/default.png";
    return (
        <div
            onClick={() => onClick(course)}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group mb-8">
            <div className="relative overflow-hidden">
                {!imgLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img
                    loading="lazy"
                    src={getImageUrl(
                        course.courseImage,
                        "/foto_kursus/default.jpg"
                    )}
                    alt={course.courseName}
                    className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/foto_kursus/default.jpg";
                        setImgLoaded(true);
                    }}
                />
                {/* Avatar mentor utama */}
                {course.mentor && course.mentor.user && (
                    <img
                        src={getImageUrl(
                            course.mentor.user.foto_profil,
                            "/foto_mentor/default.png"
                        )}
                        alt={course.mentor.user.nama || "Mentor"}
                        className="absolute bottom-2 left-2 w-10 h-10 rounded-full border-2 border-white shadow object-cover bg-white"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/foto_mentor/default.png";
                        }}
                    />
                )}
                <div className="absolute top-3 right-3 bg-blue-900 text-white px-3 py-1 rounded-full text-sm font-medium transform transition-transform duration-300 hover:scale-105">
                    Rp{course.price_per_hour}/sesi
                </div>
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
                                    <>
                                        <FileQuestion className="w-4 h-4 mr-1 text-blue-800" />
                                        Tidak ada jadwal
                                    </>
                                );
                            }
                            // Ambil semua mode valid (online/offline) dari jadwal_kursus
                            const validModes = Array.from(
                                new Set(
                                    schedules
                                        .map((j) => j.gayaMengajar)
                                        .filter(
                                            (m) =>
                                                m === "online" ||
                                                m === "offline"
                                        )
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
                                <span
                                    key={mode}
                                    className="flex items-center mr-2">
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
                        {course.mentors.length} Mentors
                    </span>
                </div>
            </div>
        </div>
    );
}
