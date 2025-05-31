import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { AlertCircle, CheckCircle, XCircle, Eye, Download } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

export function AdminPaymentsPage() {
	const [previewImg, setPreviewImg] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	// Fetch data pembayaran menggunakan useQuery
	const {
		data: payments = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["payments"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/transaksi", {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		},
		onError: () => {
			setError("Gagal mengambil data pembayaran");
		},
	});

	// Filter data berdasarkan searchTerm
	const filteredPayments = payments.filter((p) => {
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
			Swal.fire("Berhasil!", "Pembayaran telah diverifikasi.", "success");
			// Invalidate query untuk memaksa refetch data
			queryClient.invalidateQueries(["payments"]);
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
			Swal.fire("Ditolak!", "Pembayaran telah ditolak.", "info");
			// Invalidate query untuk memaksa refetch data
			queryClient.invalidateQueries(["payments"]);
		},
		onError: () => {
			Swal.fire("Gagal", "Terjadi kesalahan saat menolak pembayaran.", "error");
		},
	});

	// Handler untuk tombol Setujui
	const handleVerifikasi = (transaksiId) => {
		verifikasiMutation.mutate(transaksiId);
	};

	// Handler untuk tombol Tolak
	const handleTolak = (transaksiId) => {
		tolakMutation.mutate(transaksiId);
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
				const tgl = row.tanggalPembayaran;
				if (!tgl) return "-";
				const isoDate = tgl.replace(" ", "T");
				const date = new Date(isoDate);
				return isNaN(date.getTime())
					? "-"
					: date.toLocaleDateString("id-ID", {
							day: "numeric",
							month: "long",
							year: "numeric",
					  });
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
					? `/storage/${row.buktiPembayaran}`
					: null;

				const handleDownload = async (url) => {
					try {
						const response = await fetch(url);
						if (!response.ok) throw new Error("Gagal mengunduh gambar");

						const blob = await response.blob();
						const downloadUrl = window.URL.createObjectURL(blob);
						const link = document.createElement("a");
						link.href = downloadUrl;
						const fileName = url.split("/").pop();
						link.download = fileName || "bukti_pembayaran.png";
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						window.URL.revokeObjectURL(downloadUrl);
					} catch (error) {
						console.error("Error downloading image:", error);
						alert("Gagal mengunduh gambar. Pastikan file tersedia.");
					}
				};

				return row.buktiPembayaran ? (
					<div className="flex space-x-2">
						<button
							className="text-blue-600 hover:underline flex items-center mr-3 outline-none focus:outline-none"
							onClick={() => setPreviewImg(imageUrl)}>
							<Eye className="inline w-5 h-5 mr-1" />
							Lihat
						</button>
						<button
							className="text-green-600 hover:underline flex items-center outline-none focus:outline-none"
							onClick={() => handleDownload(imageUrl)}>
							<Download className="inline w-5 h-5 mr-1" />
							Download
						</button>
					</div>
				) : (
					<span className="text-gray-400 text-xs">No Image</span>
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
				<p className="text-gray-500 mb-4 text-center">{error}</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading payments data...</p>
			</div>
		);
	}

	if (payments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">No Payments Found</h3>
				<p className="text-gray-500 mb-4 text-center">
					Tidak ada pembayaran yang menunggu verifikasi.
				</p>
			</div>
		);
	}
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

			<div className="flex justify-end mb-4">
				<input
					type="text"
					placeholder="Cari nama, kursus, atau metode..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
				/>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
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
								<span className="w-48 font-medium text-gray-900">Mentor:</span>
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
								<span className="w-48 font-medium text-gray-900">Jadwal:</span>
								<span className="capitalize">
									{data.sesi?.jadwal_kursus?.tanggal || "-"}
								</span>
							</p>
							<p className="flex">
								<span className="w-48 font-medium text-gray-900">Jam:</span>
								<span className="capitalize">
									{data.sesi?.jadwal_kursus?.waktu.slice(0, 5) || "-"} WIB
								</span>
							</p>
							<p className="flex">
								<span className="w-48 font-medium text-gray-900">Lokasi:</span>
								<span className="capitalize">
									{data.sesi?.jadwal_kursus?.tempat || "-"}
								</span>
							</p>
							<p className="flex">
								<span className="w-48 font-medium text-gray-900">Jumlah:</span>
								<span>
									Rp{Number(data.jumlah || 0).toLocaleString("id-ID")}
								</span>
							</p>
						</div>
					)}
				/>
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
							className="max-w-[70vw] max-h-[70vh] rounded-lg shadow"
							style={{ display: "block" }}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default AdminPaymentsPage;
