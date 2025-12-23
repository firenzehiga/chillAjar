import { useState } from "react";
import DataTable from "react-data-table-component";
import {
	BookOpen,
	Pencil,
	Trash,
	AlertCircle,
	LucideBookPlus,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/getImageUrl";
import { UpdateLoadingSpinner } from "@/components/Admin/UpdateLoadingSpinner";
import { BookLoader } from "@/components/User/BookLoader";
import { formatDate } from "@/utils/dateFormatter";
import { AsyncImage } from "loadable-image";
import { useCoursesQuery, useDeleteCourseMutation } from "@/hooks/useCourse";

export function AdminCoursesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: courses = [],
		isLoading,
		error,
		isFetching,
	} = useCoursesQuery();

	const deleteCourseMutation = useDeleteCourseMutation();

	// Fungsi untuk menangani penghapusan kursus
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
				deleteCourseMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Kursus berhasil dihapus.");
					},
					onError: () => {
						toast.error("Gagal menghapus kursus.");
					},
				}); // Panggil fungsi deleteMutation dengan ID kursus
			}
		});
	};

	// Saat tombol edit diklik, navigasikan ke halaman edit course
	const handleEdit = (id) => {
		onNavigate(`admin-edit-course/${id}`);
	};

	// Kolom untuk DataTable
	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Kursus",
			selector: (row) => row.namaKursus,
			sortable: true,
			width: "250px",
		},
		{
			name: "Mentor",
			selector: (row) => row.mentor?.user?.nama || "Unknown Mentor",
			sortable: true,
			width: "250px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) => {
				// Ambil semua gayaMengajar unik dari seluruh jadwal_kursus, urutkan agar konsisten
				const modes = Array.from(
					new Set(
						(row.jadwal_kursus || [])
							.map((jadwal) => jadwal.gayaMengajar)
							.filter(Boolean)
					)
				).sort();
				if (modes.length === 0) {
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
							Data mode tidak valid
						</span>
					);
				}
				return (
					<div className="flex gap-1 flex-wrap">
						{modes.map((mode) => {
							if (mode === "online") {
								return (
									<span
										key="online"
										title="Online Session"
										className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
										Online
									</span>
								);
							} else if (mode === "offline") {
								return (
									<span
										key="offline"
										title="Offline Session"
										className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
										Offline
									</span>
								);
							} else {
								return null;
							}
						})}
					</div>
				);
			},
			width: "200px",
		},
		{
			name: "Foto",
			cell: (row) => (
				<div className="flex items-center justify-center p-1">
					<AsyncImage
						src={getImageUrl(row.fotoKursus)}
						alt={row.namaKursus}
						className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
					/>
				</div>
			),
			width: "170px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEdit(row.id)}
						className="text-chill-blue hover:text-blue-800 outline-none focus:outline-none">
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
					Gagal mengambil data kursus.
				</p>
				<p className="text-red-500 mb-4 text-center font-semibold">
					Error: {error.message}
				</p>
			</div>
		);
	}

	// Sort courses by namaKursus ASC (A-Z)
	// const sortedCourses = courses
	// 	? [...courses].sort((a, b) =>
	// 			(a.namaKursus || "").localeCompare(b.namaKursus || "", "id", {
	// 				sensitivity: "base",
	// 			})
	// 	  )
	// 	: [];

	// Sort courses by created_at in descending order
	const sortedCourses = courses
		? [...courses].sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
		  )
		: [];

	// Filter data untuk DataTable berdasarkan searchTerm
	const filteredCourses = sortedCourses.filter((p) => {
		const lower = searchTerm.toLowerCase();
		const mode = p.jadwal_kursus?.[0]?.gayaMengajar || "";
		return (
			p.namaKursus?.toLowerCase().includes(lower) ||
			mode.toLowerCase().includes(lower) ||
			p.deskripsi?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower)
		);
	});

	// Tampilan halaman
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-chill-blue" />
					Manage Courses
				</h1>
				<p className="text-gray-600">
					Daftar kursus milik mentor yang tersedia
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Kursus</h2>
					<button
						onClick={() => onNavigate("admin-add-course")}
						className="flex items-center px-4 py-2 bg-chill-blue-dark text-white rounded-lg hover:bg-chill-blue outline-none focus:outline-none">
						<LucideBookPlus className="w-4 h-4 mr-2" />
						Tambah Kursus
					</button>
				</div>

				{/* Tampilan Loading jika data belum selesai diambil  */}
				{isLoading ? (
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading Courses" />
					</div>
				) : (
					// Jika data sudah ada, tampilkan DataTable
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}

						{/* Form pencarian */}
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, deskripsi atau komentar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						{/* Tampilan DataTable */}
						<DataTable
							columns={columns}
							data={filteredCourses}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 bg-gray-50 rounded-md">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Deskripsi di kolom kiri */}
										<div>
											<div className="mb-2">
												<div className="text-sm font-medium text-gray-900 mb-1">
													Deskripsi:
												</div>
												<div className="text-sm text-gray-700 text-justify">
													{data.deskripsi || "-"}
												</div>
											</div>
										</div>
										{/* Jadwal di kolom kanan dengan scroll jika panjang */}
										<div>
											<div className="mb-2">
												<div className="text-sm font-medium text-gray-900 mb-1">
													Jadwal:
												</div>
											</div>
											<div className="space-y-2 max-h-64 overflow-auto pr-2">
												{data.jadwal_kursus && data.jadwal_kursus.length > 0 ? (
													data.jadwal_kursus.map((jadwal, index) => (
														<div
															key={index}
															className="p-2 bg-white rounded border border-gray-100">
															<p className="text-sm">
																{formatDate(jadwal.tanggal)}{" "}
																{jadwal.waktu.slice(0, 5)} WIB |
																{jadwal.gayaMengajar === "online" ? (
																	<span className="text-blue-600 font-semibold ml-2">
																		Online
																	</span>
																) : (
																	<span className="text-gray-500 ml-2">
																		{jadwal.tempat}
																	</span>
																)}
															</p>
														</div>
													))
												) : (
													<div className="text-gray-500 text-sm">
														Tidak ada jadwal.
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							)}
							// Tambahkan penanganan jika data kosong
							noDataComponent={
								<>
									{searchTerm ? (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Matching Course
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Tidak ada kursus yang sesuai dengan pencarian.
											</p>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-64 text-gray-600">
											<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
											<h3 className="text-lg font-semibold mb-2">
												No Course Available
											</h3>
											<p className="text-gray-500 mb-4 text-center">
												Belum ada kursus yang tersedia. Mulai dengan menambahkan
												kursus baru.
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

export default AdminCoursesPage;
