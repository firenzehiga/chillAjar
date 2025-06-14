import { useQuery } from "@tanstack/react-query"; // Impor React Query
import {
	Users,
	BookOpen,
	Clock,
	DollarSign,
	ShieldQuestion,
} from "lucide-react";
import api from "../../api";
import { useState } from "react";
import { da } from "date-fns/locale";

export function AdminDashboard() {
	const [loadingPentest, setLoadingPentest] = useState(false);
	const [pentestMsg, setPentestMsg] = useState("");

	// Query untuk Total Users
	// Gunakan useQuery dari React Query untuk mengambil data dari API
	// Query key untuk cache adalah "adminUsers"
	// Query function akan dijalankan jika belum ada data di cache
	// Jika ada error, maka akan mengembalikan error
	// Jika berhasil, maka akan mengembalikan data dalam bentuk jumlah pengguna
	const {
		data: totalData, // data yang diambil dari API
		isLoading: dataLoading, // status loading (true/false)
		error: dataError, // error jika terjadi kesalahan
	} = useQuery({
		queryKey: ["adminSummaryData"], // query key untuk cache
		queryFn: async () => {
			// query function untuk mengambil data dari API
			const response = await api.get("/admin/dashboard-info", {
				// jalankan request GET ke API
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				}, // sertakan token di header
			});
			return response.data; // kembalikan data
		},
	});

	// Handler untuk API pentest: hapus sesi expired
	const handleHapusSesiExpired = async () => {
		setLoadingPentest(true);
		setPentestMsg("");
		try {
			const res = await api.post("/pentest/exec-hapus-sesi-expired");
			setPentestMsg(res.data.message || "Berhasil menjalankan perintah.");
		} catch (err) {
			setPentestMsg(
				"Gagal menjalankan perintah: " +
					(err?.response?.data?.message || err.message)
			);
		} finally {
			setLoadingPentest(false);
		}
	};
	// Handler untuk API pentest: update rating mentor
	const handleUpdateRatingMentor = async () => {
		setLoadingPentest(true);
		setPentestMsg("");
		try {
			const res = await api.post("/pentest/exec-update-rating-mentor");
			setPentestMsg(res.data.message || "Berhasil menjalankan perintah.");
		} catch (err) {
			setPentestMsg(
				"Gagal menjalankan perintah: " +
					(err?.response?.data?.message || err.message)
			);
		} finally {
			setLoadingPentest(false);
		}
	};

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
						{dataLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : dataError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{totalData?.jumlah_pelanggan || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Students</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-yellow-600" />
						{dataLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : dataError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{totalData?.jumlah_kursus || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Active Courses</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-yellow-600" />
						{dataLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : dataError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{totalData?.jumlah_mentor || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Mentors</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-yellow-600" />
						{dataLoading ? (
							<div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						) : dataError ? (
							<span className="text-red-500 text-sm">Error</span>
						) : (
							<span className="text-2xl font-bold text-gray-900">
								{totalData?.jumlah_sesi || 0}
							</span>
						)}
					</div>
					<h3 className="text-gray-600 font-medium">Total Sessions</h3>
				</div>
			</div>

			<div className="mt-8">
				<h2 className="text-lg font-semibold mb-2">Admin Utility Actions</h2>
				<div className="flex flex-wrap gap-4 mb-2">
					<button
						disabled={loadingPentest}
						onClick={handleHapusSesiExpired}
						className="px-4 py-2 bg-red-700 text-white rounded shadow hover:bg-red-800 disabled:opacity-60 transition-all">
						Hapus Semua Sesi Expired
					</button>
					<button
						disabled={loadingPentest}
						onClick={handleUpdateRatingMentor}
						className="px-4 py-2 bg-emerald-700 text-white rounded shadow hover:bg-emerald-800 disabled:opacity-60 transition-all">
						Update Seluruh Rating Mentor
					</button>
				</div>
				{pentestMsg && (
					<div className="text-sm text-blue-800 bg-blue-100 rounded px-3 py-2 mt-2 max-w-lg border border-blue-200">
						{pentestMsg}
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminDashboard;
