import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api.jsx";
import DataTable from "react-data-table-component";
import { Gift, Plus, Pencil, Trash, AlertCircle, Eye } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { UpdateLoadingSpinner } from "../../../components/Admin/UpdateLoadingSpinner";
import { BookLoader } from "../../../components/User/BookLoader";

export function AdminPackagesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	// UseQuery untuk fetch packages
	const {
		data: packages = [],
		isLoading,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["adminPackages"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/paket", {
				headers: { Authorization: `Bearer ${token}` },
			});
			// Mapping agar field sesuai database
			const mapped = response.data.map((pkg) => ({
				id: pkg.id,
				name: pkg.nama,
				description: pkg.deskripsi,
				totalPrice: pkg.harga_dasar || 0,
				diskon: pkg.diskon || 0,
				items:
					pkg.items?.map((item) => ({
						id: item.id,
						name: item.nama,
						price: item.harga,
						diskon: item.diskon || 0,
						jumlah_item: item.pivot?.jumlah_item || 1,
					})) || [],
				created_at: pkg.created_at,
				tanggal_mulai: pkg.tanggal_mulai,
				tanggal_berakhir: pkg.tanggal_berakhir,
				max_pembelian_per_user: pkg.max_pembelian_per_user,
			}));
			return mapped;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000, // 1 menit - cukup fresh tapi tidak terlalu sering refetch
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		retry: 1,
		onError: (err) => {
			console.error("Error fetching packages:", err);
		},
	});

	// UseMutation untuk delete package
	const deletePackageMutation = useMutation({
		mutationFn: async (id) => {
			const token = localStorage.getItem("token");
			return api.delete(`/paket/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
		},
		onSuccess: (_, id) => {
			// Update cache dengan menghapus package yang dihapus
			queryClient.setQueryData(["adminPackages"], (oldData) =>
				oldData.filter((pkg) => pkg.id !== id)
			);
			toast.success("Paket berhasil dihapus!");
		},
		onError: () => {
			Swal.fire("Error!", "Gagal menghapus paket.", "error");
		},
	});
	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
			icon: "warning",
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
					"px-4 py-2 focus:outline-none rounded-md bg-yellow-500 hover:bg-yellow-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then((result) => {
			if (result.isConfirmed) {
				deletePackageMutation.mutate(id);
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
			width: "250px",
		},
		{
			name: "Total Harga",
			selector: (row) => {
				// Hitung ulang berdasarkan harga aktual items (setelah diskon item diterapkan)
				const subtotalSetelahDiskonItems = row.items.reduce(
					(sum, item) => sum + Math.max(item.price - (item.diskon || 0), 0),
					0
				);
				// Kurangi dengan diskon paket
				const hargaAkhir = Math.max(
					subtotalSetelahDiskonItems - (row.diskon || 0),
					0
				);
				return `Rp ${hargaAkhir.toLocaleString()}`;
			},
			sortable: true,
			width: "200px",
		},
		{
			name: "Jumlah Item",
			selector: (row) => `${row.items.length} item`,
			sortable: true,
			width: "200px",
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
			width: "250px",
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

	// Jika Error saat fetching data terjadi, tampilkan pesan error
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data packages
				</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<Gift className="w-6 h-6 mr-2 text-yellow-600" />
					Manage Packages
				</h1>
				<p className="text-gray-600">
					Kelola paket pembelajaran yang terdiri dari kombinasi item-item
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Paket</h2>
					<button
						onClick={() => onNavigate("admin-add-package")}
						className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 outline-none focus:outline-none">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Paket
					</button>
				</div>

				{/* Tampilan Loading jika data belum selesai diambil  */}
				{isLoading ? (
					<div className="flex justify-center py-20">
						<BookLoader size="small" message="Loading Packages" />
					</div>
				) : (
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}

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
													<div className="text-right">
														{item.diskon > 0 ? (
															<div>
																<div className="line-through text-gray-400 text-xs">
																	Rp {item.price.toLocaleString()}
																</div>
																<div className="font-medium text-green-600">
																	Rp{" "}
																	{Math.max(
																		item.price - (item.diskon || 0),
																		0
																	).toLocaleString()}
																</div>
															</div>
														) : (
															<span className="font-medium text-yellow-600">
																Rp {item.price.toLocaleString()}
															</span>
														)}
													</div>
												</div>
											))}
										</div>
										<div className="mt-3 pt-2 border-t border-gray-200">
											{/* Rincian yang detail seperti di FormPackagePage */}
											<div className="text-sm text-gray-500 space-y-1 mb-2">
												<div className="flex justify-between">
													<span>Total harga asli items:</span>
													<span>
														Rp{" "}
														{data.items
															.reduce((sum, item) => sum + item.price, 0)
															.toLocaleString()}
													</span>
												</div>
												{data.items.some((item) => item.diskon > 0) && (
													<div className="flex justify-between text-green-600">
														<span>Diskon items:</span>
														<span>
															- Rp{" "}
															{data.items
																.reduce(
																	(sum, item) => sum + (item.diskon || 0),
																	0
																)
																.toLocaleString()}
														</span>
													</div>
												)}
												<div className="flex justify-between">
													<span>Subtotal setelah diskon items:</span>
													<span>
														Rp{" "}
														{data.items
															.reduce(
																(sum, item) =>
																	sum +
																	Math.max(item.price - (item.diskon || 0), 0),
																0
															)
															.toLocaleString()}
													</span>
												</div>
												{data.diskon > 0 && (
													<div className="flex justify-between text-orange-600">
														<span>Diskon paket:</span>
														<span>- Rp {data.diskon.toLocaleString()}</span>
													</div>
												)}
											</div>
											<div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
												<span>Total Harga Akhir:</span>
												<span className="text-yellow-600">
													Rp{" "}
													{Math.max(
														data.items.reduce(
															(sum, item) =>
																sum +
																Math.max(item.price - (item.diskon || 0), 0),
															0
														) - (data.diskon || 0),
														0
													).toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Packages
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada Packages yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Packages Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Mulai dengan menambahkan paket pembelajaran dari item
												yang tersedia.
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

export default AdminPackagesPage;
