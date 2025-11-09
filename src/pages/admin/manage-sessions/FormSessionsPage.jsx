import { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { FormSkeletonCard } from "@/components/Skeleton/FormSkeletonCard";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
	useSessionByIdQuery,
	useUpdateSessionMutation,
} from "@/hooks/useSessions";

export function AdminFormSessionsPage({ onNavigate, sessionId }) {
	// Pastikan selalu dalam mode edit
	if (!sessionId) {
		onNavigate("admin-manage-sessions");
		return null;
	}
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		detailKursus: "",
		statusSesi: "pending",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Hanya ambil data sesi spesifik
	const { data: sessionData, isLoading: sessionLoading } =
		useSessionByIdQuery(sessionId);

	// Update form data when session data is loaded
	useEffect(() => {
		if (sessionData) {
			setFormData({
				detailKursus: sessionData.detailKursus || "",
				statusSesi: sessionData.statusSesi || "pending",
				// Tidak lagi mengupdate field yang tidak boleh diubah
			});
		}
	}, [sessionData]);

	// Mutation for updating session
	const updateSessionMutation = useUpdateSessionMutation();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const payload = {
			detailKursus: formData.detailKursus,
			statusSesi: formData.statusSesi,
			// Tidak mengirim field yang tidak boleh diubah
		};

		updateSessionMutation.mutate(
			{ sessionId, payload },
			{
				onSuccess: () => {
					toast.success("Session berhasil diperbarui!");
					onNavigate("admin-manage-sessions");
				},
				onError: (err) => {
					const errorMessage =
						err.response?.data?.message ||
						err.message ||
						"Gagal memperbarui sesi";
					setError(errorMessage);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: errorMessage,
						confirmButtonColor: "#EF4444",
					});
					console.error(
						"Error details:",
						err.response ? err.response.data : err
					);
				},
				onSettled: () => {
					setLoading(false);
				},
			}
		);
	};

	// Tampilkan skeleton jika query sesi masih loading
	if (sessionLoading) {
		return <FormSkeletonCard />;
	}

	// Tambahkan pengecekan tambahan jika sessionData belum ada atau form belum diisi
	if (!sessionData) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-manage-sessions")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-blue-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1024 1024"
						height="25px"
						width="25px">
						<path
							d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
							fill="#000000"
						/>
						<path
							d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
							fill="#000000"
						/>
					</svg>
				</div>
				<p className="translate-x-2">Cancel</p>
			</button>
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					Edit Session
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="mentorName"
								className="block text-sm font-medium text-gray-700 mb-1">
								Mentor
							</label>
							<div
								id="mentorName"
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
								{sessionData.mentor?.user?.nama || "Unknown Mentor"}
							</div>
						</div>
						<div>
							<label
								htmlFor="pelangganName"
								className="block text-sm font-medium text-gray-700 mb-1">
								Pelanggan
							</label>
							<div
								id="pelangganName"
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
								{sessionData.pelanggan?.user?.nama || "Unknown Pelanggan"}
							</div>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="kursusName"
								className="block text-sm font-medium text-gray-700 mb-1">
								Kursus
							</label>
							<div
								id="kursusName"
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
								{sessionData.kursus?.namaKursus || "Unknown Kursus"}
							</div>
						</div>
						<div>
							<label
								htmlFor="jadwalKursus"
								className="block text-sm font-medium text-gray-700 mb-1">
								Jadwal Kursus
							</label>
							<div
								id="jadwalKursus"
								className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100">
								{sessionData.jadwal_kursus?.tanggal}{" "}
								{sessionData.jadwal_kursus?.waktu.slice(0, 5)}{" "}
								{sessionData.jadwal_kursus?.gayaMengajar === "offline" &&
								sessionData.jadwal_kursus?.tempat
									? `- ${sessionData.jadwal_kursus?.tempat}`
									: "- Online"}{" "}
							</div>
						</div>
					</div>
					<div className="mb-4">
						<label
							htmlFor="detailKursus"
							className="block text-sm font-medium text-gray-700 mb-1">
							Detail Kursus
						</label>
						<textarea
							id="detailKursus"
							name="detailKursus"
							value={formData.detailKursus}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							placeholder="Enter session details"
							rows="4"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="statusSesi"
							className="block text-sm font-medium text-gray-700 mb-1">
							Status Sesi
						</label>
						<select
							id="statusSesi"
							name="statusSesi"
							value={formData.statusSesi}
							onChange={handleChange}
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none focus:outline-none"
							required>
							<option value="">Select status</option>
							<option value="pending">Pending</option>
							<option value="booked">Booked</option>
							<option value="started">Started</option>
							<option value="end">End</option>
							<option value="review" disabled>
								Reviewed
							</option>
						</select>
					</div>

					{error && (
						<div className="mb-4 text-red-500 text-sm flex items-center">
							<AlertCircle className="w-4 h-4 mr-2" />
							{error}
						</div>
					)}

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							className={`px-4 py-2 rounded-lg transition-colors ${
								loading
									? "bg-gray-300 text-gray-500 cursor-not-allowed outline-none focus:outline-none"
									: "bg-blue-600 text-white hover:bg-blue-700 outline-none focus:outline-none"
							}`}>
							{loading ? "Processing..." : "Update Session"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default AdminFormSessionsPage;
