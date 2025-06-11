import React from "react";
import DataTable from "react-data-table-component";
import { BookOpen, AlertCircle, Star } from "lucide-react";
import api from "../../api";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function MentorTestimoniesPage() {
    const queryClient = useQueryClient();

    // Fetch data transaksi yang mencakup detail sesi
    const {
        data: testimonies = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["mentorTestimonies"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const response = await api.get("/mentor/daftar-testimoni", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Mapping agar jadwal_kursus selalu ada, baik dari jadwalKursus atau jadwal_kursus
            return response.data.map((t) => ({
                ...t,
                jadwal_kursus: t.jadwal_kursus || t.jadwalKursus || null,
            }));
        },
        onError: (err) => {
            console.error("Error fetching testimonies:", err);
        },
    });

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
                                <Star
                                    key={index + stars}
                                    className="w-4 h-4 text-gray-300"
                                />
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Data mode tidak valid
                        </span>
                    );
                }
            },
            width: "200px",
        },
        {
            name: "Komentar",
            selector: (row) => row.testimoni?.komentar || "-",
            sortable: true,
            width: "200px",
        },
        {
            name: "Tanggal Review",
            selector: (row) => row.testimoni?.tanggal || "-",
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

    return (
        <div className="py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center text-gray-900">
                    <BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
                    Students Testimonials
                </h1>
                <p className="text-gray-600">
                    Overview of your students' testimonials
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64 text-gray-600">
                        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="ml-3">Loading course data...</p>
                    </div>
                ) : testimonies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No Testimonies Available
                        </h3>
                        <p className="text-gray-500 mb-4 text-center">
                            No User has given testimonies yet.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={testimonies}
                        pagination
                        highlightOnHover
                        persistTableHead
                        responsive
                        noHeader
                    />
                )}
            </div>
        </div>
    );
}

export default MentorTestimoniesPage;
