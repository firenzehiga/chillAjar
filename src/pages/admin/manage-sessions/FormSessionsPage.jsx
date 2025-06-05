import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminFormSessionsPage({ onNavigate, sessionId }) {
	// Pastikan selalu dalam mode edit
	if (!sessionId) {
		onNavigate("admin-manage-sessions");
		return null;
	}

	const [formData, setFormData] = useState({
		mentorId: "",
		pelangganId: "",
		kursusId: "",
		jadwalKursusId: "",
		detailKursus: "",
		statusSesi: "pending",
	});
	const [mentors, setMentors] = useState([]);
	const [pelanggans, setPelanggans] = useState([]);
	const [kursus, setKursus] = useState([]);
	const [jadwalKursus, setJadwalKursus] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch data sesi dan data relasi
	useEffect(() => {
		const fetchMentors = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/admin/mentor", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setMentors(response.data);
			} catch (err) {
				setError("Gagal mengambil daftar mentor");
			}
		};

		const fetchPelanggans = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/admin/pelanggan", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setPelanggans(response.data);
			} catch (err) {
				setError("Gagal mengambil daftar pelanggan");
			}
		};

		const fetchKursus = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/kursus", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setKursus(response.data);
			} catch (err) {
				setError("Gagal mengambil daftar kursus");
			}
		};

		const fetchJadwalKursus = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await api.get("/jadwal-kursus", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setJadwalKursus(response.data);
			} catch (err) {
				setError("Gagal mengambil daftar jadwal kursus");
			}
		};

		const fetchSession = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				const response = await api.get(`/sesi/${sessionId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const sessionData = response.data;
				setFormData({
					mentorId: sessionData.mentor_id || "",
					pelangganId: sessionData.pelanggan_id || "",
					kursusId: sessionData.kursus_id || "",
					jadwalKursusId: sessionData.jadwal_kursus_id || "",
					detailKursus: sessionData.detailKursus || "",
					statusSesi: sessionData.statusSesi || "pending",
				});
			} catch (err) {
				setError("Gagal mengambil data sesi");
			} finally {
				setLoading(false);
			}
		};

		fetchMentors();
		fetchPelanggans();
		fetchKursus();
		fetchJadwalKursus();
		fetchSession();
	}, [sessionId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const payload = {
				mentor_id: formData.mentorId,
				pelanggan_id: formData.pelangganId,
				kursus_id: formData.kursusId,
				jadwal_kursus_id: formData.jadwalKursusId,
				detailKursus: formData.detailKursus,
				statusSesi: formData.statusSesi,
			};

			const response = await api.put(`/sesi/${sessionId}`, payload, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Session updated successfully!",
					confirmButtonColor: "#3B82F6",
				});
				onNavigate("admin-manage-sessions");
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Terjadi kesalahan saat memperbarui data.",
					confirmButtonColor: "#EF4444",
				});
			}
		} catch (err) {
			const errorMessage =
				err.response?.data?.message || err.message || "Gagal memperbarui sesi";
			setError(errorMessage);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: errorMessage,
				confirmButtonColor: "#EF4444",
			});
			console.error("Error details:", err.response ? err.response.data : err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-[60vh] text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="py-8">
			<button
				onClick={() => onNavigate("admin-manage-sessions")}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
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
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
					Edit Session
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="mentorId"
								className="block text-sm font-medium text-gray-700 mb-1">
								Mentor
							</label>
							<select
								id="mentorId"
								name="mentorId"
								value={formData.mentorId}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								required>
								<option value="">Select a mentor</option>
								{mentors.map((mentor) => (
									<option key={mentor.id} value={mentor.id}>
										{mentor.user?.nama || "Unknown Mentor"}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor="pelangganId"
								className="block text-sm font-medium text-gray-700 mb-1">
								Pelanggan
							</label>
							<select
								id="pelangganId"
								name="pelangganId"
								value={formData.pelangganId}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								required>
								<option value="">Select a pelanggan</option>
								{pelanggans.map((pelanggan) => (
									<option key={pelanggan.id} value={pelanggan.id}>
										{pelanggan.user?.nama || "Unknown Pelanggan"}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div>
							<label
								htmlFor="kursusId"
								className="block text-sm font-medium text-gray-700 mb-1">
								Kursus
							</label>
							<select
								id="kursusId"
								name="kursusId"
								value={formData.kursusId}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								required>
								<option value="">Select a kursus</option>
								{kursus.map((k) => (
									<option key={k.id} value={k.id}>
										{k.namaKursus || "Unknown Kursus"}
									</option>
								))}
							</select>
						</div>
						<div>
							<label
								htmlFor="jadwalKursusId"
								className="block text-sm font-medium text-gray-700 mb-1">
								Jadwal Kursus
							</label>
							<select
								id="jadwalKursusId"
								name="jadwalKursusId"
								value={formData.jadwalKursusId}
								onChange={handleChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
								required>
								<option value="">Select a jadwal</option>
								{jadwalKursus.map((jadwal) => (
									<option key={jadwal.id} value={jadwal.id}>
										{jadwal.tanggal} {jadwal.waktu.slice(0, 5)} -{" "}
										{jadwal.tempat || "Unknown Location"}
									</option>
								))}
							</select>
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
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
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none"
							required>
							<option value="pending">Pending</option>
							<option value="booked">Booked</option>
							<option value="started">Started</option>
							<option value="end">End</option>
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
									: "bg-yellow-600 text-white hover:bg-yellow-700 outline-none focus:outline-none"
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
