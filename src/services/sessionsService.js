import api from "@/api";

// ========== ADMIN SESI ==========

// Mengambil semua sesi
export const getSessions = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/sesi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil sesi berdasarkan ID
export const getSessionById = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.get(`/sesi/${sessionId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Memperbarui sesi
export const updateSession = async (sessionId, payload) => {
	const token = localStorage.getItem("token");
	const response = await api.put(`/sesi/${sessionId}`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Menghapus sesi
export const deleteSession = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.delete(`/sesi/${sessionId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil semua mentor
export const getMentors = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/mentor", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil semua pelanggan
export const getPelanggans = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/pelanggan", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil semua kursus
export const getKursus = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil semua jadwal kursus
export const getJadwalKursus = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/jadwal-kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== MENTOR SESI ==========

// Mengambil sesi mentor
export const getMentorSessions = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/mentor/daftar-sesi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Memulai sesi
export const startSession = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.post(
		`/mentor/mulai-sesi/${sessionId}`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

// Mengakhiri sesi
export const endSession = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.post(
		`/mentor/selesai-sesi/${sessionId}`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};
