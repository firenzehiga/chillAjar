import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import {
	Loader2,
	AlertCircle,
	CheckCircle,
	XCircle,
	Eye,
	Download,
	Trash2,
	Trash,
	Banknote,
} from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "@/utils/getImageUrl";
import toast from "react-hot-toast";
import { BookLoader } from "@/components/ui/BookLoader";
import { UpdateLoadingSpinner } from "@/components/Admin/UpdateLoadingSpinner";
import { ExportData } from "@/components/Admin/ExportData";
import { formatDate } from "@/utils/dateFormatter";
import {
	usePaymentsQuery,
	useVerifyPaymentMutation,
	useRejectPaymentMutation,
	useDeletePaymentMutation,
} from "@/hooks/usePayments";
import { downloadPaymentProof } from "@/services/paymentsService";

export function AdminPaymentsPage() {
	const [verifikasiTransaksiId, setVerifikasiTransaksiId] = useState(null);
	const [tolakTransaksiId, setTolakTransaksiId] = useState(null);
	const [deletingPaymentId, setDeletingPaymentId] = useState(null);
	const [previewImg, setPreviewImg] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	// Fetch data pembayaran menggunakan useQuery
	const {
		data: payments = [],
		isLoading,
		error,
		isFetching,
	} = usePaymentsQuery();

	// Mutasi untuk hapus pembayaran
	const deleteMutation = useDeletePaymentMutation();

	const handleDelete = (id) => {
		Swal.fire({
			title: "Apa Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
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
				setDeletingPaymentId(id);
				const toastId = toast.loading("Menghapus pembayaran...");
				deleteMutation.mutate(id, {
					onSuccess: async () => {
						await queryClient.invalidateQueries({
							queryKey: ["adminPayments"],
						});
						setDeletingPaymentId(null);
						toast.success("Pembayaran berhasil dihapus.", { id: toastId });
					},
					onError: (err) => {
						setDeletingPaymentId(null);
						toast.error("Gagal menghapus pembayaran.", { id: toastId });
					},
				});
			}
		});
	};

	// Mutasi untuk verifikasi pembayaran
	const verifikasiMutation = useVerifyPaymentMutation();

	// Handler untuk tombol Setujui
	const handleVerifikasi = (transaksiId) => {
		// don't set loading state yet — wait for user confirmation
		Swal.fire({
			title: "Verifikasi Pembayaran?",
			text: "Pastikan pembayaran sudah benar sebelum menyetujui.",
			icon: "question",
			iconColor: "#0ea5e9",
			showCancelButton: true,
			confirmButtonText: "Ya, setujui!",
			cancelButtonText: "Batal",
			customClass: {
				// kurangi ukuran popup (max-w-md vs max-w-lg) supaya card tidak terlalu besar
				popup: "bg-white rounded-xl shadow-xl p-5 max-w-md w-full",
				title: "text-lg font-semibold text-gray-900",
				content: "text-sm text-gray-600 dark:text-gray-300 mt-1",
				// tambahkan container actions dengan gap agar tombol tidak saling dempet
				actions: "flex gap-3 justify-center mt-4",
				confirmButton:
					"px-4 py-2 focus:outline-none rounded-md bg-chill-blue hover:bg-blue-600 text-white",
				cancelButton:
					"px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:bg-gray-300 text-gray-700",
			},
			backdrop: true,
		}).then(async (result) => {
			if (!result.isConfirmed) return;

			// set local loading state only after confirm
			setVerifikasiTransaksiId(transaksiId);
			const toastId = toast.loading("Memproses verifikasi...");
			try {
				await verifikasiMutation.mutateAsync(transaksiId);
				// ensure fresh data is fetched before showing success
				await queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
				toast.success("Pembayaran berhasil diverifikasi", { id: toastId });
			} catch (err) {
				toast.error("Gagal memverifikasi pembayaran", { id: toastId });
			} finally {
				setVerifikasiTransaksiId(null);
			}
		});
	};

	// Mutasi untuk menolak pembayaran
	const tolakMutation = useRejectPaymentMutation();

	// Handler untuk tombol Tolak
	const handleTolak = (transaksiId) => {
		// don't set loading yet, wait for confirmation
		Swal.fire({
			title: "Yakin ingin menolak?",
			text: "Pembayaran akan ditolak!",
			icon: "warning",
			iconColor: "#dc2626",
			showCancelButton: true,
			confirmButtonText: "Ya, tolak!",
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
		}).then(async (result) => {
			if (!result.isConfirmed) return;

			setTolakTransaksiId(transaksiId);
			const toastId = toast.loading("Memproses penolakan...");
			try {
				await tolakMutation.mutateAsync(transaksiId);
				await queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
				toast.success("Pembayaran berhasil ditolak", { id: toastId });
			} catch (err) {
				toast.error("Gagal menolak pembayaran", { id: toastId });
			} finally {
				setTolakTransaksiId(null);
			}
		});
	};

	// local per-row id state is authoritative for loading; removed watchers on mutation flags

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
			title: "Mengunduh Bukti Pembayaran...",
			text: "Mohon tunggu, sedang memproses download.",
			allowOutsideClick: false,
			allowEscapeKey: false,
			showConfirmButton: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			// Download melalui backend API with cache busting
			const response = await downloadPaymentProof(row.id);

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
			const downloadUrl = window.URL.createObjectURL(response);

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
			title: "Pembayaran telah diverifikasi",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
		accepted: {
			label: "Accepted",
			title: "Pembayaran telah diverifikasi Admin",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
		rejected: {
			label: "Ditolak",
			title: "Pembayaran telah ditolak Admin",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset",
		},
		menunggu_verifikasi: {
			label: "Menunggu Verifikasi",
			title: "Pembayaran menunggu verifikasi Admin",
			class:
				"inline-flex items-center cursor-pointer rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
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
			width: "200px",
		},
		{
			name: "Tanggal Bayar",
			selector: (row) => {
				return formatDate(row.tanggalPembayaran);
			},
			sortable: true,
			width: "150px",
		},
		{
			name: "Status",
			cell: (row) => {
				const status = statusCheck[row.statusPembayaran];
				return status ? (
					<span className={`${status.class}`} title={status.title}>
						{status.label}
					</span>
				) : (
					<span className="text-gray-400 text-sm">-</span>
				);
			},
			sortable: true,
			width: "180px",
		},
		{
			name: "Bukti",
			cell: (row) => {
				const imageUrl = row.buktiPembayaran
					? getImageUrl(row.buktiPembayaran, "bukti_pembayaran")
					: null;

				const hasBuktiPembayaran =
					row.buktiPembayaran &&
					row.buktiPembayaran.trim() !== "" &&
					row.buktiPembayaran !== "null" &&
					row.buktiPembayaran !== "undefined";

				return hasBuktiPembayaran ? (
					<div className="flex space-x-4">
						<button
							className="text-blue-600 hover:text-blue-800 flex items-center gap-1 outline-none focus:outline-none transition-colors text-sm"
							onClick={() => setPreviewImg(imageUrl)}
							title="Lihat gambar">
							<Eye className="w-4 h-4" />
							<span>Lihat</span>
						</button>
						<button
							onClick={() => handleDownload(row)}
							className="text-green-600 hover:text-green-800 flex items-center gap-1 outline-none focus:outline-none transition-colors text-sm"
							title="Download bukti pembayaran">
							<Download className="w-4 h-4" />
							<span>Download</span>
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
			width: "210px",
		},
		{
			name: "Aksi",
			cell: (row) => {
				// KONDISI BUTTON AKSI (gunakan local id state sebagai sumber kebenaran)
				const isApproving = verifikasiTransaksiId === row.id;
				const isRejecting = tolakTransaksiId === row.id;

				// Apakah salah satu tombol ditekan (non-clickable untuk baris lain)
				const disableApprove =
					!!tolakTransaksiId ||
					(verifikasiTransaksiId && verifikasiTransaksiId !== row.id);
				const disableReject =
					!!verifikasiTransaksiId ||
					(tolakTransaksiId && tolakTransaksiId !== row.id);

				// styles untuk tombol
				const btnBase =
					"flex items-center justify-center gap-2  py-1.5 rounded-md text-xs font-medium focus:outline-none transition-all min-w-[80px]";
				const approveClasses = `${btnBase} bg-green-600 hover:bg-green-700 text-white`;
				const rejectClasses = `${btnBase} bg-red-600 hover:bg-red-700 text-white`;
				const disabledClass = "opacity-50 cursor-not-allowed";

				return (
					<div className="flex items-center gap-3">
						{row.statusPembayaran === "menunggu_verifikasi" && (
							<>
								<button
									onClick={() => {
										handleVerifikasi(row.id);
									}}
									className={`${approveClasses} ${
										disableApprove || isFetching ? disabledClass : ""
									}`}
									title="Setujui Pembayaran"
									disabled={disableApprove || isApproving || isFetching}>
									{isApproving ? (
										<>
											<Loader2 className="animate-spin w-4 h-4" />
											<span>Setujui...</span>
										</>
									) : (
										<>
											<CheckCircle className="w-4 h-4" />
											<span>Setujui</span>
										</>
									)}
								</button>

								<button
									onClick={() => {
										handleTolak(row.id);
									}}
									className={`${rejectClasses} ${
										disableReject || isFetching ? disabledClass : ""
									}`}
									title="Tolak Pembayaran"
									disabled={disableReject || isRejecting || isFetching}>
									{isRejecting ? (
										<>
											<Loader2 className="animate-spin w-4 h-4" />
											<span>Tolak...</span>
										</>
									) : (
										<>
											<XCircle className="w-4 h-4" />
											<span>Tolak</span>
										</>
									)}
								</button>
							</>
						)}
						{/* {row.statusPembayaran !== "menunggu_verifikasi" && (
							<span className="text-sm text-gray-500">Tidak ada aksi</span>
						)} */}

						{/* Delete button (per-row) - simple styling */}
						<button
							onClick={() => handleDelete(row.id)}
							className="text-red-600 hover:text-red-800 outline-none focus:outline-none"
							title="Hapus Pembayaran"
							disabled={deletingPaymentId === row.id || isFetching}>
							{deletingPaymentId === row.id ? (
								<Loader2 className="animate-spin w-4 h-4" />
							) : (
								<Trash className="w-4 h-4" />
							)}
						</button>
					</div>
				);
			},
			width: "280px",
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
					<Banknote className="w-6 h-6 mr-2 text-blue-600" />
					Manage Transactions
				</h1>
				<p className="text-gray-600">Daftar transaksi yang dilakukan user</p>
			</div>
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex flex-wrap justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Transaksi</h2>
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
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading Payments" />
					</div>
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
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<DataTable
							columns={columns}
							data={filteredPayments}
							pagination
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => {
								const imageUrl = data.buktiPembayaran
									? getImageUrl(data.buktiPembayaran, "bukti_pembayaran")
									: null;
								const hasBuktiPembayaran =
									data.buktiPembayaran &&
									data.buktiPembayaran.trim() !== "" &&
									data.buktiPembayaran !== "null" &&
									data.buktiPembayaran !== "undefined";

								return (
									<div className="p-5 text-sm text-gray-700 bg-gray-50 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<p className="flex">
												<span className="w-32 font-medium text-gray-900">
													Kursus:
												</span>
												<span>
													{data.sesi?.kursus?.namaKursus || "Tidak ada"}
												</span>
											</p>
											<p className="flex">
												<span className="w-32 font-medium text-gray-900">
													Mentor:
												</span>
												<span>{data.mentor?.user?.nama || "Tidak ada"}</span>
											</p>
											<p className="flex">
												<span className="w-32 font-medium text-gray-900">
													Tanggal Sesi:
												</span>
												<span className="capitalize">
													{formatDate(data.sesi?.jadwal_kursus?.tanggal) || "-"}
												</span>
											</p>
											<p className="flex">
												<span className="w-32 font-medium text-gray-900">
													Jam:
												</span>
												<span className="capitalize">
													{(data.sesi?.jadwal_kursus?.waktu || "").slice(
														0,
														5
													) || "-"}{" "}
													WIB
												</span>
											</p>
											<p className="flex font-medium">
												<span className="w-32 font-medium text-gray-900">
													Lokasi:
												</span>
												{data.sesi?.jadwal_kursus?.gayaMengajar ===
												"offline" ? (
													<span className="capitalize mb-5">
														{data.sesi?.jadwal_kursus?.tempat || "-"}
													</span>
												) : (
													<span className="capitalize mb-5 text-blue-600">
														Online
													</span>
												)}
											</p>
										</div>

										<div className="space-y-2">
											<p className="flex items-center">
												<span className="w-44 font-medium text-gray-900">
													Paket Belajar:
												</span>
												<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset">
													{data.paket?.nama || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-44 font-medium text-gray-900">
													Total Harga:
												</span>
												<span>
													Rp{Number(data.jumlah || 0).toLocaleString("id-ID")}
												</span>
											</p>

											<p className="flex">
												<span className="w-44 font-medium text-gray-900">
													Metode Pembayaran:
												</span>
												<span className="capitalize">
													{data.metodePembayaran || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-44 font-medium text-gray-900">
													Status Pembayaran:
												</span>
												<span className="capitalize">
													{(statusCheck[data.statusPembayaran] &&
														statusCheck[data.statusPembayaran].label) ||
														data.statusPembayaran ||
														"-"}
												</span>
											</p>

											<div className="flex items-center space-x-3 mt-2">
												{hasBuktiPembayaran ? (
													<>
														<button
															className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
															onClick={() => setPreviewImg(imageUrl)}
															title="Lihat gambar">
															<Eye className="w-4 h-4" />
															<span>Lihat</span>
														</button>
														<button
															onClick={() => handleDownload(data)}
															className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
															title="Download bukti pembayaran">
															<Download className="w-4 h-4" />
															<span>Download</span>
														</button>
													</>
												) : (
													<div className="flex items-center text-xs text-orange-600">
														<AlertCircle className="w-4 h-4 mr-1 text-orange-500" />
														<span>Tidak ada bukti</span>
													</div>
												)}
											</div>
										</div>
									</div>
								);
							}}
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
