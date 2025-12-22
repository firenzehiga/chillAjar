import { useState } from "react";
import DataTable from "react-data-table-component";
import { AlertCircle, Star, MessageSquareText } from "lucide-react";
import { useMentorTestimoniesQuery } from "@/hooks/useTestimonial";
import { BookLoader } from "@/components/User/BookLoader";

export function MentorTestimoniesPage() {
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch data transaksi yang mencakup detail sesi
	const {
		data: testimonies = [],
		isLoading,
		error,
	} = useMentorTestimoniesQuery();

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
			name: "Nama Kursus",
			selector: (row) => row.kursus?.namaKursus || "-",
			sortable: true,
			width: "250px",
		},
		{
			name: "Rating",
			cell: (row) => {
				const rating = row.testimoni?.rating || 0;
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
			width: "180px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) => {
				const mode = row.jadwal_kursus?.gayaMengajar;
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
			name: "Tanggal Review",
			selector: (row) =>
				row.testimoni?.tanggal
					? new Date(
							row.testimoni.tanggal.replace(" ", "T")
					  ).toLocaleDateString("id-ID", {
							day: "numeric",
							month: "long",
							year: "numeric",
					  })
					: "-",
			sortable: true,
			width: "170px",
		},
	];

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data transaksi
				</p>
			</div>
		);
	}

	// Sorting testimoni terbaru di paling atas
	const sortedTestimonies = [...testimonies].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	// Filter data berdasarkan searchTerm
	const filteredTestimonies = sortedTestimonies.filter((p) => {
		const lower = searchTerm.toLowerCase();
		const tanggalRaw = p.testimoni?.tanggal || "";
		const tanggalFormatted = tanggalRaw
			? new Date(tanggalRaw).toLocaleDateString("id-ID", {
					day: "numeric",
					month: "long",
					year: "numeric",
			  })
			: "";
		const bulanFormatted = tanggalRaw
			? new Date(tanggalRaw).toLocaleDateString("id-ID", { month: "long" })
			: "";
		return (
			p.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
			p.mentor?.user?.nama?.toLowerCase().includes(lower) ||
			p.kursus?.namaKursus?.toLowerCase().includes(lower) ||
			p.testimoni?.komentar?.toLowerCase().includes(lower) ||
			tanggalFormatted.toLowerCase().includes(lower) ||
			bulanFormatted.toLowerCase().includes(lower)
		);
	});

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<MessageSquareText className="w-6 h-6 mr-2 text-blue-600" />
					Students Testimonials
				</h1>
				<p className="text-gray-600">
					Ringkasan testimoni yang diberikan oleh siswa
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Testimoni</h2>
				</div>
				{isLoading ? (
					<div className="flex justify-center py-20">
						<BookLoader size="small" message="Loading Testimonies" />
					</div>
				) : (
					<>
						<div className="flex justify-end mb-4">
							<input
								type="text"
								placeholder="Cari nama, kursus, atau tanggal..."
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
								<div className="p-4 bg-gray-50 rounded-md">
									<p className="text-sm text-gray-600">
										<strong>Gaya Mengajar:</strong>{" "}
										{data.jadwal_kursus?.gayaMengajar || "-"}
									</p>
									<p className="text-sm text-gray-600">
										<strong>Komentar:</strong>
									</p>
									<p className="text-sm text-gray-800 mt-3">
										{data.testimoni?.komentar || "-"}
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
												Belum ada testimoni, Lakukan sesi terlebih dahulu.
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

export default MentorTestimoniesPage;
