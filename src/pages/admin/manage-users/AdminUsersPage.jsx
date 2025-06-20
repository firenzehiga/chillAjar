import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Users, UserPlus, AlertCircle } from "lucide-react";
import api from "../../../api";
import { AddUserModal } from "../../../components/Admin/AddUserModal";
import { useQuery } from "@tanstack/react-query";

export function AdminUsersPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);

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
			const res = await api.get("/admin/users", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data;
		},
		retry: 1,
	});

	// Tambahkan user baru ke cache query
	const handleUserAdded = (newUser) => {
		refetch(); // Atau bisa update cache manual jika ingin lebih cepat
	};

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
			width: "80px",
			sortable: true,
		},
		{ name: "Nama", selector: (row) => row.nama, sortable: true },
		{ name: "Email", selector: (row) => row.email, sortable: true },
		{ name: "Role", selector: (row) => row.peran, sortable: true },
		{
			name: "Bergabung",
			selector: (row) =>
				new Date(row.created_at).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
				}),
		},
	];

	// Error
	if (isError || error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data users
				</p>
			</div>
		);
	}

	// Sort users by created_at DESC (terbaru di atas)
	const sortedUsers = [...users].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	// Filter data berdasarkan searchTerm
	const filteredUsers = sortedUsers.filter((p) => {
		const lower = searchTerm.toLowerCase();
		return (
			p.nama?.toLowerCase().includes(lower) ||
			p.email?.toLowerCase().includes(lower) ||
			p.peran?.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Users className="w-6 h-6 mr-2 text-yellow-600" />
					Manage Users
				</h1>
				<p className="text-gray-600">View and manage all users</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">User List</h2>
					<button
						onClick={() => setShowAddModal(true)}
						className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
						<UserPlus className="w-4 h-4 mr-2" />
						Add User
					</button>
				</div>
				{isLoading ? (
					<div className="flex items-center justify-center h-64 text-gray-600 bg-white rounded-lg">
						<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mr-3"></div>
						<p>Loading course data...</p>
					</div>
				) : users.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">No Users Found</h3>
						<p className="text-gray-500 mb-4 text-center">
							Belum ada pengguna yang tersedia. Mulai dengan menambahkan
							pengguna baru.
						</p>
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, email, atau role ..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>
						<DataTable
							columns={columns}
							data={filteredUsers}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							noDataComponent={
								<p className="p-4 text-gray-500">No users available</p>
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
