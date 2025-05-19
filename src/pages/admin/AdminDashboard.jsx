import React, { useEffect, useState } from "react";
import { Users, BookOpen, Clock, DollarSign } from "lucide-react";
import api from "../../api";

export function AdminDashboard() {
	const [usersCount, setUsersCount] = useState(0);
	const [coursesCount, setCoursesCount] = useState(0);
	const [mentorsCount, setMentorsCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const usersRes = await api.get("/admin/users");
				setUsersCount(usersRes.data.length);

				const coursesRes = await api.get("/courses");
				setCoursesCount(coursesRes.data.length);

				const mentorsRes = await api.get("/admin/mentor");
				setMentorsCount(mentorsRes.data.length);

				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data dashboard");
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading)
		return (
			<div className="flex items-center justify-center h-[60vh] text-gray-600">
				<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="text-gray-600">Overview of your platform's resources</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">
							{usersCount}
						</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total Users</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">
							{coursesCount}
						</span>
					</div>
					<h3 className="text-gray-600 font-medium">Active Courses</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">
							{mentorsCount}
						</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total Mentors</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<DollarSign className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">—</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total Revenue</h3>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
