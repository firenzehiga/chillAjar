import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BookOpen, Plus, Pencil, Trash } from "lucide-react";
import api from "../../api";

export function MentorCoursesPage() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token = localStorage.getItem("token"); // Ambil token dari localStorage
				const response = await api.get("/mentor/daftar-course", {
					headers: { Authorization: `Bearer ${token}` }, // Kirim token untuk autentikasi
				});
				setCourses(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data courses");
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1, // Nomor urut dimulai dari 1
			sortable: false,
			width: "80px", // Lebar kolom tetap
		},
		{ name: "Nama Course", selector: (row) => row.namaCourse, sortable: true },
		{ name: "Deskripsi", selector: (row) => row.deskripsi },
		{
			name: "Created At",
			selector: (row) => new Date(row.created_at).toLocaleDateString(),
		},
		{
			name: "Updated At",
			selector: (row) => new Date(row.updated_at).toLocaleDateString(),
		},
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
				<p>Loading course data...</p>
			</div>
		);
	}

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					My Courses
				</h1>
				<p className="text-gray-600">Manage your teaching courses</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Courses You Teach</h2>
					<button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
						<Plus className="w-4 h-4 mr-2" />
						Add Course
					</button>
				</div>

				<DataTable
					columns={columns}
					data={courses}
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

export default MentorCoursesPage;
