import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { BookOpen, Plus, Pencil, Trash, X } from "lucide-react";
import api from "../../api";

export function AdminCoursesPage() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [previewImg, setPreviewImg] = useState(null); // Tambah state preview

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/kursus", {
					headers: { Authorization: `Bearer ${token}` },
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
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Foto",
			cell: (row) =>
				row.fotoKursus ? (
					<div className="flex items-center justify-center p-1">
						<img
							loading="lazy"
							src={`/storage/${row.fotoKursus}`}
							alt={row.namaKursus}
							className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
							onClick={() => setPreviewImg(`/storage/${row.fotoKursus}`)}
							onError={(e) => (e.target.style.display = "none")}
						/>
					</div>
				) : (
					<span className="text-gray-400 text-xs">No Image</span>
				),
			width: "170px",
		},
		{ name: "Nama Course", selector: (row) => row.namaKursus, sortable: true },
		{
			name: "Gaya Pembelajaran",
			selector: (row) =>
				row.gayaMengajar === "online" ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						Online
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
						Offline
					</span>
				),
			width: "200px",
		},
		{ name: "Deskripsi", selector: (row) => row.deskripsi, width: "390px" },
		// {
		// 	name: "Created At",
		// 	selector: (row) => new Date(row.created_at).toLocaleDateString(),
		// },
		// {
		// 	name: "Updated At",
		// 	selector: (row) => new Date(row.updated_at).toLocaleDateString(),
		// },
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleDelete(row.id)}
						className="text-red-600 hover:text-red-800 outline-none focus:outline-none">
						<Trash className="w-4 h-4" />
					</button>
				</div>
			),
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
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
					Manage Courses
				</h1>
				<p className="text-gray-600">Manage platform courses</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Course Management</h2>
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
			{previewImg && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="relative bg-white rounded-lg shadow-lg p-4">
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-red-500 z-10 pointer-events-auto"
							onClick={() => setPreviewImg(null)}
							style={{ zIndex: 10 }}>
							<X className="w-6 h-6" />
						</button>
						<img
							src={previewImg}
							alt="Preview"
							className="max-w-[70vw] max-h-[70vh] rounded-lg shadow"
							style={{ display: "block" }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminCoursesPage;
