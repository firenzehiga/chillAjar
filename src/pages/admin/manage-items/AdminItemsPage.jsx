import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Package, Plus, Pencil, Trash, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

export function AdminItemsPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	// Mock data untuk preview
	const [items, setItems] = useState([
		{
			id: 1,
			name: "1 Materi pembelajaran",
			price: 5000,
			description: "Belajar 1 topik materi dengan mentor",
			created_at: "2024-01-15",
		},
		{
			id: 2,
			name: "1 Bantuan tugas",
			price: 8000,
			description: "Bantuan mengerjakan 1 tugas dari mentor",
			created_at: "2024-01-15",
		},
		{
			id: 3,
			name: "2 Materi pembelajaran",
			price: 10000,
			description: "Belajar 2 topik materi dengan mentor",
			created_at: "2024-01-16",
		},
		{
			id: 4,
			name: "Review 24 jam",
			price: 3000,
			description: "Review hasil belajar dalam 24 jam",
			created_at: "2024-01-16",
		},
		{
			id: 5,
			name: "Follow-up session",
			price: 7000,
			description: "Sesi lanjutan 30 menit",
			created_at: "2024-01-17",
		},
	]);

	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Item ini akan dihapus dan tidak bisa dikembalikan!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				setItems(items.filter((item) => item.id !== id));
				Swal.fire("Deleted!", "Item berhasil dihapus.", "success");
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-item/${id}`);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Item",
			selector: (row) => row.name,
			sortable: true,
			width: "250px",
		},
		{
			name: "Harga",
			selector: (row) => `Rp ${row.price.toLocaleString()}`,
			sortable: true,
			width: "120px",
		},
		{
			name: "Deskripsi",
			selector: (row) => row.description,
			sortable: true,
			width: "300px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEdit(row.id)}
						className="text-blue-600 hover:text-blue-800 outline-none focus:outline-none"
						title="Edit">
						<Pencil className="w-4 h-4" />
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className="text-red-600 hover:text-red-800 outline-none focus:outline-none"
						title="Hapus">
						<Trash className="w-4 h-4" />
					</button>
				</div>
			),
			width: "80px",
		},
	];

	// Filter data untuk DataTable berdasarkan searchTerm
	const filteredItems = items.filter((item) => {
		const lower = searchTerm.toLowerCase();
		return (
			item.name?.toLowerCase().includes(lower) ||
			item.description?.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Package className="w-6 h-6 mr-2 text-yellow-600" />
					Master Items Paket
				</h1>
				<p className="text-gray-600">
					Kelola item-item yang bisa digunakan dalam paket
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Daftar Items</h2>
					<button
						onClick={() => onNavigate("admin-add-item")}
						className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 outline-none focus:outline-none">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Item
					</button>
				</div>

				{items.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">Belum Ada Items</h3>
						<p className="text-gray-500 mb-4 text-center">
							Mulai dengan menambahkan item untuk paket pembelajaran.
						</p>
					</div>
				) : (
					<>
						{/* Form pencarian */}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama item atau deskripsi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>

						{/* DataTable */}
						<DataTable
							columns={columns}
							data={filteredItems}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							noDataComponent={
								<p className="p-4 text-gray-500">Tidak ada item ditemukan</p>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminItemsPage;
