import React from "react";
import DataTable from "react-data-table-component";
import {
	BookOpen,
	Pencil,
	Trash,
	AlertCircle,
	LucideBookPlus,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminCoursesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = React.useState("");
	const queryClient = useQueryClient();

	// Fetch data courses menggunakan useQuery
	const {
		data: courses = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["adminCourses"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/kursus", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
		onError: (err) => {
			console.error("Error fetching courses:", err);
		},
		retry: 1, // Hanya coba ulang sekali jika gagal
	});

	const handleDelete = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const token = localStorage.getItem("token");
					await api.delete(`/kursus/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					queryClient.setQueryData(["adminCourses"], (oldData) =>
						oldData.filter((course) => course.id !== id)
					);
					Swal.fire("Deleted!", "Course has been deleted.", "success");
				} catch (err) {
					Swal.fire("Error!", "Failed to delete course.", "error");
				}
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-course/${id}`);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{ name: "Nama Course", selector: (row) => row.namaKursus, sortable: true },
		{
			name: "Mentor",
			selector: (row) => row.mentor?.user?.nama || "Unknown Mentor",
			sortable: true,
		},
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
			width: "100px",
		},
		{ name: "Deskripsi", selector: (row) => row.deskripsi, width: "390px" },
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
							onError={(e) => (e.target.style.display = "none")}
						/>
					</div>
				) : (
					<span className="text-gray-400 text-xs">No Image</span>
				),
			width: "170px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEdit(row.id)}
						className="text-blue-600 hover:text-blue-800 outline-none focus:outline-none">
						<Pencil className="w-4 h-4" />
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className="text-red-600 hover:text-red-800 outline-none focus:outline-none">
						<Trash className="w-4 h-4" />
					</button>
				</div>
			),
		},
	];

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data courses
				</p>
			</div>
		);
	}
	// Filter data berdasarkan searchTerm
	const filteredCourses = courses.filter((p) => {
		const lower = searchTerm.toLowerCase();

		return (
			p.namaKursus?.toLowerCase().includes(lower) ||
			p.gayaMengajar?.toLowerCase().includes(lower) ||
			p.deskripsi?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
					Manage All Courses
				</h1>
				<p className="text-gray-600">Manage all courses as an admin</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Courses</h2>
					<button
						onClick={() => onNavigate("admin-add-course")}
						className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 outline-none focus:outline-none">
						<LucideBookPlus className="w-4 h-4 mr-2" />
						Add Course
					</button>
				</div>
				{isLoading ? (
					<div className="flex items-center justify-center h-64 text-gray-600">
						<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
						<p className="ml-3">Loading course data...</p>
					</div>
				) : courses.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
						<p className="text-gray-500 mb-4 text-center">
							No courses have been added yet. Start by adding a new course!
						</p>
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, deskripsi atau komentar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>
						<DataTable
							columns={columns}
							data={filteredCourses}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md">
									<p className="flex">
										<span className="w-20 font-medium text-gray-900 mb-2">
											Jadwal:
										</span>
									</p>
									<span>
										{data.jadwal_kursus?.map((jadwal, index) => {
											const tanggalFormatted = jadwal.tanggal
												? new Date(
														jadwal.tanggal.replace(" ", "T")
												  ).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "long",
														year: "numeric",
												  })
												: "";
											return (
												<div key={index} className="mb-3">
													<p>
														{tanggalFormatted} {jadwal.waktu.slice(0, 5)} WIB |
														<span className="text-gray-500 ml-2">
															{jadwal.tempat}
														</span>
													</p>
												</div>
											);
										}) || <p>No schedules available</p>}
									</span>
								</div>
							)}
							noDataComponent={
								<p className="p-4 text-gray-500">No courses available</p>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminCoursesPage;
