import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { UserCheck, Plus, Pencil, Trash, Star } from "lucide-react";
import api from "../../api";

export function AdminMentorsPage() {
	const [mentors, setMentors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const response = await api.get("/admin/mentor");
				setMentors(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data mentor");
				setLoading(false);
			}
		};
		fetchMentors();
	}, []);

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
			width: "80px",
			sortable: true,
		},
		{
			name: "Rating",
			cell: (row) => (
				<div className="flex text-yellow-500">
					<Star className="w-4 h-4" fill="currentColor" />
					<span className="ml-1 text-gray-700">{row.rating.toFixed(1)}</span>
				</div>
			),
			sortable: true,
		},
		{
			name: "Biaya Per Sesi",
			selector: (row) => `Rp ${row.biayaPerSesi.toLocaleString()}`,
		},
		{ name: "Gaya Mengajar", selector: (row) => row.gayaMengajar },
		{ name: "Deskripsi", selector: (row) => row.deskripsi },

		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button className="text-blue-600 hover:text-blue-800">
						<Pencil className="w-4 h-4" />
					</button>
					<button className="text-red-600 hover:text-red-800">
						<Trash className="w-4 h-4" />
					</button>
				</div>
			),
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading mentor data...</p>
			</div>
		);
	}

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<UserCheck className="w-6 h-6 mr-2 text-blue-600" />
					Manage Mentors
				</h1>
				<p className="text-gray-600">Manage platform mentors</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Mentor Management</h2>
					<button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<Plus className="w-4 h-4 mr-2" />
						Add Mentor
					</button>
				</div>

				<DataTable
					columns={columns}
					data={mentors}
					pagination
					highlightOnHover
					persistTableHead
					responsive
					noHeader
				/>
			</div>
		</div>
	);
}

export default AdminMentorsPage;
