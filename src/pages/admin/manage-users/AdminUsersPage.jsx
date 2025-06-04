import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Users, Plus } from "lucide-react";
import api from "../../../api";
import { AddUserModal } from "../../../components/Admin/AddUserModal"; // Sesuaikan path

export function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddModal, setShowAddModal] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await api.get("/admin/users", {
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				});
				setUsers(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data pengguna");
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	const handleUserAdded = (newUser) => {
		setUsers((prev) => [...prev, newUser]); // Tambahkan pengguna baru ke daftar
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
			name: "Created At",
			selector: (row) => new Date(row.created_at).toLocaleDateString(),
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading user data...</p>
			</div>
		);
	}

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Users className="w-6 h-6 mr-2 text-blue-600" />
					Manage Users
				</h1>
				<p className="text-gray-600">View and manage all users</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">User List</h2>
					<button
						onClick={() => setShowAddModal(true)}
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<Plus className="w-4 h-4 mr-2" />
						Add User
					</button>
				</div>

				<DataTable
					columns={columns}
					data={users}
					pagination
					highlightOnHover
					persistTableHead
					responsive
					noHeader
				/>
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
