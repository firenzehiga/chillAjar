import DataTable from "react-data-table-component";
import { BookOpen, AlertCircle, Star, Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import toast from "react-hot-toast";
import { UpdateLoadingSpinner } from "@/components/Admin/UpdateLoadingSpinner";
import { BookLoader } from "@/components/User/BookLoader";
import { ExportData } from "@/components/Admin/ExportData";
import { formatDate } from "@/utils/dateFormatter";
import {
	useTestimoniesQuery,
	useDeleteTestimonieMutation,
} from "@/hooks/useTestimonial";
export function AdminTestimoniesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch data transaksi yang mencakup detail sesi
	const {
		data: testimonies = [],
		isLoading,
		error,
		isFetching,
	} = useTestimoniesQuery();

	const deleteTestimonyMutation = useDeleteTestimonieMutation();

	const handleDelete = (id) => {
		Swal.fire({
			title: "Apakah Anda yakin?",
			text: "Kamu tidak akan bisa mengembalikan ini!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Ya, hapus!",
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
		}).then((result) => {
			if (result.isConfirmed) {
				deleteTestimonyMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Testimoni berhasil dihapus.");
					},
					onError: () => {
						toast.error("Gagal menghapus testimoni.");
					},
				});
			}
		});
	};

	const handleEdit = (id) => {
		onNavigate(`admin-edit-testimonial/${id}`);
	};

	// Define columns for CSV export (disesuaikan dengan kolom pada tabel)
	const csvColumns = [
		{
			key: "pelanggan",
			header: "Nama Pelanggan",
			formatter: (row) => row.pelanggan?.user?.nama || "-",
		},
		{
			key: "mentor",
			header: "Nama Mentor",
			formatter: (row) => row.mentor?.user?.nama || "-",
		},
		{
			key: "kursus",
			header: "Nama Kursus",
			formatter: (row) => row.sesi?.kursus?.namaKursus || "-",
		},
		{
			key: "rating",
			header: "Rating",
			formatter: (row) =>
				row.rating !== undefined && row.rating !== null
					? String(row.rating)
					: "-",
		},
		{
			key: "gayaPembelajaran",
			header: "Gaya Pembelajaran",
			formatter: (row) => {
				const mode = row.sesi?.jadwal_kursus?.gayaMengajar;
				if (mode === "online") return "Online";
				if (mode === "offline") return "Offline";
				if (mode === undefined || mode === null) return "Belum diisi";
				return "Data mode tidak valid";
			},
		},
		{
			key: "komentar",
			header: "Komentar",
			formatter: (row) => row.komentar || "-",
		},
		{
			key: "tanggal",
			header: "Tanggal Review",
			formatter: (row) => {
				return formatDate(row.created_at || row.tanggal);
			},
		},
	];

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Pelanggan",
			selector: (row) => row.pelanggan?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Mentor",
			selector: (row) => row.mentor?.user?.nama || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Nama Kursus",
			selector: (row) => row.sesi?.kursus?.namaKursus || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Rating",
			cell: (row) => {
				const rating = row.rating || 0;
				const stars = Math.min(5, Math.max(0, rating)); // Pastikan rating antara 0-5
				return (
					<div className="flex items-center">
						{[...Array(stars)].map((_, index) => (
							<Star
								key={index}
								className="w-4 h-4 text-yellow-400 fill-current"
							/>
						))}
						{stars < 5 &&
							[...Array(5 - stars)].map((_, index) => (
								<Star key={index + stars} className="w-4 h-4 text-gray-300" />
							))}
					</div>
				);
			},
			sortable: false, // Sorting dinonaktifkan karena ini adalah render visual
			width: "150px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) => {
				// [gayaMengajar JADWAL ONLY] Ambil mode belajar hanya dari jadwal_kursus.gayaMengajar pada sesi
				const mode = row.sesi?.jadwal_kursus?.gayaMengajar;
				if (mode === "online") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Online
						</span>
					);
				} else if (mode === "offline") {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
							Offline
						</span>
					);
				} else if (mode === undefined || mode === null) {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Belum diisi
						</span>
					);
				} else {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Data mode tidak valid
						</span>
					);
				}
			},
			width: "200px",
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

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data testimoni.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					{error.message}
				</p>
			</div>
		);
	}

	// Sorting testimoni terbaru di paling atas
	const sortedTestimonies = [...testimonies].sort(
		(a, b) =>
			new Date(b.created_at || b.tanggal) - new Date(a.created_at || a.tanggal)
	);

	// Filter data berdasarkan searchTerm
	const filteredTestimonies = sortedTestimonies.filter((p) => {
		const lower = searchTerm.toLowerCase();
		const tanggalFormatted = formatDate(p.tanggal || p.created_at);
		return (
			p.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower) ||
			p.sesi?.kursus?.namaKursus?.toLowerCase().includes(lower) ||
			p.komentar?.toLowerCase().includes(lower) ||
			tanggalFormatted.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					Manage Testimonials
				</h1>
				<p className="text-gray-600">
					Daftar testimoni mentor yang diberikan oleh pengguna
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Testimoni</h2>
					<div className="flex gap-2">
						<ExportData
							data={filteredTestimonies}
							filename="testimonies-data"
							columns={csvColumns}
							variant="success"
						/>
					</div>
				</div>
				{isLoading ? (
					<div className="flex justify-center py-20">
						<BookLoader size="small" message="Loading Testimonies" />
					</div>
				) : (
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau komentar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<DataTable
							columns={columns}
							data={filteredTestimonies}
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
											Komentar:
										</span>
										<span>{data.komentar || "Tidak ada"}</span>
									</p>
									<p className="flex">
										<span className="w-48 font-medium text-gray-900">
											Tanggal Review:
										</span>
										<span>{formatDate(data.tanggal || data.created_at)}</span>
									</p>
								</div>
							)}
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Testimonies
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada Testimonies yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Testimonies Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Belum ada Pelanggan yang memberikan testimoni.
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

export default AdminTestimoniesPage;
