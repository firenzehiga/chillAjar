import React from "react";
import DataTable from "react-data-table-component";
import { BookOpen, AlertCircle, Star, Pencil, Trash } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AdminTestimoniesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	const queryClient = useQueryClient();

	// Fetch data transaksi yang mencakup detail sesi
	const {
		data: testimonies = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["adminTestimonies"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/testimoni", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched testimonies:", response.data);
			return response.data;
		},
		retry: 1, // Hanya coba ulang sekali jika gagal
		onError: (err) => {
			console.error("Error fetching testimonies:", err);
		},
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
					await api.delete(`/testimoni/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});

					queryClient.setQueryData(["adminTestimonies"], (oldData) =>
						oldData.filter((testimonies) => testimonies.id !== id)
					);
					Swal.fire("Deleted!", "testimoni has been deleted.", "success");
				} catch (err) {
					Swal.fire("Error!", "Failed to delete testimoni.", "error");
				}
			}
		});
	};

	// Filter data berdasarkan searchTerm
	const filteredTestimonies = testimonies.filter((p) => {
		const lower = searchTerm.toLowerCase();
		const tanggalFormatted = p.tanggal
			? new Date(p.tanggal.replace(" ", "T")).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
			  })
			: "";
		return (
			p.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower) ||
			p.sesi?.kursus?.namaKursus?.toLowerCase().includes(lower) ||
			p.komentar?.toLowerCase().includes(lower) ||
			tanggalFormatted.toLowerCase().includes(lower)
		);
	});

	const handleEdit = (id) => {
		onNavigate(`admin-edit-testimonials/${id}`);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Mentor",
			selector: (row) => row.mentor?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Pelanggan",
			selector: (row) => row.pelanggan?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Kursus",
			selector: (row) => row.sesi?.kursus?.namaKursus || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Rating",
			cell: (row) => {
				const rating = row.rating || 0;
				const stars = Math.min(5, Math.max(0, rating)); // Pastikan rating antara 0-5
				return (
					<div className="flex items-center">
						{[...Array(stars)].map((_, index) => (
							<Star
								key={index}
								className="w-4 h-4 text-yellow-400 fill-current"
							/>
						))}
						{stars < 5 &&
							[...Array(5 - stars)].map((_, index) => (
								<Star key={index + stars} className="w-4 h-4 text-gray-300" />
							))}
					</div>
				);
			},
			sortable: false, // Sorting dinonaktifkan karena ini adalah render visual
			width: "150px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) =>
				row.sesi?.kursus?.gayaMengajar === "online" ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						Online
					</span>
				) : row.sesi?.kursus?.gayaMengajar === "offline" ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
						Offline
					</span>
				) : (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						-
					</span>
				),
			width: "200px",
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
					Gagal mengambil data transaksi
				</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
					Mentor Testimonials
				</h1>
				<p className="text-gray-600">Overview of your mentors' testimonials</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				{isLoading ? (
					<div className="flex items-center justify-center h-64 text-gray-600">
						<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
						<p className="ml-3">Loading course data...</p>
					</div>
				) : testimonies.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No Schedules Available
						</h3>
						<p className="text-gray-500 mb-4 text-center">
							You haven't added any schedules yet. Start by adding a new course
							to teach!
						</p>
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau metode..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>
						<DataTable
							columns={columns}
							data={filteredTestimonies}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md">
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Komentar:
										</span>
										<span>{data.komentar || "Tidak ada"}</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Tanggal Review:
										</span>
										<span className="capitalize">{data.tanggal || "-"}</span>
									</p>
								</div>
							)}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminTestimoniesPage;
