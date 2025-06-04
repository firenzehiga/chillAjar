import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { UserCheck, Plus, Pencil, Trash, Star } from "lucide-react";
import api from "../../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function AdminMentorsPage({ onNavigate }) {
	const queryClient = useQueryClient();

	// Fetch data transaksi yang mencakup detail sesi
	const {
		data: mentors = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["adminMentors"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const response = await api.get("/admin/mentor", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched mentors:", response.data);
			return response.data;
		},
		retry: 1, // Hanya coba ulang sekali jika gagal
		onError: (err) => {
			console.error("Error fetching Mentors:", err);
		},
	});

	const handleEdit = (id) => {
		onNavigate(`admin-edit-mentor/${id}`);
	};

	const handleDelete = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const token = localStorage.getItem("token");
					await api.delete(`/admin/mentor/${id}`, {
						headers: { Authorization: `Bearer ${token}` },
					});

					queryClient.setQueryData(["adminMentors"], (oldData) =>
						oldData.filter((mentor) => mentor.id !== id)
					);
					Swal.fire("Deleted!", response?.data?.message, "success");
				} catch (err) {
					Swal.fire("Error!", "Failed to delete mentor.", "error");
				}
			}
		});
	};

	const columns = [
		{
			name: "No",
			selector: (row, index) => index + 1,
			width: "80px",
			sortable: true,
		},
		{
			name: "Nama Mentor",
			selector: (row) => row.user?.nama,
			width: "180px",
			sortable: true,
		},
		{
			name: "Rating",
			cell: (row) => (
				<div className="flex text-yellow-500">
					<Star className="w-4 h-4" fill="currentColor" />
					<span className="ml-1 text-gray-700">{row.rating.toFixed(1)}</span>
				</div>
			),
			sortable: true,
			sortFunction: (a, b) => (a.rating || 0) - (b.rating || 0), // Handle undefined rating
		},
		{
			name: "Biaya Per Sesi",
			selector: (row) => `Rp ${row.biayaPerSesi?.toLocaleString() || "N/A"}`,
		},
		{ name: "Deskripsi", selector: (row) => row.deskripsi || "N/A" },
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

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading mentor data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-red-500">
				<p>{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded">
					Reload
				</button>
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold flex items-center text-gray-900">
					<UserCheck className="w-6 h-6 mr-2 text-yellow-600" />
					Manage Mentors
				</h1>
				<p className="text-gray-600">Manage platform mentors</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Mentor Management</h2>
				</div>

				<DataTable
					columns={columns}
					data={mentors}
					pagination
					highlightOnHover
					persistTableHead
					responsive
					noHeader
					// Tambahkan penanganan jika data kosong
					noDataComponent={
						<p className="p-4 text-gray-500">No mentors available</p>
					}
				/>
			</div>
		</div>
	);
}

export default AdminMentorsPage;
