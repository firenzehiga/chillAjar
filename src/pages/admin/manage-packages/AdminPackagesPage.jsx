import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Gift, Plus, Pencil, Trash, AlertCircle, Eye } from "lucide-react";
import Swal from "sweetalert2";

export function AdminPackagesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	// Mock data untuk preview
	const [packages, setPackages] = useState([
		{
			id: 1,
			name: "NgeChill",
			description: "Paket dasar untuk pembelajaran santai",
			items: [{ id: 1, name: "1 Materi pembelajaran", price: 5000 }],
			totalPrice: 5000,
			created_at: "2024-01-15",
			tanggal_mulai: null,
			tanggal_berakhir: null,
		},
		{
			id: 2,
			name: "NgeTask & Chill",
			description: "Paket lengkap pembelajaran + tugas",
			items: [
				{ id: 1, name: "1 Materi pembelajaran", price: 5000 },
				{ id: 2, name: "1 Bantuan tugas", price: 8000 },
			],
			totalPrice: 13000,
			created_at: "2024-01-15",
			tanggal_mulai: "2024-01-20",
			tanggal_berakhir: "2024-02-29",
		},
		{
			id: 3,
			name: "Premium Learning",
			description: "Paket maksimal dengan review",
			items: [
				{ id: 3, name: "2 Materi pembelajaran", price: 10000 },
				{ id: 2, name: "1 Bantuan tugas", price: 8000 },
				{ id: 4, name: "Review 24 jam", price: 3000 },
			],
			totalPrice: 21000,
			created_at: "2024-01-16",
			tanggal_mulai: "2024-01-01",
			tanggal_berakhir: "2024-12-31",
		},
	]);

	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Paket ini akan dihapus dan tidak bisa dikembalikan!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				setPackages(packages.filter((pkg) => pkg.id !== id));
				Swal.fire("Deleted!", "Paket berhasil dihapus.", "success");
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-package/${id}`);
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Paket",
			selector: (row) => row.name,
			sortable: true,
			width: "200px",
		},
		{
			name: "Total Harga",
			selector: (row) => `Rp ${row.totalPrice.toLocaleString()}`,
			sortable: true,
			width: "120px",
		},
		{
			name: "Jumlah Item",
			selector: (row) => `${row.items.length} item`,
			sortable: true,
			width: "100px",
		},
		{
			name: "Status Promo",
			cell: (row) => {
				if (!row.tanggal_mulai || !row.tanggal_berakhir) {
					return (
						<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
							Tidak Terbatas
						</span>
					);
				}

				const now = new Date();
				const startDate = new Date(row.tanggal_mulai);
				const endDate = new Date(row.tanggal_berakhir);

				if (now < startDate) {
					return (
						<span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
							Akan Datang
						</span>
					);
				} else if (now >= startDate && now <= endDate) {
					return (
						<span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
							Aktif
						</span>
					);
				} else {
					return (
						<span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
							Berakhir
						</span>
					);
				}
			},
			sortable: false,
			width: "120px",
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
	const filteredPackages = packages.filter((pkg) => {
		const lower = searchTerm.toLowerCase();
		return (
			pkg.name?.toLowerCase().includes(lower) ||
			pkg.description?.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Gift className="w-6 h-6 mr-2 text-yellow-600" />
					Kelola Paket
				</h1>
				<p className="text-gray-600">
					Kelola paket pembelajaran yang terdiri dari kombinasi items
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Daftar Paket</h2>
					<button
						onClick={() => onNavigate("admin-add-package")}
						className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 outline-none focus:outline-none">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Paket
					</button>
				</div>

				{packages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">Belum Ada Paket</h3>
						<p className="text-gray-500 mb-4 text-center">
							Mulai dengan menambahkan paket pembelajaran dari items yang
							tersedia.
						</p>
					</div>
				) : (
					<>
						{/* Form pencarian */}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama paket atau deskripsi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>

						{/* DataTable */}
						<DataTable
							columns={columns}
							data={filteredPackages}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-3 bg-gray-50 rounded-md">
									<div>
										<span className="font-medium text-gray-900">
											Deskripsi:
										</span>
										<p className="text-gray-600 mt-1">{data.description}</p>
									</div>
									<div>
										<span className="font-medium text-gray-900 mb-2 block">
											Items dalam paket:
										</span>
										<div className="space-y-2">
											{data.items.map((item, index) => (
												<div
													key={index}
													className="flex justify-between items-center bg-white p-2 rounded border">
													<span className="text-gray-700">{item.name}</span>
													<span className="font-medium text-yellow-600">
														Rp {item.price.toLocaleString()}
													</span>
												</div>
											))}
										</div>
										<div className="mt-3 pt-2 border-t border-gray-200">
											<div className="flex justify-between items-center font-semibold">
												<span>Total Harga:</span>
												<span className="text-yellow-600">
													Rp {data.totalPrice.toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
							noDataComponent={
								<p className="p-4 text-gray-500">Tidak ada paket ditemukan</p>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminPackagesPage;
