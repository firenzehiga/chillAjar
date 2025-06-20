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
			// Mapping agar sesi.jadwal_kursus selalu ada, baik dari jadwalKursus atau jadwal_kursus
			return response.data.map((t) => ({
				...t,
				sesi: t.sesi
					? {
							...t.sesi,
							jadwal_kursus:
								t.sesi.jadwal_kursus || t.sesi.jadwalKursus || null,
					  }
					: t.sesi,
			}));
		},
		retry: 1, // Hanya coba ulang sekali jika gagal
		onError: (err) => {
			console.error("Error fetching testimonies:", err);
		},
	});

	const deleteTestimonyMutation = useMutation({
		mutationFn: async (id) => {
			const token = localStorage.getItem("token");
			return api.delete(`/testimoni/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		},
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminTestimonies"], (oldData) =>
				oldData.filter((t) => t.id !== id)
			);
			Swal.fire("Deleted!", "Testimoni berhasil dihapus.", "success");
		},
		onError: () => {
			Swal.fire("Error!", "Gagal menghapus testimoni.", "error");
		},
	});

	const handleDelete = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				deleteTestimonyMutation.mutate(id);
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-testimonial/${id}`);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Pelanggan",
			selector: (row) => row.pelanggan?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Mentor",
			selector: (row) => row.mentor?.user?.nama || "-",
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
			selector: (row) => {
				// [gayaMengajar JADWAL ONLY] Ambil mode belajar hanya dari jadwal_kursus.gayaMengajar pada sesi
				const mode = row.sesi?.jadwal_kursus?.gayaMengajar;
				if (mode === "online") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Online
						</span>
					);
				} else if (mode === "offline") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
							Offline
						</span>
					);
				} else if (mode === undefined || mode === null) {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Belum diisi
						</span>
					);
				} else {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
							Data mode tidak valid
						</span>
					);
				}
			},
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

	// Sorting testimoni terbaru di paling atas
	const sortedTestimonies = [...testimonies].sort(
		(a, b) =>
			new Date(b.created_at || b.tanggal) - new Date(a.created_at || a.tanggal)
	);

	// Filter data berdasarkan searchTerm
	const filteredTestimonies = sortedTestimonies.filter((p) => {
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
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Testimonial Management</h2>
				</div>
				{isLoading ? (
					<div className="flex items-center justify-center h-64 text-gray-600">
						<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
						<p className="ml-3">Loading course data...</p>
					</div>
				) : testimonies.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							No Testimonies Available
						</h3>
						<p className="text-gray-500 mb-4 text-center">
							No User has added any testimonies yet.
						</p>
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau komentar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
							noDataComponent={
								<p className="p-4 text-gray-500">No Testimonies available</p>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminTestimoniesPage;
