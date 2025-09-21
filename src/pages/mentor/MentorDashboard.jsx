import {
	Users,
	BookOpen,
	Star,
	Clock,
	Calendar,
	MessageSquare,
} from "lucide-react";
import api from "../../api";
import { useQuery } from "@tanstack/react-query";
import MentorCalendar from "../../components/mentor/MentorCalendar";
export function MentorDashboard() {
	// Query untuk dashboard info (analytics + calendar)
	const {
		data: dashboardData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["mentorDashboardInfo"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/mentor/dashboard-info", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
	});

	const status = dashboardData?.mentor_status || "unknown";

	// Data analytics dari endpoint baru
	const analytics = dashboardData?.analytics || {};
	const calendarData = dashboardData?.calendar || [];

	return (
		<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8 flex flex-col gap-2 md:gap-4">
				<div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-1">
					<h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
					{isLoading && (
						<div className="flex items-center gap-2 mt-1 md:mt-0">
							<div className="w-5 h-5 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-sm text-gray-500">Loading...</span>
						</div>
					)}
					{error && (
						<div className="flex items-center gap-2 mt-1 md:mt-0">
							<span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
							<span className="text-sm text-red-600">Failed to load data</span>
						</div>
					)}
					{!isLoading && !error && (
						<div
							className={
								"inline-block px-2 py-0.5 text-sm font-semibold rounded-full border mt-1 md:mt-0 " +
								(status === "active"
									? "bg-green-100 text-green-700 border-green-400"
									: status === "inactive"
									? "bg-red-200 text-red-700 border-red-400"
									: status === "pending"
									? "bg-yellow-100 text-yellow-700 border-yellow-400"
									: status === "rejected"
									? "bg-red-100 text-red-700 border-red-400"
									: "bg-gray-100 text-gray-500 border-gray-300")
							}
							style={{ width: "fit-content" }}>
							<span className="hidden md:inline">Status: </span>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</div>
					)}
				</div>
				<p className="text-gray-600">Ringkasan aktivitas mengajar saya</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
				{/* Total Sesi */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Calendar className="h-8 w-8 text-blue-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.total_sesi || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Sesi</h3>
				</div>

				{/* Sesi Bulan Ini */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-green-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.sesi_bulan_ini || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Sesi Bulan Ini</h3>
				</div>

				{/* Total Jam Mengajar */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-purple-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.total_jam_mengajar || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Jam Mengajar</h3>
				</div>

				{/* Siswa Aktif */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-indigo-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.siswa_aktif || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Siswa Aktif</h3>
				</div>

				{/* Rating */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Star className="h-8 w-8 text-yellow-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.rating || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Rating</h3>
				</div>

				{/* Total Testimoni */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<MessageSquare className="h-8 w-8 text-pink-600" />
						{isLoading ? (
							<div className="w-6 h-6 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{analytics.jumlah_testimoni || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Testimoni</h3>
				</div>
			</div>

			{/* Calendar */}
			<div className="mb-8">
				<MentorCalendar calendarData={calendarData} loading={isLoading} />
			</div>
		</div>
	);
}

export default MentorDashboard;
