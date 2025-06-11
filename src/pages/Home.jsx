import React from "react";
import {
    Search,
    ArrowLeft,
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    Monitor,
} from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { CourseCarousel } from "../components/CourseCarousel";
import api from "../api";
import { useQuery } from "@tanstack/react-query";
import { YourSessionSkeleton } from "../components/Skeleton/YourSessionSkeleton";
export function Home({
    courses,
    filteredCourses,
    searchQuery,
    setSearchQuery,
    handleCourseClick,
    userRole,
    onNavigate,
}) {
    const [visibleCourses, setVisibleCourses] = React.useState(6);

    const handleShowMore = () => {
        setVisibleCourses(courses.length);
    };

    const handleShowLess = () => {
        setVisibleCourses(6);
    };

    // Ambil userId dari localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.id;

    // Fetch daftar sesi pelanggan berdasarkan userId
    const {
        data: sessions = [],
        isLoading: isLoadingSessions,
        error: errorSessions,
    } = useQuery({
        queryKey: ["publicPelangganSessions", userId],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const response = await api.get(
                `/pelanggan/daftar-sesi?user_id=${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("Fetched sessions:", response.data);
            return response.data;
        },
        enabled: !!userId, // Hanya jalankan query jika userId ada
        onError: (err) => {
            console.error("Error fetching sessions:", err);
        },
    });

    // Filter sesi yang sedang berlangsung (started) untuk pelanggan ini
    const ongoingSessions = sessions.filter(
        (session) =>
            session.statusSesi === "started" || session.statusSesi === "end"
    );

    // --- Mapping agar field dan struktur course konsisten dengan frontend ---
    // Untuk setiap course:
    // - courseName: diambil dari namaKursus (backend) atau courseName (fallback)
    // - courseDescription: diambil dari deskripsi (backend) atau courseDescription (fallback)
    // - courseImage: diambil dari fotoKursus (backend) atau courseImage (fallback), default jika tidak ada
    // - price_per_hour: diambil dari mentor.biayaPerSesi (backend) atau price_per_hour (fallback)
    // - jadwal_kursus: hasil mapping dari jadwal_kursus (backend) atau jadwalKursus (backend),
    //   agar konsisten dipakai di seluruh komponen frontend (CourseCarousel, dsb)
    const mappedCourses = courses.map((course) => {
        // Pastikan field nama dan gambar konsisten
        return {
            ...course,
            courseName: course.namaKursus || course.courseName || "",
            courseDescription:
                course.deskripsi || course.courseDescription || "",
            courseImage:
                course.fotoKursus ||
                course.courseImage ||
                "/storage/foto_kursus/default.jpg",
            price_per_hour:
                course.mentor?.biayaPerSesi || course.price_per_hour || 0,
            jadwal_kursus: Array.isArray(course.jadwal_kursus)
                ? course.jadwal_kursus
                : Array.isArray(course.jadwalKursus)
                ? course.jadwalKursus
                : [],
        };
    });

    if (errorSessions) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p className="text-gray-500 mb-4 text-center">
                    Gagal mengambil data sesi
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {userRole !== "admin" && userRole !== "mentor" && (
                <div className="relative py-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                </div>
            )}
            {userRole === "pelanggan" && (
                <div className="container px-4 mx-auto mb-8 py-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Your Sessions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoadingSessions ? (
                            <YourSessionSkeleton />
                        ) : ongoingSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Ongoing Sessions
                                </h3>
                                <p className="text-gray-500 mb-4 text-center">
                                    You have no ongoing sessions at the moment.
                                </p>
                            </div>
                        ) : (
                            ongoingSessions.map((session) => (
                                <div
                                    onClick={() =>
                                        onNavigate("session-history")
                                    }
                                    key={session.id}
                                    className="bg-white rounded-xl mb-10 shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-white">
                                                {session.kursus?.namaKursus ||
                                                    "Unknown Course"}
                                            </h3>
                                            {session.statusSesi === "end" ? (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-green-600 rounded-full text-sm font-medium">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                    </span>
                                                    Selesai
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white text-red-600 rounded-full text-sm font-medium">
                                                    <span className="relative flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                    </span>
                                                    On Going
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 rounded-full border-2 border-blue-100 bg-gray-200" />
                                            <div className="ml-4">
                                                <p className="font-medium text-gray-900">
                                                    with{" "}
                                                    {session.mentor?.user
                                                        ?.nama ||
                                                        "Unknown Instructor"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Expert Mentor
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                                <span>
                                                    {new Date(
                                                        session.jadwal_kursus?.tanggal
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}{" "}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                                                <span>
                                                    {session.jadwal_kursus
                                                        ?.waktu
                                                        ? `${session.jadwal_kursus.waktu.slice(
                                                              0,
                                                              5
                                                          )} WIB`
                                                        : "No time"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                {(() => {
                                                    const mode =
                                                        session.jadwal_kursus
                                                            ?.gayaMengajar;
                                                    {
                                                        mode === "online" ? (
                                                            <>
                                                                <Monitor className="w-5 h-5 mr-3 text-blue-600" />
                                                                <span>
                                                                    Online
                                                                    Session
                                                                </span>
                                                            </>
                                                        ) : mode ===
                                                          "offline" ? (
                                                            <>
                                                                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                                                                <span>
                                                                    {session
                                                                        .jadwal_kursus
                                                                        ?.tempat ||
                                                                        "No location"}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                                                                <span>
                                                                    Data mode
                                                                    tidak valid
                                                                </span>
                                                            </>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            <CourseCarousel
                courses={mappedCourses}
                onCourseClick={handleCourseClick}
            />
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    All Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredCourses.slice(0, visibleCourses).map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onClick={handleCourseClick}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-end mb-8">
                    {visibleCourses < courses.length ? (
                        <button
                            onClick={handleShowMore}
                            className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none">
                            View all →
                        </button>
                    ) : (
                        <button
                            className="text-yellow-600 text-lg font-medium hover:text-gray-700 transition-colors duration-200 hover:underline outline-none focus:outline-none"
                            onClick={handleShowLess}>
                            View less
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
