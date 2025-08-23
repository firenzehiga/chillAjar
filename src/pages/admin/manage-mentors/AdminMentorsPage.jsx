import React, { useState } from "react";
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
import toast from "react-hot-toast";
import { UpdateLoadingSpinner } from "../../../components/Admin/UpdateLoadingSpinner";
import { LoadingSpinner } from "../../../components/Admin/LoadingSpinner";
export function AdminMentorsPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	const queryClient = useQueryClient();

	// Fetch data transaksi yang mencakup detail sesi
	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	const {
		data: mentors = [],
		isLoading,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["adminMentors"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/admin/mentor", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000, // 1 menit - cukup fresh tapi tidak terlalu sering refetch
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		retry: 1,

		onError: (err) => {
			console.error("Error fetching Mentors:", err);
		},
	});

	// Gunakan useMutation untuk delete
	const deleteMentorMutation = useMutation({
		// Function untuk menghapus mentor berdasarkan ID
		mutationFn: async (id) => {
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
			// Invalidate related queries for immediate refresh on public pages
			queryClient.invalidateQueries(["publicMentorsPage"]);
			queryClient.invalidateQueries(["courses"]);
			toast.success("Mentor berhasil dihapus."); // Tampilkan pesan sukses
		},
		onError: () => {
			Swal.fire("Error!", "Gagal menghapus mentor.", "error");
		},
	});

	// Update mutation untuk menggunakan endpoint edit yang sudah ada
	const toggleStatusMutation = useMutation({
		mutationFn: async ({ mentorId, newStatus }) => {
			// Gunakan endpoint PUT/PATCH yang sudah ada untuk edit mentor
			const response = await api.put(
				`/admin/mentor/${mentorId}`,
				{
					status: newStatus,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		},
		onSuccess: (_, { mentorId, newStatus }) => {
			// Update cache optimistically
			queryClient.setQueryData(["adminMentors"], (oldData) =>
				oldData.map((mentor) =>
					mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
				)
			);

			const statusText =
				newStatus === "active" ? "diaktifkan" : "dinonaktifkan";
			toast.success(`Mentor berhasil ${statusText}.`);
		},
		onError: (error) => {
			console.error("Error toggling mentor status:", error);
			Swal.fire({
				icon: "error",
				title: "Error!",
				text: "Gagal mengubah status mentor.",
			});
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

	// Function untuk toggle status mentor
	const handleToggleStatus = (mentor) => {
		const newStatus = mentor.status === "active" ? "inactive" : "active";
		const actionText =
			newStatus === "active" ? "mengaktifkan" : "menonaktifkan";

		Swal.fire({
			title: "Konfirmasi",
			text: `Apakah Anda yakin ingin ${actionText} mentor ${mentor.user?.nama}?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: newStatus === "active" ? "#10B981" : "#EF4444",
			cancelButtonColor: "#6B7280",
			confirmButtonText: "Ya, ubah status!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				toggleStatusMutation.mutate({
					mentorId: mentor.id,
					newStatus: newStatus,
				});
			}
		});
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
			name: "Status",
			selector: (row) => row.status || "N/A",
			cell: (row) => {
				const status = row.status || "N/A";
				const isActive = status === "active";
				const isPending = status === "pending";
				const isRejected = status === "rejected";

				// Jika pending atau rejected, tampilkan badge biasa tanpa toggle
				if (isPending || isRejected) {
					let color = "bg-gray-300 text-gray-700";
					if (isPending) color = "bg-yellow-100 text-yellow-800";
					else if (isRejected)
						color = "bg-gray-200 text-gray-500 border border-gray-300";

					return (
						<span
							className={`px-3 py-1 rounded-full text-xs font-semibold ${color} border border-opacity-30`}
							style={{
								minWidth: 70,
								display: "inline-block",
								textAlign: "center",
							}}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</span>
					);
				}

				// Untuk active/inactive, tampilkan toggle switch
				return (
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handleToggleStatus(row)}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
								isActive
									? "bg-green-500 hover:bg-green-600"
									: "bg-gray-300 hover:bg-gray-400"
							} cursor-pointer`}>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									isActive ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
						<span
							className={`text-xs font-medium ${
								isActive ? "text-green-700" : "text-gray-600"
							}`}>
							{isActive ? "Active" : "Inactive"}
						</span>
					</div>
				);
			},
		},
		{
			name: "Tanggal Bergabung",
			selector: (row) => row.created_at || "N/A",
			cell: (row) => {
				const date = new Date(row.created_at);
				return date.toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
				});
			},
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

	// Sorting mentor berdasarkan tanggal dibuat (terbaru di atas) saja
	const sortedMentors = mentors
		? [...mentors].sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
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
				{/* Tampilan Loading hanya untuk initial load */}
				{isLoading ? (
					<LoadingSpinner message="Loading mentors data..." />
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
							expandableRows
							expandableRowsComponent={({ data }) => {
								// Handler untuk download dokumen mentor (ikuti teknik bukti pembayaran)
								const handleDownloadDokumen = async (mentor) => {
									// Validasi awal yang lebih ketat (sama seperti bukti pembayaran)
									if (
										!mentor.dokumen_pendukung ||
										mentor.dokumen_pendukung.trim() === "" ||
										mentor.dokumen_pendukung === "null" ||
										mentor.dokumen_pendukung === "undefined"
									) {
										Swal.fire({
											title: "File Tidak Tersedia",
											text: "Tidak ada dokumen pendukung yang dapat diunduh.",
											icon: "warning",
											confirmButtonText: "OK",
											confirmButtonColor: "#F59E0B",
										});
										return;
									}

									// Tampilkan loading indicator (sama seperti bukti pembayaran)
									Swal.fire({
										title: "Mengunduh File...",
										text: "Mohon tunggu, sedang memproses download.",
										allowOutsideClick: false,
										allowEscapeKey: false,
										showConfirmButton: false,
										didOpen: () => {
											Swal.showLoading();
										},
									});

									try {
										// Download melalui backend API dengan cache busting
										const timestamp = new Date().getTime(); // Cache busting
										const response = await api.get(
											`/admin/download-dokumen-mentor/${mentor.id}?t=${timestamp}`, // Tambah timestamp
											{
												headers: {
													Authorization: `Bearer ${token}`,
													"Cache-Control": "no-cache", // Force no cache
													Pragma: "no-cache", // Force no cache untuk HTTP/1.0
												},
												responseType: "blob", // Penting untuk file download
											}
										);

										// Tutup loading
										Swal.close();

										// Buat nama file deskriptif di frontend
										const mentorNama = mentor.user?.nama || "Unknown";
										const tanggal = mentor.created_at
											? new Date(mentor.created_at)
													.toLocaleDateString("id-ID")
													.replace(/\//g, "-")
											: new Date()
													.toLocaleDateString("id-ID")
													.replace(/\//g, "-");

										// Deteksi ekstensi dari dokumen_pendukung path
										const originalPath = mentor.dokumen_pendukung || "";
										const extension = originalPath.includes(".")
											? "." + originalPath.split(".").pop().toLowerCase()
											: ".pdf";

										const fileName = `DokumenMentor_${mentorNama.replace(
											/\s+/g,
											"_"
										)}_${tanggal}${extension}`;

										// Buat URL object untuk blob
										const downloadUrl = window.URL.createObjectURL(
											response.data
										);

										// Buat element anchor untuk download
										const link = document.createElement("a");
										link.href = downloadUrl;
										link.download = fileName;
										link.style.display = "none";

										// Tambahkan ke DOM, klik, lalu hapus
										document.body.appendChild(link);
										link.click();
										document.body.removeChild(link);

										// Bersihkan URL object
										window.URL.revokeObjectURL(downloadUrl);

										// Tampilkan notifikasi sukses
										toast.success(`CV ${mentorNama} berhasil diunduh`);
									} catch (error) {
										console.error("Error downloading dokumen:", error);

										// Tutup loading jika masih terbuka
										Swal.close();

										// Handle berbagai jenis error dengan lebih spesifik (sama seperti bukti pembayaran)
										if (
											error.response?.status === 404 ||
											error.response?.status === 403
										) {
											// File tidak ditemukan di server atau forbidden
											Swal.fire({
												title: "File Tidak Tersedia",
												text: "File dokumen pendukung tidak ditemukan di server. Kemungkinan file telah dihapus atau belum terupload dengan benar.",
												icon: "warning",
												confirmButtonText: "Tutup",
												confirmButtonColor: "#3085d6",
											});
										} else if (error.response?.status === 401) {
											// Unauthorized - token expired
											Swal.fire({
												title: "Sesi Berakhir",
												text: "Sesi login Anda telah berakhir. Silakan login kembali.",
												icon: "warning",
												confirmButtonText: "OK",
												confirmButtonColor: "#F59E0B",
											}).then(() => {
												window.location.reload();
											});
										} else if (error.response?.status === 500) {
											// Server error
											Swal.fire({
												title: "Kesalahan Server",
												text: "Terjadi kesalahan pada server. Silakan coba lagi nanti atau hubungi admin.",
												icon: "error",
												confirmButtonText: "OK",
												confirmButtonColor: "#EF4444",
											});
										} else if (
											error.message &&
											error.message.includes("Network Error")
										) {
											// Network issues
											Swal.fire({
												title: "Masalah Koneksi",
												text: "Periksa koneksi internet Anda dan coba lagi.",
												icon: "error",
												showCancelButton: true,
												confirmButtonText: "Coba Lagi",
												cancelButtonText: "Batal",
												confirmButtonColor: "#3085d6",
												cancelButtonColor: "#6B7280",
											}).then((result) => {
												if (result.isConfirmed) {
													handleDownloadDokumen(mentor);
												}
											});
										} else {
											// Generic error
											const errorStatus = error.response?.status || "Unknown";
											const errorMessage =
												error.response?.data?.message ||
												error.message ||
												"Kesalahan tidak diketahui";

											Swal.fire({
												title: "Download Gagal",
												text: `Error ${errorStatus}: ${errorMessage}`,
												icon: "error",
												confirmButtonText: "OK",
												confirmButtonColor: "#EF4444",
											});
										}
									}
								};

								// Cek apakah dokumen_pendukung ada tapi hanya berupa string kosong atau placeholder (sama seperti bukti pembayaran)
								const hasDokumenPendukung =
									data.dokumen_pendukung &&
									data.dokumen_pendukung.trim() !== "" &&
									data.dokumen_pendukung !== "null" &&
									data.dokumen_pendukung !== "undefined";

								return (
									<div className="p-4 bg-gray-50 rounded-md">
										<p className="text-gray-600 mb-1">Dokumen Pendukung:</p>
										{hasDokumenPendukung ? (
											<div className="mt-2">
												<button
													onClick={() => handleDownloadDokumen(data)}
													className="inline-block no-underline px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition cursor-pointer border border-yellow-300">
													📄 Download (DokumenMentor_
													{data.user?.nama?.replace(/\s+/g, "_") || "mentor"}.
													{data.dokumen_pendukung.split(".").pop()})
												</button>
											</div>
										) : (
											<div className="flex items-center mt-2">
												<AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
												<span className="text-orange-600 text-xs font-medium">
													Tidak ada file
												</span>
											</div>
										)}
									</div>
								);
							}}
							// Tambahkan penanganan jika data kosong
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Mentor
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada Mentor yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Mentor Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Belum ada Mentor.
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

export default AdminMentorsPage;
