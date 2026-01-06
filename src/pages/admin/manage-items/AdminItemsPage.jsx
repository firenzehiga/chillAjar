import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Package, Plus, Pencil, Trash, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api.jsx";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { UpdateLoadingSpinner } from "../../../components/Admin/UpdateLoadingSpinner";
import { BookLoader } from "../../../components/ui/BookLoader.jsx";

export function AdminItemsPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	// UseQuery untuk fetch items
	const {
		data: items = [],
		isLoading,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["adminItems"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/item-paket", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return Array.isArray(response.data)
				? response.data.map((item) => ({
						id: item.id,
						name: item.nama,
						price: item.harga,
						diskon: item.diskon || 0,
						description: item.deskripsi,
						created_at: item.created_at,
				  }))
				: [];
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000, // 1 menit - cukup fresh tapi tidak terlalu sering refetch
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		retry: 1,
		onError: (err) => {
			console.error("Error fetching items:", err);
		},
	});

	// UseMutation untuk delete item
	const deleteItemMutation = useMutation({
		mutationFn: async (id) => {
			const token = localStorage.getItem("token");
			return api.delete(`/item-paket/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		},
		onSuccess: (_, id) => {
			// Update cache dengan menghapus item yang dihapus
			queryClient.setQueryData(["adminItems"], (oldData) =>
				oldData.filter((item) => item.id !== id)
			);
			toast.success("Item berhasil dihapus!");
		},
		onError: () => {
			Swal.fire("Error!", "Gagal menghapus item.", "error");
		},
	});

	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Item ini akan dihapus dan tidak bisa dikembalikan!",
			icon: "warning",
			iconColor: "#DC2626",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-red-600 hover:bg-red-700 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				deleteItemMutation.mutate(id);
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-item/${id}`);
	};

	const handleToggleActive = (id) => {
		// Remove this function since items don't have status anymore
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
			width: "300px",
		},
		{
			name: "Harga",
			selector: (row) => {
				const hargaAkhir = Math.max((row.price || 0) - (row.diskon || 0), 0);
				return `Rp ${hargaAkhir.toLocaleString()}`;
			},
			sortable: true,
			width: "220px",
		},
		{
			name: "Deskripsi",
			cell: (row) => (
				<div>
					<div>{row.description}</div>
					{row.diskon > 0 && (
						<div className="text-xs text-gray-500 mt-1">
							Rincian: (Harga Rp {row.price.toLocaleString()}) - Diskon Rp{" "}
							{row.diskon.toLocaleString()} = Rp{" "}
							{Math.max(
								(row.price || 0) - (row.diskon || 0),
								0
							).toLocaleString()}
						</div>
					)}
				</div>
			),
			sortable: true,
			width: "450px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEdit(row.id)}
						className="text-yellow-500 hover:text-yellow-600 outline-none focus:outline-none"
						title="Edit Data">
						<Pencil className="w-4 h-4" />
					</button>
					<button
						onClick={() => handleDelete(row.id)}
						className="text-red-600 hover:text-red-800 outline-none focus:outline-none"
						title="Hapus Data">
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

	// Jika Error saat fetching data terjadi, tampilkan pesan error
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data items
				</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Package className="w-6 h-6 mr-2 text-chill-blue" />
					Manage Items
				</h1>
				<p className="text-gray-600">
					Kelola item-item yang bisa digunakan dalam paket
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Item</h2>
					<button
						onClick={() => onNavigate("admin-add-item")}
						className="flex items-center px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-chill-blue-dark outline-none focus:outline-none">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Item
					</button>
				</div>

				{/* Tampilan Loading jika data belum selesai diambil  */}
				{isLoading ? (
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading Items" />
					</div>
				) : (
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}

						{/* Form pencarian */}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama item atau deskripsi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						{/* DataTable */}
						<DataTable
							columns={columns}
							data={filteredItems}
							pagination
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Item
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada item yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Item Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Mulai dengan menambahkan item untuk paket pembelajaran.
											</p>
										</div>
									)}
								</>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminItemsPage;
