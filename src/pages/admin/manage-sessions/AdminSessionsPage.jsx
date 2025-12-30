import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { AlertCircle, Pencil, Trash, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { UpdateLoadingSpinner } from "@/components/Admin/UpdateLoadingSpinner";
import BookLoader from "@/components/User/BookLoader";
import { formatDate } from "@/utils/dateFormatter";
import {
	useSessionsQuery,
	useDeleteSessionMutation,
} from "@/hooks/useSessions";

export function AdminSessionsPage({ onNavigate }) {
	const [searchTerm, setSearchTerm] = useState("");

	// Query 1: Fetch daftar sesi mentor
	const {
		data: sessions = [],
		isLoading,
		error,
		isFetching,
	} = useSessionsQuery();

	// Delete session mutation
	const deleteSessionMutation = useDeleteSessionMutation();

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
				deleteSessionMutation.mutate(id, {
					onSuccess: () => {
						toast.success("Sesi berhasil dihapus.");
					},
					onError: () => {
						toast.error("Gagal menghapus sesi.");
					},
				});
			}
		});
	};

	const handleEdit = (id) => onNavigate(`admin-edit-session/${id}`);

	const statusCheck = {
		reviewed: {
			label: "Reviewed",
			class:
				"inline-flex items-center rounded-md bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
		},
		pending: {
			label: "Pending",
			class:
				"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
		},
		started: {
			label: "Sedang Dimulai",
			class:
				"inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
		},
		end: {
			label: "Selesai",
			class:
				"inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
		},
	};

	const columns = [
		{
			name: "No",
			cell: (_, index) => index + 1,
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
			selector: (row) => row.kursus?.namaKursus || "-",
			sortable: true,
			width: "200px",
		},
		{
			name: "Gaya Pembelajaran",
			selector: (row) => {
				const mode = row.jadwal_kursus?.gayaMengajar;
				if (mode === "online")
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Online
						</span>
					);
				if (mode === "offline")
					return (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
							Offline
						</span>
					);
				return (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
						Data mode tidak valid
					</span>
				);
			},
			width: "150px",
		},
		{
			name: "Status",
			selector: (row) => {
				const status = statusCheck[row.statusSesi];
				return status ? (
					<span className={`${status.class}`}>{status.label}</span>
				) : (
					<span className="text-gray-400 text-sm">-</span>
				);
			},
			width: "190px",
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

	const filteredData = sessions
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		.filter((session) => {
			const lower = searchTerm.toLowerCase();
			const mode = session.jadwal_kursus?.gayaMengajar || "";
			return (
				session.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
				session.mentor?.user?.nama?.toLowerCase().includes(lower) ||
				session.statusSesi.toLowerCase().includes(lower) ||
				session.kursus?.namaKursus?.toLowerCase().includes(lower) ||
				mode.toLowerCase().includes(lower)
			);
		});

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
				<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p className="text-gray-500 mb-4 text-center">
					Gagal mengambil data sesi
				</p>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<CalendarDays className="w-6 h-6 mr-2 text-blue-600" />
					Manage Sessions
				</h1>
				<p className="text-gray-600">Daftar jadwal sesi pembelajaran</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Data Sesi</h2>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-20 min-h-screen">
						<BookLoader size="small" message="Loading Sessions" />
					</div>
				) : (
					<>
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
							data={filteredData}
							pagination
							paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
							highlightOnHover
							persistTableHead
							responsive
							noHeader
							expandableRows
							expandableRowsComponent={({ data }) => {
								return (
									<div className="p-5 text-sm text-gray-700 bg-gray-50 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Topik:
												</span>
												<span className="text-gray-500 ml-2 text-justify">
													{data.detailKursus || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Jadwal:
												</span>
												<span className="capitalize">
													{formatDate(data.jadwal_kursus?.tanggal) || "-"}
												</span>
											</p>

											<p className="flex">
												<span className="w-20 font-medium text-gray-900">
													Jam:
												</span>
												<span className="capitalize">
													{(data.jadwal_kursus?.waktu || "").slice(0, 5) || "-"}{" "}
													WIB
												</span>
											</p>

											{data.jadwal_kursus?.gayaMengajar === "offline" && (
												<p className="flex">
													<span className="w-20 font-medium text-gray-900">
														Lokasi:
													</span>
													<span className="capitalize mb-5">
														{data.jadwal_kursus?.tempat || "-"}
													</span>
												</p>
											)}
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
													Catatan Paket:
												</span>
												<span className="text-gray-600">
													{data.paket?.deskripsi || "-"}
												</span>
											</p>

											<span className="w-44 font-medium text-gray-900 block mb-2">
												Layanan yang termasuk:
											</span>
											<div className="mt-2 max-h-48 overflow-auto pr-2">
												{data.paket?.items && data.paket.items.length > 0 ? (
													<>
														<ul className="divide-y divide-gray-100 bg-white rounded-md shadow-sm overflow-hidden">
															{data.paket.items.map((item, idx) => (
																<li
																	key={idx}
																	className="px-3 py-3 text-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
																	<div className="flex-1 min-w-0">
																		<div className="font-semibold text-gray-800 truncate">
																			{item.nama || "-"}
																		</div>
																		{item.deskripsi ? (
																			<div className="mt-1 text-gray-500 text-xs leading-relaxed">
																				{item.deskripsi}
																			</div>
																		) : (
																			<div className="mt-1 text-gray-400 text-xs">
																				Tidak ada deskripsi
																			</div>
																		)}
																	</div>
																</li>
															))}
														</ul>
													</>
												) : (
													<div className="text-gray-500 text-sm">
														Tidak ada item di paket ini
													</div>
												)}
											</div>
										</div>
									</div>
								);
							}}
							noDataComponent={
								<div className="flex flex-col items-center justify-center h-64 text-gray-600">
									<AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
									<h3 className="text-lg font-semibold mb-2">
										{searchTerm
											? "No Matching Schedules"
											: "No Schedules Available"}
									</h3>
									<p className="text-gray-500 mb-4 text-center">
										{searchTerm
											? "Tidak ada Schedules yang sesuai dengan pencarian."
											: "Belum ada data sesi"}
									</p>
								</div>
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default AdminSessionsPage;
