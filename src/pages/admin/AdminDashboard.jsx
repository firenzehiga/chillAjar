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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
dayjs.extend(relativeTime);
dayjs.locale("id");
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

			<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
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
				{/* Card User Terbaru */}
				<div className="bg-white rounded-xl shadow-lg p-6">
					<h2 className="text-lg font-semibold mb-4">User Terbaru</h2>
					{dataLoading ? (
						<div className="flex items-center justify-center h-32">
							<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : dataError ? (
						<div className="text-red-500 text-sm">Gagal memuat data user.</div>
					) : !totalData?.user_terbaru?.length ? (
						<div className="text-gray-500 text-sm">Belum ada user baru.</div>
					) : (
						<ul>
							{totalData.user_terbaru.map((user) => (
								<li
									key={user.id}
									className="flex items-center gap-3 py-2 border-b last:border-b-0">
									<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-lg uppercase">
										{user.nama?.[0] || "U"}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<span className="font-medium text-gray-900">
												{user.nama}
											</span>
											{/* Badge peran di samping nama */}
											{user.peran === "mentor" ? (
												<span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
													Mentor
												</span>
											) : user.peran === "pelanggan" ? (
												<span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
													Pelanggan
												</span>
											) : user.peran === "admin" ? (
												<span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-500">
													Admin
												</span>
											) : (
												<span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
													{user.peran || "Lainnya"}
												</span>
											)}
										</div>
										<div className="text-xs text-gray-500">{user.email}</div>
									</div>
									<div className="text-xs text-gray-400">
										<div className="text-xs text-gray-400">
											{user.created_at ? dayjs(user.created_at).fromNow() : ""}
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
				{/* ...bisa tambahkan card lain di sini... */}
			</div>
		</div>
	);
}

export default AdminDashboard;
