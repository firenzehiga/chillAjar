import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
	UserCheck,
	Plus,
	Pencil,
	Trash,
	Star,
	AlertCircle,
} from "lucide-react";
import api from "../../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function AdminMentorsPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	const queryClient = useQueryClient();

	// Fetch data transaksi yang mencakup detail sesi
	const {
		data: mentors = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["adminMentors"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/admin/mentor", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched mentors:", response.data);
			return response.data;
		},
		retry: 1, // Hanya coba ulang sekali jika gagal
		onError: (err) => {
			console.error("Error fetching Mentors:", err);
		},
	});

	// Gunakan useMutation untuk delete
	const deleteMentorMutation = useMutation({
		// Function untuk menghapus mentor berdasarkan ID
		mutationFn: async (id) => {
			const token = localStorage.getItem("token"); // Ambil token dari local storage

			// Lakukan request DELETE ke endpoint kursus dengan menyertakan token di header
			return api.delete(`/admin/mentor/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		},
		// Kode ini akan dijalankan jika proses delete berhasil
		onSuccess: (_, id) => {
			// Hapus data course dari cache
			queryClient.setQueryData(["adminMentors"], (oldData) =>
				oldData.filter((mentor) => mentor.id !== id)
			);
			Swal.fire("Deleted!", "Mentor berhasil dihapus.", "success"); // Tampilkan pesan sukses
		},
		onError: () => {
			Swal.fire("Error!", "Gagal menghapus mentor.", "error"); // Tampilkan pesan error
		},
	});

	// Fungsi untuk menangani penghapusan mentor
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
				deleteMentorMutation.mutate(id); // Panggil fungsi deleteMutation dengan ID mentor
			}
		});
	};

	// Saat tombol edit diklik, navigasikan ke halaman edit course
	const handleEdit = (id) => {
		onNavigate(`admin-edit-mentor/${id}`);
	};

	// Kolom untuk DataTable
	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
			width: "80px",
			sortable: true,
		},
		{
			name: "Nama Mentor",
			selector: (row) => row.user?.nama,
			width: "180px",
			sortable: true,
		},
		{
			name: "Rating",
			cell: (row) => {
				let rating = row.rating;
				// Pastikan rating bertipe number dan valid sebelum menggunakan .toFixed(1).
				// Ini penting karena data dari backend/public API bisa saja null, string, atau NaN.
				// Jika rating tidak valid, tampilkan 0.0 agar UI tetap aman di semua environment.
				if (rating === null || rating === undefined || isNaN(Number(rating))) {
					rating = 0;
				} else {
					rating = Number(rating);
				}
				return (
					<div className="flex text-yellow-500">
						<Star className="w-4 h-4" fill="currentColor" />
						<span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
					</div>
				);
			},
			sortable: true,
			sortFunction: (a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0), // Handle undefined rating
		},
		{
			name: "Biaya Per Sesi",
			selector: (row) => `Rp ${row.biayaPerSesi?.toLocaleString() || "N/A"}`,
		},
		{ name: "Deskripsi", selector: (row) => row.deskripsi || "N/A" },
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

	// Jika Error saat fetching data terjadi, tampilkan pesan error
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data mentors
				</p>
			</div>
		);
	}

	// Sorting mentor berdasarkan nama (A-Z)
	const sortedMentors = mentors
		? [...mentors].sort((a, b) =>
				(a.user?.nama || "").localeCompare(b.user?.nama || "", "id", {
					sensitivity: "base",
				})
		  )
		: [];

	// Filter data untuk DataTable berdasarkan searchTerm
	const filteredMentors = sortedMentors.filter((p) => {
		const lower = searchTerm.toLowerCase();
		return p.user?.nama?.toLowerCase().includes(lower);
	});

	// Tampilan halaman
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<UserCheck className="w-6 h-6 mr-2 text-yellow-600" />
					Manage Mentors
				</h1>
				<p className="text-gray-600">Manage platform mentors</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Mentor Management</h2>
				</div>
				{/* Tampilan Loading jika data belum selesai diambil  */}
				{isLoading ? (
					<div className="flex items-center justify-center h-64 text-gray-600">
						<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
						<p className="ml-3">Loading mentors data...</p>
					</div>
				) : mentors.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">No Mentors Found</h3>
						<p className="text-gray-500 mb-4 text-center">
							You haven't added any mentors yet. Start by adding a new mentor.
						</p>
					</div>
				) : (
					// Jika data sudah ada, tampilkan DataTable
					<>
						{/* Form pencarian */}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama atau deskripsi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>
						{/* Tampilan DataTable */}
						<DataTable
							columns={columns}
							data={filteredMentors}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							// Tambahkan penanganan jika data kosong
							noDataComponent={
								<p className="p-4 text-gray-500">No mentors available</p>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminMentorsPage;
