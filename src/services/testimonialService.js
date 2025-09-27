import api from "@/api";

// ========== ADMIN TESTIMONIAL ==========

/**
 * Mengambil semua testimoni.
 *
 * @async
 * @function getTestimonies
 * @endpoint GET /testimoni
 * @returns {Promise<any>} Data semua testimoni.
 */
export const getTestimonies = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/testimoni", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil testimoni berdasarkan ID.
 *
 * @async
 * @function getTestimonieById
 * @endpoint GET /testimoni/{testimonieId}
 * @param {string|number} testimonieId - ID testimoni.
 * @returns {Promise<any>} Data testimoni.
 */
export const getTestimonieById = async (testimonieId) => {
	const token = localStorage.getItem("token");
	const response = await api.get(`/testimoni/${testimonieId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Memperbarui testimoni.
 *
 * @async
 * @function updateTestimonie
 * @endpoint PUT /testimoni/{testimonieId}
 * @param {string|number} testimonieId - ID testimoni.
 * @param {Object} payload - Data yang akan diperbarui.
 * @returns {Promise<any>} Respons server.
 */
export const updateTestimonie = async (testimonieId, payload) => {
	const token = localStorage.getItem("token");
	const response = await api.put(`/testimoni/${testimonieId}`, payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Menghapus testimoni.
 *
 * @async
 * @function deleteTestimonie
 * @endpoint DELETE /testimoni/{testimonieId}
 * @param {string|number} testimonieId - ID testimoni.
 * @returns {Promise<any>} Respons server.
 */
export const deleteTestimonie = async (testimonieId) => {
	const token = localStorage.getItem("token");
	const response = await api.delete(`/testimoni/${testimonieId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== MENTOR TESTIMONIAL ==========

/**
 * Mengambil daftar sesi milik mentor yang sedang login.
 *
 * @async
 * @function getMentorTestimonies
 * @endpoint GET /mentor/daftar-testimoni
 * @returns {Promise<any>} Data testimoni mentor.
 */
export const getMentorTestimonies = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/mentor/daftar-testimoni", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};
