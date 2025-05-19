import { useQuery } from "@tanstack/react-query"; // Impor React Query
import {
	Users,
	BookOpen,
	Clock,
	DollarSign,
	ShieldQuestion,
} from "lucide-react";
import api from "../../api";

export function AdminDashboard() {
	// Query untuk Total Users
	// Gunakan useQuery dari React Query untuk mengambil data dari API
	// Query key untuk cache adalah "adminUsers"
	// Query function akan dijalankan jika belum ada data di cache
	// Jika ada error, maka akan mengembalikan error
	// Jika berhasil, maka akan mengembalikan data dalam bentuk jumlah pengguna
	const {
		data: usersData, // data yang diambil dari API
		isLoading: usersLoading, // status loading (true/false)
		error: usersError, // error jika terjadi kesalahan
	} = useQuery({
		queryKey: ["adminUsers"], // query key untuk cache
		queryFn: async () => {
			// query function untuk mengambil data dari API
			const response = await api.get("/admin/users", {
				// jalankan request GET ke API
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // sertakan token di header
			});
			return response.data.length; // kembalikan jumlah pengguna
		},
	});

	// Query untuk Active Courses
	const {
		data: coursesData,
		isLoading: coursesLoading,
		error: coursesError,
	} = useQuery({
		queryKey: ["courses"],
		queryFn: async () => {
			const response = await api.get("/courses", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return response.data.length;
		},
	});

	// Query untuk Total Mentors
	const {
		data: mentorsData,
		isLoading: mentorsLoading,
		error: mentorsError,
	} = useQuery({
		queryKey: ["adminMentors"],
		queryFn: async () => {
			const response = await api.get("/admin/mentor", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return response.data.length;
		},
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="text-gray-600">Overview of your platform's resources</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-yellow-600" />
						{usersLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : usersError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{usersData || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Users</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-yellow-600" />
						{coursesLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : coursesError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{coursesData || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Active Courses</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-yellow-600" />
						{mentorsLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : mentorsError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{mentorsData || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Mentors</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<ShieldQuestion className="h-8 w-8 text-yellow-600" />
						<span className="text-2xl font-bold text-gray-900">—</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total</h3>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
