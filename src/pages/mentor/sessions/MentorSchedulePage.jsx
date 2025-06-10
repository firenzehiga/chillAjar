import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { BookOpen, AlertCircle, XCircle, PlayCircle } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function MentorSchedulePage({ onNavigate }) {
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    // Query 1: Fetch daftar sesi mentor
    const {
        data: sessions = [],
        isLoading: isLoadingSessions,
        error: errorSessions,
    } = useQuery({
        queryKey: ["mentorSessions"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const response = await api.get("/mentor/daftar-sesi", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched sessions:", response.data);
            return response.data;
        },
        onError: (err) => {
            console.error("Error fetching sessions:", err);
        },
    });

    // Query 2: Fetch transaksi
    const {
        data: transactions = [],
        isLoading: isLoadingTransactions,
        error: errorTransactions,
    } = useQuery({
        queryKey: ["mentorTransactions"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const response = await api.get("/transaksi", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetched transactions:", response.data);
            return response.data;
        },
        onError: (err) => {
            console.error("Error fetching transactions:", err);
        },
    });

    // Filter transaksi yang statusPembayaran === "accepted"
    const acceptedTransactions = transactions.filter(
        (transaction) => transaction.statusPembayaran === "accepted"
    );

    // Filter sesi yang memiliki transaksi dengan status "accepted"
    const filteredSessions = sessions.filter((session) =>
        acceptedTransactions.some(
            (transaction) => transaction.sesi_id === session.id
        )
    );

    // Mutasi untuk memulai sesi
    const startSessionMutation = useMutation({
        mutationFn: async (sessionId) => {
            const token = localStorage.getItem("token");
            await api.post(
                `/mentor/mulai-sesi/${sessionId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        },
        onSuccess: () => {
            Swal.fire("Berhasil!", "Sesi telah dimulai.", "success");
            queryClient.invalidateQueries(["mentorSessions"]);
            queryClient.invalidateQueries(["mentorTransactions"]);
        },
        onError: () => {
            Swal.fire("Gagal", "Terjadi kesalahan saat memulai sesi.", "error");
        },
    });

    const handleStartSession = (sessionId) => {
        Swal.fire({
            title: "Mulai Sesi",
            text: "Apakah Anda yakin ingin memulai sesi ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, mulai!",
        }).then((result) => {
            if (result.isConfirmed) {
                startSessionMutation.mutate(sessionId);
            }
        });
    };

    const statusCheck = {
        booked: {
            label: "Booking",
            class: "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
        },
        pending: {
            label: "Pending",
            class: "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-blue-600/20 ring-inset",
        },
        started: {
            label: "Sedang Dimulai",
            class: "inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset",
        },
        end: {
            label: "Selesai",
            class: "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset",
        },
    };

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
            width: "200px",
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
                } else {
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Data mode tidak valid
                        </span>
                    );
                }
            },
            width: "200px",
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
            width: "250px",
        },
        {
            name: "Aksi",
            cell: (row) => (
                <div className="gap-2">
                    {(row.statusSesi === "booked" ||
                        row.statusSesi === "pending") && (
                        <button
                            type="button"
                            className="mt-2 mb-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 outline-none focus:outline-none"
                            disabled={
                                isLoadingSessions || isLoadingTransactions
                            }
                            onClick={() => handleStartSession(row.id)}>
                            <PlayCircle className="w-4 h-4 inline mb-1" /> Mulai
                            Sesi
                        </button>
                    )}
                </div>
            ),
            width: "200px",
        },
    ];

    const [previewImg, setPreviewImg] = React.useState(null);

    if (errorSessions || errorTransactions) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p className="text-gray-500 mb-4 text-center">
                    Gagal mengambil data sesi atau transaksi
                </p>
            </div>
        );
    }

    // filter pencarian dengan filteredSessions
    const filteredData = filteredSessions.filter((session) => {
        const lower = searchTerm.toLowerCase();
        const mode = session.jadwal_kursus?.gayaMengajar || "";
        return (
            session.pelanggan?.user?.nama?.toLowerCase().includes(lower) ||
            session.kursus?.namaKursus?.toLowerCase().includes(lower) ||
            mode.toLowerCase().includes(lower)
        );
    });

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center text-gray-900">
                    <BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
                    My Schedules
                </h1>
                <p className="text-gray-600">Manage your teaching courses</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        Session Management
                    </h2>
                </div>
                {isLoadingSessions || isLoadingTransactions ? (
                    <div className="flex items-center justify-center h-64 text-gray-600">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="ml-3">Loading course data...</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No Schedules Available
                        </h3>
                        <p className="text-gray-500 mb-4 text-center">
                            Tidak ada sesi dengan pembayaran yang diterima.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end mb-4">
                            <input
                                type="text"
                                placeholder="Cari nama, kursus, atau metode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            highlightOnHover
                            persistTableHead
                            responsive
                            noHeader
                            expandableRows
                            expandableRowsComponent={({ data }) => (
                                <div className="p-5 text-sm text-gray-700 space-y-1 bg-gray-50 rounded-md">
                                    <p className="flex">
                                        <span className="w-10 font-medium text-gray-900 mb-2">
                                            Topik:
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                            {data.detailKursus || "-"}
                                        </span>
                                    </p>
                                    <p className="flex">
                                        <span className="w-48 font-medium text-gray-900">
                                            Jadwal:
                                        </span>
                                        <span className="capitalize">
                                            {data.jadwal_kursus?.tanggal || "-"}
                                        </span>
                                    </p>
                                    <p className="flex">
                                        <span className="w-48 font-medium text-gray-900">
                                            Jam:
                                        </span>
                                        <span className="capitalize">
                                            {data.jadwal_kursus?.waktu?.slice(
                                                0,
                                                5
                                            ) || "-"}{" "}
                                            WIB
                                        </span>
                                    </p>
                                    <p className="flex">
                                        <span className="w-48 font-medium text-gray-900">
                                            Lokasi:
                                        </span>
                                        <span className="capitalize">
                                            {data.jadwal_kursus?.tempat || "-"}
                                        </span>
                                    </p>
                                </div>
                            )}
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
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MentorSchedulePage;
