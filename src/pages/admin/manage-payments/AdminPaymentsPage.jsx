import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { AlertCircle, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { getImageUrl } from "../../../utils/getImageUrl";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../../../components/Admin/LoadingSpinner";
import { UpdateLoadingSpinner } from "../../../components/Admin/UpdateLoadingSpinner";
import { ExportData } from "../../../components/Admin/ExportData";
import { formatDate } from "../../../utils/dateFormatter";
import { form } from "framer-motion/client";

export function AdminPaymentsPage() {
	const [previewImg, setPreviewImg] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;
	// Fetch data pembayaran menggunakan useQuery
	const {
		data: payments = [],
		isLoading,
		error,
		isFetching,
	} = useQuery({
		queryKey: ["adminPayments"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await api.get("/transaksi", {
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

		onError: () => {
			setError("Gagal mengambil data pembayaran");
		},
	});

	// Mutasi untuk verifikasi pembayaran
	const verifikasiMutation = useMutation({
		mutationFn: async (transaksiId) => {
			const token = localStorage.getItem("token");
			await api.post(
				`/admin/verifikasi-pembayaran/${transaksiId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		},
		onSuccess: () => {
			Swal.fire({
				title: "Berhasil!",
				text: "Pembayaran telah diverifikasi.",
				icon: "success",
				timerProgressBar: true,
				showConfirmButton: false,
				timer: 1500,
			});
			// Invalidate query untuk memaksa refetch data
			queryClient.invalidateQueries(["adminPayments"]);
		},
		onError: () => {
			Swal.fire("Gagal", "Terjadi kesalahan saat verifikasi.", "error");
		},
	});

	// Mutasi untuk menolak pembayaran
	const tolakMutation = useMutation({
		mutationFn: async (transaksiId) => {
			const token = localStorage.getItem("token");
			await api.post(
				`/admin/tolak-pembayaran/${transaksiId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		},
		onSuccess: () => {
			Swal.fire({
				title: "Ditolak!",
				text: "Pembayaran telah ditolak.",
				icon: "info",
				timerProgressBar: true,
				showConfirmButton: false,
				timer: 1500,
			});
			// Invalidate query untuk memaksa refetch data
			queryClient.invalidateQueries(["adminPayments"]);
		},
		onError: () => {
			Swal.fire("Gagal", "Terjadi kesalahan saat menolak pembayaran.", "error");
		},
	});

	// Handler untuk tombol Setujui
	const handleVerifikasi = (transaksiId) => {
		Swal.fire({
			title: "Verifikasi Pembayaran?",
			text: "Pastikan pembayaran sudah benar sebelum menyetujui.",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, setujui!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				verifikasiMutation.mutate(transaksiId);
			}
		});
	};

	// Handler untuk tombol Tolak
	const handleTolak = (transaksiId) => {
		Swal.fire({
			title: "Yakin ingin menolak?",
			text: "Pembayaran akan dihapus!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
		}).then((result) => {
			if (result.isConfirmed) {
				tolakMutation.mutate(transaksiId);
			}
		});
	};

	// Handler untuk download bukti pembayaran melalui backend
	const handleDownload = async (row) => {
		// Validasi awal yang lebih ketat
		if (
			!row.buktiPembayaran ||
			row.buktiPembayaran.trim() === "" ||
			row.buktiPembayaran === "null" ||
			row.buktiPembayaran === "undefined"
		) {
			Swal.fire({
				title: "File Tidak Tersedia",
				text: "Tidak ada file bukti pembayaran yang dapat diunduh.",
				icon: "warning",
				confirmButtonText: "OK",
				confirmButtonColor: "#F59E0B",
			});
			return;
		}

		// Tampilkan loading indicator
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
				`/admin/download-bukti-pembayaran/${row.id}?t=${timestamp}`, // Tambah timestamp untuk cache busting
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

			// Buat nama file
			const pelangganNama = row.pelanggan?.user?.nama || "Unknown";
			const kursusNama = row.sesi?.kursus?.namaKursus || "Course";
			const tanggal = row.tanggalPembayaran
				? new Date(row.tanggalPembayaran.replace(" ", "T"))
						.toLocaleDateString("id-ID")
						.replace(/\//g, "-")
				: new Date().toLocaleDateString("id-ID").replace(/\//g, "-");

			// Deteksi ekstensi dari buktiPembayaran path
			const originalPath = row.buktiPembayaran || "";
			const extension = originalPath.includes(".")
				? "." + originalPath.split(".").pop().toLowerCase()
				: ".jpg";

			const fileName = `BuktiPembayaran_${pelangganNama.replace(
				/\s+/g,
				"_"
			)}_${kursusNama.replace(/\s+/g, "_")}_${tanggal}${extension}`;

			// Buat URL object untuk blob
			const downloadUrl = window.URL.createObjectURL(response.data);

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
			toast.success(`Bukti pembayaran berhasil diunduh`);
		} catch (error) {
			console.error("Error downloading image:", error);

			// Tutup loading jika masih terbuka
			Swal.close();

			// Handle berbagai jenis error dengan lebih spesifik
			if (error.response?.status === 404 || error.response?.status === 403) {
				// File tidak ditemukan di server atau forbidden (file tidak ada)
				Swal.fire({
					title: "File Tidak Tersedia",
					text: "File bukti pembayaran tidak ditemukan di server. Kemungkinan file telah dihapus atau belum terupload dengan benar.",
					icon: "warning",
					showCancelButton: true,
					confirmButtonText: "Buka Preview",
					cancelButtonText: "Tutup",
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#6B7280",
				}).then((result) => {
					if (result.isConfirmed) {
						// Coba buka preview gambar jika user mau
						try {
							const imageUrl = getImageUrl(
								row.buktiPembayaran,
								"bukti_pembayaran"
							);
							window.open(imageUrl, "_blank");
						} catch (previewError) {
							Swal.fire({
								title: "Preview Gagal",
								text: "File tidak dapat dibuka. Silakan hubungi admin sistem.",
								icon: "error",
								confirmButtonColor: "#EF4444",
							});
						}
					}
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
					// Redirect ke login atau refresh page
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
			} else if (error.message && error.message.includes("Network Error")) {
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
						// Retry download
						handleDownload(row);
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
					html: `
						<div class="text-left">
							<p class="mb-2">Gagal mengunduh file bukti pembayaran.</p>
							<details class="text-sm text-gray-600">
								<summary class="cursor-pointer font-medium">Detail Error</summary>
								<div class="mt-2 p-2 bg-gray-100 rounded">
									<p><strong>Status:</strong> ${errorStatus}</p>
									<p><strong>Pesan:</strong> ${errorMessage}</p>
								</div>
							</details>
						</div>
					`,
					icon: "error",
					confirmButtonText: "Tutup",
					confirmButtonColor: "#EF4444",
				});
			}
		}
	};

	const statusCheck = {
		verified: {
			label: "Disetujui",
			class:
				"inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
		accepted: {
			label: "Accepted",
			class:
				"inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
		rejected: {
			label: "Ditolak",
			class:
				"inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset",
		},
		menunggu_verifikasi: {
			label: "Menunggu Verifikasi",
			class:
				"inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
		},
		lunas: {
			label: "Lunas",
			class:
				"inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
	};

	// Define columns for CSV export
	const csvColumns = [
		{
			key: "pelanggan",
			header: "Pelanggan",
			formatter: (row) => row.pelanggan?.user?.nama || "-",
		},
		{
			key: "kursus",
			header: "Kursus",
			formatter: (row) => row.sesi?.kursus?.namaKursus || "-",
		},
		{
			key: "tanggalPembayaran",
			header: "Tanggal Bayar",
			formatter: (row) => {
				return formatDate(row.tanggalPembayaran);
			},
		},
		{
			key: "statusPembayaran",
			header: "Status",
			formatter: (row) => {
				const status = statusCheck[row.statusPembayaran];
				return status ? status.label : "-";
			},
		},
		{
			key: "buktiPembayaran",
			header: "Bukti Pembayaran",
			formatter: (row) =>
				row.buktiPembayaran &&
				row.buktiPembayaran.trim() !== "" &&
				row.buktiPembayaran !== "null" &&
				row.buktiPembayaran !== "undefined"
					? "Ada"
					: "Tidak Ada",
		},
		{
			key: "jumlah",
			header: "Jumlah",
			formatter: (row) =>
				row.jumlah ? `Rp${Number(row.jumlah).toLocaleString("id-ID")}` : "-",
		},
		{
			key: "mentor",
			header: "Mentor",
			formatter: (row) => row.mentor?.user?.nama || "-",
		},
		{
			key: "metodePembayaran",
			header: "Metode Pembayaran",
			formatter: (row) => row.metodePembayaran || "-",
		},
	];

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			width: "60px",
		},
		{
			name: "Pelanggan",
			selector: (row) => row.pelanggan?.user?.nama || "-",
			sortable: true,
		},
		{
			name: "Kursus",
			selector: (row) => row.sesi?.kursus?.namaKursus || "-",
			sortable: true,
		},
		{
			name: "Tanggal Bayar",
			selector: (row) => {
				return formatDate(row.tanggalPembayaran);
			},
			sortable: true,
		},
		{
			name: "Status",
			cell: (row) => {
				const status = statusCheck[row.statusPembayaran];
				return status ? (
					<span className={`${status.class}`}>{status.label}</span>
				) : (
					<span className="text-gray-400 text-sm">-</span>
				);
			},
			sortable: true,
			width: "190px",
		},
		{
			name: "Bukti",
			cell: (row) => {
				const imageUrl = row.buktiPembayaran
					? getImageUrl(row.buktiPembayaran, "bukti_pembayaran")
					: null;

				// Cek apakah buktiPembayaran ada tapi hanya berupa string kosong atau placeholder
				const hasBuktiPembayaran =
					row.buktiPembayaran &&
					row.buktiPembayaran.trim() !== "" &&
					row.buktiPembayaran !== "null" &&
					row.buktiPembayaran !== "undefined";

				return hasBuktiPembayaran ? (
					<div className="flex space-x-2">
						<button
							className="text-blue-600 hover:text-blue-800 flex items-center mr-3 outline-none focus:outline-none transition-colors"
							onClick={() => setPreviewImg(imageUrl)}
							title="Lihat gambar">
							<Eye className="inline w-4 h-4 mr-1 mt-1" />
							Lihat
						</button>
						<button
							onClick={() => handleDownload(row)}
							className="text-green-600 hover:text-green-800 flex items-center outline-none focus:outline-none transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
							title="Download bukti pembayaran">
							<Download className="inline w-4 h-4 mr-1" />
							Download
						</button>
					</div>
				) : (
					<div className="flex items-center">
						<AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
						<span className="text-orange-600 text-xs font-medium">
							Tidak ada file
						</span>
					</div>
				);
			},
			width: "190px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					{row.statusPembayaran === "menunggu_verifikasi" && (
						<>
							<button
								onClick={() => handleVerifikasi(row.id)}
								className="text-green-600 hover:text-green-800 outline-none focus:outline-none"
								title="Setujui Pembayaran"
								disabled={
									verifikasiMutation.isLoading || tolakMutation.isLoading
								}>
								<CheckCircle className="w-5 h-5" />
							</button>
							<button
								onClick={() => handleTolak(row.id)}
								className="text-red-600 hover:text-red-800 outline-none focus:outline-none"
								title="Tolak Pembayaran"
								disabled={
									verifikasiMutation.isLoading || tolakMutation.isLoading
								}>
								<XCircle className="w-5 h-5" />
							</button>
						</>
					)}
				</div>
			),
			width: "100px",
		},
	];

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data payments
				</p>
			</div>
		);
	}

	// Filter data mulai dari yang terbaru
	const sortedPayments = [...payments].sort((a, b) => {
		const dateA = new Date(a.created_at);
		const dateB = new Date(b.created_at);
		return dateB - dateA; // descending
	});

	// Filter data berdasarkan searchTerm
	const filteredPayments = sortedPayments.filter((p) => {
		const lower = searchTerm.toLowerCase();
		const tanggalFormatted = p.tanggalPembayaran
			? new Date(p.tanggalPembayaran.replace(" ", "T")).toLocaleDateString(
					"id-ID",
					{
						day: "numeric",
						month: "long",
						year: "numeric",
					}
			  )
			: "";
		return (
			p.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower) ||
			p.sesi?.kursus?.namaKursus?.toLowerCase().includes(lower) ||
			p.metodePembayaran?.toLowerCase().includes(lower) ||
			tanggalFormatted.toLowerCase().includes(lower) ||
			p.statusPembayaran?.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<CheckCircle className="w-6 h-6 mr-2 text-green-600" />
					Verifikasi Pembayaran
				</h1>
				<p className="text-gray-600">
					Daftar pembayaran yang menunggu verifikasi admin
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Payment Management</h2>
					<div className="flex gap-2">
						<ExportData
							data={filteredPayments}
							filename="payments-data"
							columns={csvColumns}
							variant="success"
						/>
					</div>
				</div>
				{isLoading ? (
					<LoadingSpinner message="Loading payments data..." />
				) : (
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}

						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau metode..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							/>
						</div>

						<DataTable
							columns={columns}
							data={filteredPayments}
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
											Mentor:
										</span>
										<span>{data.mentor?.user?.nama || "Tidak ada"}</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Metode Pembayaran:
										</span>
										<span className="capitalize">
											{data.metodePembayaran || "-"}
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Jadwal:
										</span>
										<span className="capitalize">
											{formatDate(data.sesi?.jadwal_kursus?.tanggal) || "-"}
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">Jam:</span>
										<span className="capitalize">
											{data.sesi?.jadwal_kursus?.waktu.slice(0, 5) || "-"} WIB
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Lokasi:
										</span>
										<span className="capitalize">
											{data.sesi?.jadwal_kursus?.tempat || "-"}
										</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Jumlah:
										</span>
										<span>
											Rp{Number(data.jumlah || 0).toLocaleString("id-ID")}
										</span>
									</p>
								</div>
							)}
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Payments
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada Payments yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Payments Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada pembayaran yang menunggu verifikasi saat ini.
											</p>
										</div>
									)}
								</>
							}
						/>
					</>
				)}
			</div>
			{previewImg && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="relative bg-white rounded-lg shadow-lg p-7">
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-red-500 z-10 pointer-events-auto outline-none focus:outline-none"
							onClick={() => setPreviewImg(null)}
							style={{ zIndex: 10 }}>
							<XCircle className="w-6 h-6" />
						</button>
						<img
							src={previewImg}
							alt="Bukti Pembayaran"
							className="max-w-[95vw] max-h-[90vh] rounded-lg shadow"
							style={{ display: "block" }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminPaymentsPage;
