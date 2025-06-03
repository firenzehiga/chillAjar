import React from "react";
import { Search, ArrowLeft, AlertCircle } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { CourseCarousel } from "../components/CourseCarousel";
import api from "../api";
import { useQuery } from "@tanstack/react-query";

export function Home({
	courses,
	filteredCourses,
	searchQuery,
	setSearchQuery,
	handleCourseClick,
	userRole,
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
		queryKey: ["pelangganSessions", userId],
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

	// Fetch transaksi berdasarkan userId
	const {
		data: transactions = [],
		isLoading: isLoadingTransactions,
		error: errorTransactions,
	} = useQuery({
		queryKey: ["pelangganTransactions", userId],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get(`/transaksi?user_id=${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched transactions:", response.data);
			return response.data;
		},
		enabled: !!userId, // Hanya jalankan query jika userId ada
		onError: (err) => {
			console.error("Error fetching transactions:", err);
		},
	});

	// Filter sesi yang relevan (accepted atau started) untuk pelanggan ini
	const upcomingSessions = sessions
		.map((session) => {
			const transaction = transactions.find((t) => t.sesi_id === session.id);
			return {
				...session,
				statusPembayaran: transaction?.statusPembayaran || "pending",
				statusSesi: session.statusSesi || "pending",
			};
		})
		.filter(
			(session) =>
				session.statusPembayaran === "accepted" ||
				session.statusSesi === "started"
		);

	if (errorSessions || errorTransactions) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data sesi atau transaksi
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

			<CourseCarousel courses={courses} onCourseClick={handleCourseClick} />
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>
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
			<div className="container px-4 mx-auto">
				<h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
					Your Upcoming Sessions
				</h2>

				<div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden mb-7">
					{isLoadingSessions || isLoadingTransactions ? (
						<div className="flex items-center justify-center h-64 text-gray-600">
							<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
							<p className="ml-3">Loading sessions...</p>
						</div>
					) : upcomingSessions.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-600">
							<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								No Upcoming Sessions
							</h3>
							<p className="text-gray-500 mb-4 text-center">
								You have no upcoming sessions at the moment.
							</p>
						</div>
					) : (
						upcomingSessions.map((session, index) => (
							<div
								key={index}
								className="p-6 border-b border-gray-200/50 last:border-b-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-gray-50/50 transition-all duration-200">
								<div
									className={`${
										session.statusSesi === "started"
											? "bg-gradient-to-br from-red-100 to-rose-100 text-red-800"
											: session.statusPembayaran === "accepted"
											? "bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800"
											: "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-800"
									} p-4 rounded-xl text-center min-w-[100px] shadow-sm`}>
									<div className="font-bold text-lg">
										{new Date(
											session.jadwal_kursus?.tanggal
										).toLocaleDateString("en-US", { weekday: "short" })}
									</div>
									<div className="text-sm opacity-80">
										{new Date(session.jadwal_kursus?.tanggal).getDate()}
									</div>
								</div>

								<div className="flex-grow">
									{session.statusSesi === "started" && (
										<span className="inline-flex items-center gap-2 font-medium text-red-500">
											<span className="relative flex h-3 w-3">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
											</span>
											On Going
										</span>
									)}
									<h3 className="font-semibold text-lg mb-1">
										{session.kursus?.namaKursus || "Unknown Course"}
									</h3>
									<p className="text-gray-500">
										{session.jadwal_kursus?.waktu
											? `${session.jadwal_kursus.waktu.slice(0, 5)} WIB`
											: "No time"}
										{session.jadwal_kursus?.tempat
											? ` - ${session.jadwal_kursus.tempat}`
											: ""}
									</p>
								</div>

								<div className="flex items-center gap-4">
									<div className="flex items-center gap-3">
										<div>
											<div className="font-medium">
												{session.mentor?.user?.nama || "Unknown Instructor"}
											</div>
											<div className="text-sm text-gray-500 mt-2">
												{session.kursus?.gayaMengajar === "online" ? (
													<span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
														Online Learning
													</span>
												) : session.kursus?.gayaMengajar === "offline" ? (
													<span className="text-xs px-3 py-1 rounded-full font-medium bg-red-50 text-red-700">
														Offline Learning
													</span>
												) : (
													<span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
														N/A
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default Home;
