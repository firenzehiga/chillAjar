import api from "@/api";

// ========== ADMIN SESI ==========

/**
 * Mengambil semua sesi.
 *
 * @async
 * @function getSessions
 * @endpoint GET /sesi
 * @returns {Promise<any>} Data semua sesi.
 */
export const getSessions = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/sesi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil sesi berdasarkan ID.
 *
 * @async
 * @function getSessionById
 * @endpoint GET /sesi/{sessionId}
 * @param {string|number} sessionId - ID sesi.
 * @returns {Promise<any>} Data sesi.
 */
export const getSessionById = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.get(`/sesi/${sessionId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Memperbarui sesi.
 *
 * @async
 * @function updateSession
 * @endpoint PUT /sesi/{sessionId}
 * @param {string|number} sessionId - ID sesi.
 * @param {Object} payload - Data yang akan diperbarui.
 * @returns {Promise<any>} Respons server.
 */
export const updateSession = async (sessionId, payload) => {
	const token = localStorage.getItem("token");
	const response = await api.put(`/sesi/${sessionId}`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Menghapus sesi.
 *
 * @async
 * @function deleteSession
 * @endpoint DELETE /sesi/{sessionId}
 * @param {string|number} sessionId - ID sesi.
 * @returns {Promise<any>} Respons server.
 */
export const deleteSession = async (sessionId) => {
	const token = localStorage.getItem("token");
	const response = await api.delete(`/sesi/${sessionId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil semua mentor (admin).
 *
 * @async
 * @function getMentors
 * @endpoint GET /admin/mentor
 * @returns {Promise<any>} Data mentor.
 */
export const getMentors = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/mentor", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil semua pelanggan (admin).
 *
 * @async
 * @function getPelanggans
 * @endpoint GET /admin/pelanggan
 * @returns {Promise<any>} Data pelanggan.
 */
export const getPelanggans = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/pelanggan", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil semua kursus.
 *
 * @async
 * @function getKursus
 * @endpoint GET /kursus
 * @returns {Promise<any>} Data kursus.
 */
export const getKursus = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil semua jadwal kursus.
 *
 * @async
 * @function getJadwalKursus
 * @endpoint GET /jadwal-kursus
 * @returns {Promise<any>} Data jadwal kursus.
 */
export const getJadwalKursus = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/jadwal-kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== MENTOR SESI ==========

/**
 * Mengambil daftar sesi milik mentor yang sedang login.
 *
 * @async
 * @function getMentorSessions
 * @endpoint GET /mentor/daftar-sesi
 * @returns {Promise<any>} Data sesi mentor.
 */
export const getMentorSessions = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/mentor/daftar-sesi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Memulai sesi (mentor).
 *
 * @async
 * @function startSession
 * @endpoint POST /mentor/mulai-sesi/{sessionId}
 * @param {string|number} sessionId - ID sesi.
 * @returns {Promise<any>} Respons server.
 */
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

/**
 * Mengakhiri sesi (mentor).
 *
 * @async
 * @function endSession
 * @endpoint POST /mentor/selesai-sesi/{sessionId}
 * @param {string|number} sessionId - ID sesi.
 * @returns {Promise<any>} Respons server.
 */
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

// ========== PELANGGAN SESI ==========

/**
 * Mengambil daftar sesi milik pelanggan yang sedang login.
 *
 * @async
 * @function getPelangganSessions
 * @endpoint GET /pelanggan/daftar-sesi
 * @returns {Promise<any>} Data sesi pelanggan.
 */
export const getPelangganSessions = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/pelanggan/daftar-sesi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== PELANGGAN SESI ==========

/**
 * Mengambil daftar sesi milik pelanggan yang sedang login.
 *
 * @async
 * @function getPelangganSessions
 * @endpoint GET /pelanggan/daftar-sesi
 * @returns {Promise<any>} Data sesi pelanggan.
 */
export const getPelangganSessionsTransaction = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/pelanggan/daftar-sesi-transaksi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};
