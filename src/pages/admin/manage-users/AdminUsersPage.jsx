import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
	Users,
	UserPlus,
	AlertCircle,
	Filter,
	Calendar,
	CheckCircle,
	Clock,
} from "lucide-react";
import api from "../../../api";
import { AddUserModal } from "../../../components/Admin/AddUserModal";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../../../components/Admin/LoadingSpinner";
import { ExportData } from "../../../components/Admin/ExportData";

export function AdminUsersPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [roleFilter, setRoleFilter] = useState("all");

	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	// Fetch users dengan useQuery
	const {
		data: users = [],
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["adminUsers"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const res = await api.get("/admin/users", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data;
		},
		enabled: isAuthenticated,
		retry: 1,
	});

	// Tambahkan user baru ke cache query
	const handleUserAdded = (newUser) => {
		refetch();
	};

	// Define columns for CSV export
	const csvColumns = [
		{ key: "nama", header: "Nama" },
		{ key: "email", header: "Email" },
		{ key: "peran", header: "Role" },
		{
			key: "jumlah_sesi",
			header: "Sesi Reviewed",
			formatter: (row) => row.jumlah_sesi || 0,
		},
		{
			key: "sesi_mendatang",
			header: "Sesi Mendatang",
			formatter: (row) => row.sesi_mendatang || 0,
		},
		{
			key: "sesi_dimulai",
			header: "Sesi Berlangsung",
			formatter: (row) => row.sesi_dimulai || 0,
		},
		{
			key: "sesi_selesai",
			header: "Sesi Selesai",
			formatter: (row) => row.sesi_selesai || 0,
		},
		{
			key: "created_at",
			header: "Bergabung",
			formatter: (row) =>
				row.created_at
					? new Date(row.created_at).toLocaleDateString("id-ID")
					: "",
		},
	];

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
			width: "80px",
			sortable: true,
		},
		{ name: "Nama", selector: (row) => row.nama, sortable: true },
		{
			name: "Role",
			selector: (row) => row.peran,
			sortable: true,
			cell: (row) => (
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						row.peran === "admin"
							? "bg-red-100 text-red-800"
							: row.peran === "mentor"
							? "bg-blue-100 text-blue-800"
							: "bg-green-100 text-green-800"
					}`}>
					{row.peran}
				</span>
			),
		},
		{
			name: "Di-Review",
			selector: (row) => row.jumlah_sesi || 0,
			sortable: true,
			cell: (row) => {
				return (
					<div className="flex items-center justify-center">
						{row.peran !== "admin" ? (
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									(row.jumlah_sesi || 0) > 0
										? "bg-green-100 text-green-800"
										: "bg-gray-100 text-gray-600"
								}`}>
								<CheckCircle className="w-3 h-3 inline mr-1" />
								{row.jumlah_sesi || 0}
							</span>
						) : null}
					</div>
				);
			},
			width: "120px",
		},
		{
			name: "Mendatang",
			selector: (row) => row.sesi_mendatang || 0,
			sortable: true,
			cell: (row) => {
				return (
					<div className="flex items-center justify-center">
						{row.peran !== "admin" ? (
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									(row.sesi_mendatang || 0) > 0
										? "bg-blue-100 text-blue-800"
										: "bg-gray-100 text-gray-600"
								}`}>
								<Calendar className="w-3 h-3 inline mr-1" />
								{row.sesi_mendatang || 0}
							</span>
						) : null}
					</div>
				);
			},
			width: "120px",
		},
		{
			name: "Berlangsung",
			selector: (row) => row.sesi_dimulai || 0,
			sortable: true,
			cell: (row) => {
				return (
					<div className="flex items-center justify-center">
						{row.peran !== "admin" ? (
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									(row.sesi_dimulai || 0) > 0
										? "bg-orange-100 text-orange-800"
										: "bg-gray-100 text-gray-600"
								}`}>
								<Clock className="w-3 h-3 inline mr-1" />
								{row.sesi_dimulai || 0}
							</span>
						) : null}
					</div>
				);
			},
			width: "120px",
		},
		{
			name: "Selesai",
			selector: (row) => row.sesi_selesai || 0,
			sortable: true,
			cell: (row) => {
				return (
					<div className="flex items-center justify-center">
						{row.peran !== "admin" ? (
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									(row.sesi_selesai || 0) > 0
										? "bg-yellow-100 text-yellow-800"
										: "bg-gray-100 text-gray-600"
								}`}>
								<CheckCircle className="w-3 h-3 inline mr-1" />
								{row.sesi_selesai || 0}
							</span>
						) : null}
					</div>
				);
			},
			width: "120px",
		},
		{
			name: "Bergabung",
			selector: (row) =>
				new Date(row.created_at).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
				}),
			sortable: true,
		},
	];

	// Error handling
	if (isError || error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data users
				</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
					Coba Lagi
				</button>
			</div>
		);
	}

	// Sort users by created_at DESC
	const sortedUsers = [...users].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	// Filter data berdasarkan searchTerm dan roleFilter
	const filteredUsers = sortedUsers.filter((user) => {
		const lower = searchTerm.toLowerCase();
		const matchesSearch =
			user.nama?.toLowerCase().includes(lower) ||
			user.email?.toLowerCase().includes(lower) ||
			user.peran?.toLowerCase().includes(lower) ||
			(user.jumlah_sesi || 0).toString().includes(searchTerm) ||
			(user.sesi_mendatang || 0).toString().includes(searchTerm) ||
			(user.sesi_selesai || 0).toString().includes(searchTerm);

		const matchesRole = roleFilter === "all" || user.peran === roleFilter;

		return matchesSearch && matchesRole;
	});

	// Calculate statistics dengan mengecualikan admin dari perhitungan sesi
	const stats = {
		total: users?.length || 0,
		admin: users?.filter((u) => u.peran === "admin")?.length || 0,
		mentor: users?.filter((u) => u.peran === "mentor")?.length || 0,
		pelanggan: users?.filter((u) => u.peran === "pelanggan")?.length || 0,
		// Hanya hitung sesi untuk mentor dan pelanggan, bukan admin
		totalSesiReviewed:
			users
				?.filter((u) => u.peran !== "admin")
				.reduce((sum, u) => sum + (u.jumlah_sesi || 0), 0) || 0,
		totalSesiMendatang:
			users
				?.filter((u) => u.peran !== "admin")
				.reduce((sum, u) => sum + (u.sesi_mendatang || 0), 0) || 0,
		totalSesiSelesai:
			users
				?.filter((u) => u.peran !== "admin")
				.reduce((sum, u) => sum + (u.sesi_selesai || 0), 0) || 0,
		totalSesiBerlangsung:
			users
				?.filter((u) => u.peran !== "admin")
				.reduce((sum, u) => sum + (u.sesi_dimulai || 0), 0) || 0,
	};
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Users className="w-6 h-6 mr-2 text-yellow-600" />
					Manage Users
				</h1>
				<p className="text-gray-600">
					View and manage all users with session statistics
				</p>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-sm font-medium text-gray-500">Total Users</h3>
					<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
					<div className="text-xs text-gray-500 mt-1">
						Admin: {stats.admin} | Mentor: {stats.mentor} | Pelanggan:{" "}
						{stats.pelanggan}
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-sm font-medium text-gray-500 flex items-center">
						<CheckCircle className="w-4 h-4 mr-1 text-green-600" />
						Sesi Reviewed
					</h3>
					<p className="text-2xl font-bold text-green-600">
						{stats.totalSesiReviewed}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-sm font-medium text-gray-500 flex items-center">
						<Calendar className="w-4 h-4 mr-1 text-blue-600" />
						Sesi Mendatang
					</h3>
					<p className="text-2xl font-bold text-blue-600">
						{stats.totalSesiMendatang}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-sm font-medium text-gray-500 flex items-center">
						<Clock className="w-4 h-4 mr-1 text-orange-600" />
						Berlangsung
					</h3>
					<p className="text-2xl font-bold text-orange-600">
						{stats.totalSesiBerlangsung}
					</p>
				</div>
				<div className="bg-white p-4 rounded-lg shadow">
					<h3 className="text-sm font-medium text-gray-500 flex items-center">
						<CheckCircle className="w-4 h-4 mr-1 text-yellow-600" />
						Sesi Selesai
					</h3>
					<p className="text-2xl font-bold text-yellow-600">
						{stats.totalSesiSelesai}
					</p>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">User List</h2>
					<div className="flex gap-2">
						<ExportData
							data={filteredUsers}
							filename="user-data"
							columns={csvColumns}
							variant="success"
						/>
						<button
							onClick={() => setShowAddModal(true)}
							className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
							<UserPlus className="w-4 h-4 mr-2" />
							Add User
						</button>
					</div>
				</div>

				{isLoading ? (
					<LoadingSpinner message="Loading user data..." />
				) : (
					<>
						{/* Filters */}
						<div className="flex flex-col md:flex-row gap-4 mb-4">
							<div className="flex items-center gap-2">
								<Filter className="w-4 h-4 text-gray-500" />
								<select
									value={roleFilter}
									onChange={(e) => setRoleFilter(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
									<option value="all">Semua Role</option>
									<option value="admin">Admin</option>
									<option value="mentor">Mentor</option>
									<option value="pelanggan">Pelanggan</option>
								</select>
							</div>
							<div className="flex-1">
								<input
									type="text"
									placeholder="Cari nama, email, role, atau data sesi..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
								/>
							</div>
						</div>

						<DataTable
							columns={columns}
							data={filteredUsers}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md">
									<p className="flex">
										<span className="w-20 font-medium text-gray-900">
											Email:
										</span>
										<span>{data.email || "Tidak ada"}</span>
									</p>
								</div>
							)}
							noDataComponent={
								<>
									{searchTerm || roleFilter !== "all" ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Users
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												No users match your search or filter criteria.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Users Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Belum ada pengguna yang tersedia. Mulai dengan
												menambahkan pengguna baru.
											</p>
										</div>
									)}
								</>
							}
						/>
					</>
				)}
			</div>

			<AddUserModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onUserAdded={handleUserAdded}
			/>
		</div>
	);
}

export default AdminUsersPage;
