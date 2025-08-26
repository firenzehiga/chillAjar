import React from "react";
import { Users, BookOpen, Star, Clock } from "lucide-react";
import api from "../../api";
import { useQuery } from "@tanstack/react-query";

export function MentorDashboard() {
	const {
		data: courses = [],
		isLoading: isLoadingCourses,
		error: errorCourses,
	} = useQuery({
		queryKey: ["mentorCountCourses"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/mentor/daftar-kursus", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
	});

	const {
		data: mentorProfile,
		isLoading: isLoadingProfile,
		error: errorProfile,
	} = useQuery({
		queryKey: ["mentorCountProfile"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/mentor/profil-saya", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
	});

	const status = mentorProfile?.mentor?.status || "unknown";
	const jumlahCourse = mentorProfile?.jumlah_kursus || 0;
	const rating = mentorProfile?.mentor?.rating || 0;
	const loading = isLoadingCourses || isLoadingProfile;
	const error = errorCourses || errorProfile;

	return (
		<div className="py-8">
			<div className="mb-8 flex flex-col gap-2 md:gap-4">
				<div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-1">
					<h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
					{loading && (
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
					{!loading && !error && (
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{/* <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-yellow-600" />
						<span className="text-2xl font-bold text-gray-900">Belum</span>
					</div>
					<h3 className="text-gray-600 font-medium">Active Students</h3>
				</div> */}
				{/* <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="h-8 w-8 text-yellow-600" />
                        <span className="text-2xl font-bold text-gray-900">156</span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Teaching Hours</h3>
                </div> */}
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Star className="h-8 w-8 text-yellow-600" />
						{loading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">{rating}</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Average Rating</h3>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-yellow-600" />
						{loading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : error ? (
							<span className="text-2xl font-bold text-gray-900">0</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{jumlahCourse}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Courses</h3>
				</div>
			</div>

			{/* <div className="bg-white rounded-xl shadow-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div>
							<h3 className="font-medium">Advanced Calculus</h3>
							<p className="text-sm text-gray-600">with John Doe</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-600">2024-03-20</p>
							<p className="text-sm text-gray-600">14:00</p>
						</div>
					</div>
				</div>
			</div> */}
		</div>
	);
}

export default MentorDashboard;
