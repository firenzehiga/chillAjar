import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";

export function AdminPaymentsPage() {
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [previewImg, setPreviewImg] = useState(null);

	useEffect(() => {
		const fetchPayments = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/transaksi", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPayments(response.data);
				setLoading(false);
			} catch (err) {
				setError("Gagal mengambil data pembayaran");
				setLoading(false);
			}
		};
		fetchPayments();
	}, []);

	const handleVerifikasi = async (transaksiId) => {
		try {
			const token = localStorage.getItem("token");
			await api.post(
				`/admin/verifikasi-pembayaran/${transaksiId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			Swal.fire("Berhasil!", "Pembayaran telah diverifikasi.", "success");
			setPayments(payments.filter((p) => p.id !== transaksiId));
		} catch (err) {
			Swal.fire("Gagal", "Terjadi kesalahan saat verifikasi.", "error");
		}
	};

	const handleTolak = async (transaksiId) => {
		try {
			const token = localStorage.getItem("token");
			await api.post(
				`/admin/tolak-pembayaran/${transaksiId}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			Swal.fire("Ditolak!", "Pembayaran telah ditolak.", "info");
			setPayments(payments.filter((p) => p.id !== transaksiId));
		} catch (err) {
			Swal.fire("Gagal", "Terjadi kesalahan saat menolak pembayaran.", "error");
		}
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
			name: "Mentor",
			selector: (row) => row.mentor?.user?.nama || "-",
			sortable: true,
		},
		{
			name: "Kursus",
			selector: (row) => row.sesi?.kursus?.namaKursus || "-",
			sortable: true,
		},
		{
			name: "Jumlah",
			selector: (row) => `Rp${row.jumlah}`,
			sortable: true,
		},
		{
			name: "Tanggal",
			selector: (row) => {
				const tgl = row.tanggalPembayaran;
				if (!tgl) return "-";
				// Ganti spasi dengan "T" agar format ISO
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
			name: "Bukti",
			cell: (row) =>
				row.bukti_pembayaran ? (
					<button
						className="text-blue-600 hover:underline"
						onClick={() => setPreviewImg(`/storage/${row.bukti_pembayaran}`)}>
						<Eye className="inline w-5 h-5 mr-1" />
						Lihat
					</button>
				) : (
					<span className="text-gray-400 text-xs">-</span>
				),
			width: "110px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleVerifikasi(row.id)}
						className="text-green-600 hover:text-green-800"
						title="Terima">
						<CheckCircle className="w-5 h-5" />
					</button>
					<button
						onClick={() => handleTolak(row.id)}
						className="text-red-600 hover:text-red-800"
						title="Tolak">
						<XCircle className="w-5 h-5" />
					</button>
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
				{loading ? (
					<div className="flex items-center justify-center h-64 text-gray-600">
						<div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
						<p className="ml-3">Loading pembayaran...</p>
					</div>
				) : payments.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-64 text-gray-600">
						<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
						<h3 className="text-lg font-semibold mb-2">Tidak Ada Pembayaran</h3>
						<p className="text-gray-500 mb-4 text-center">
							Tidak ada pembayaran yang menunggu verifikasi.
						</p>
					</div>
				) : (
					<DataTable
						columns={columns}
						data={payments}
						pagination
						highlightOnHover
						persistTableHead
						responsive
						noHeader
					/>
				)}
			</div>
			{previewImg && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
					<div className="relative bg-white rounded-lg shadow-lg p-4">
						<button
							className="absolute top-2 right-2 text-gray-600 hover:text-red-500 z-10 pointer-events-auto"
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
