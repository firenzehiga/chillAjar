import { useState } from "react";
import DataTable from "react-data-table-component";
import {
	BookOpen,
	Plus,
	Pencil,
	Trash,
	AlertCircle,
	XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { getImageUrl } from "@/utils/getImageUrl";
import { BookLoader } from "@/components/User/BookLoader";
import { UpdateLoadingSpinner } from "@/components/Admin/UpdateLoadingSpinner";
import toast from "react-hot-toast";
import { AsyncImage } from "loadable-image";
import {
	useMentorCoursesQuery,
	useDeleteMentorCourseMutation,
} from "@/hooks/useCourse";

export function MentorCoursesPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	const {
		data: courses,
		isLoading,
		error,
		isFetching,
	} = useMentorCoursesQuery();

	const deleteCourseMutation = useDeleteMentorCourseMutation();

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
				});
			}
		});
	};

	const columns = [
		{
			name: "No",
			cell: (row, index) => index + 1,
			sortable: false,
			width: "60px",
		},
		{
			name: "Nama Course",
			selector: (row) => row.namaKursus,
			sortable: true,
			width: "270px",
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
										{/* <svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-3 h-3"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9.75 17h4.5M4 7h16M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7l8 5 8-5"
											/>
										</svg> */}
										Online
									</span>
								);
							} else if (mode === "offline") {
								return (
									<span
										key="offline"
										title="Offline Session"
										className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
										{/* <svg
											xmlns="http://www.w3.org/2000/svg"
											className="w-3 h-3"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
											/>
										</svg> */}
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
			width: "380px",
		},
		{
			name: "Foto",
			cell: (row) => (
				<div className="flex items-center justify-center p-1">
					<AsyncImage
						src={getImageUrl(row.fotoKursus)}
						alt={row.namaKursus}
						className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
						onClick={() => setPreviewImg(getImageUrl(row.fotoKursus))}
					/>
				</div>
			),
			width: "300px",
		},
		{
			name: "Aksi",
			cell: (row) => (
				<div className="flex gap-2">
					<button
						onClick={() => onNavigate(`mentor-edit-course/${row.id}`)}
						className="text-chill-blue hover:text-blue-800">
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

	const [previewImg, setPreviewImg] = useState(null);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data courses
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

	// Filter data di dalam render untuk menghindari error
	const filteredCourse = sortedCourses
		? sortedCourses.filter((p) => {
				const lower = searchTerm.toLowerCase();
				const mode = p.jadwal_kursus?.[0]?.gayaMengajar || "";
				return (
					p.namaKursus?.toLowerCase().includes(lower) ||
					mode.toLowerCase().includes(lower) ||
					p.deskripsi?.toLowerCase().includes(lower) ||
					p.mentor?.user?.nama?.toLowerCase().includes(lower)
				);
		  })
		: [];

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<BookOpen className="w-6 h-6 mr-2 text-chill-blue" />
					My Courses
				</h1>
				<p className="text-gray-600">Daftar kursus yang saya ajar</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Kursus</h2>
					<button
						onClick={() => onNavigate("mentor-add-course")}
						className="flex items-center px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-chill-blue-dark">
						<Plus className="w-4 h-4 mr-2" />
						Tambah Kursus
					</button>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading courses" />
					</div>
				) : (
					<>
						{/* Small loading indicator untuk saat update */}
						{isFetching && <UpdateLoadingSpinner />}

						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, deskripsi atau mentor..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<DataTable
							columns={columns}
							data={filteredCourse}
							pagination
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => (
								<div className="p-5 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md">
									<p className="flex">
										<span className="w-20 font-medium text-gray-900 mb-2">
											Deskripsi:
										</span>
									</p>
									<span>{data.deskripsi}</span>
									<p className="flex">
										<span className="w-20 font-medium text-gray-900 mb-2">
											Jadwal:
										</span>
									</p>
									<span>
										{data.jadwal_kursus?.map((jadwal, index) => {
											const tanggalFormatted = jadwal.tanggal
												? new Date(
														jadwal.tanggal.replace(" ", "T")
												  ).toLocaleDateString("id-ID", {
														day: "numeric",
														month: "long",
														year: "numeric",
												  })
												: "";
											return (
												<div key={index} className="mb-3">
													<p>
														{tanggalFormatted} {jadwal.waktu.slice(0, 5)} WIB |
														<span className="text-gray-500 ml-2">
															{jadwal.tempat}
														</span>
													</p>
												</div>
											);
										})}
									</span>
								</div>
							)}
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
							alt="Preview"
							className="max-w-[70vw] max-h-[70vh] rounded-lg shadow"
							style={{ display: "block" }}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "/foto_kursus/default.jpg";
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export default MentorCoursesPage;
