import api from "@/api";

// ========== ADMIN COURSE ==========

/**
 * Mengambil semua kursus.
 *
 * @async
 * @function getCourses
 * @endpoint GET /kursus
 * @returns {Promise<any>} Data semua kursus.
 */
export const getCourses = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil kursus berdasarkan ID.
 *
 * @async
 * @function getCourseById
 * @endpoint GET /kursus/{courseId}
 * @param {string|number} courseId - ID kursus.
 * @returns {Promise<any>} Data kursus.
 */
export const getCourseById = async (courseId) => {
	const token = localStorage.getItem("token");
	const response = await api.get(`/kursus/${courseId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Membuat kursus baru.
 *
 * @async
 * @function createCourse
 * @endpoint PUT /testimoni/{testimonieId}
 * @param {Object} payload - Data yang akan dibuat.
 * @returns {Promise<any>} Respons server.
 */
export const createCourse = async (payload) => {
	const token = localStorage.getItem("token");
	const response = await api.post("/kursus", payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

/**
 * Memperbarui kursus.
 *
 * @async
 * @function updateCourse
 * @endpoint PUT /kursus/{courseId}
 * @param {string|number} courseId - ID kursus.
 * @param {Object} payload - Data yang akan diperbarui.
 * @returns {Promise<any>} Respons server.
 */
export const updateCourse = async (courseId, payload) => {
	const token = localStorage.getItem("token");
	// Gunakan POST dengan _method PUT untuk kompatibilitas Laravel
	payload.append("_method", "PUT");
	const response = await api.post(`/kursus/${courseId}`, payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

/**
 * Menghapus kursus.
 *
 * @async
 * @function deleteCourse
 * @endpoint DELETE /kursus/{courseId}
 * @param {string|number} courseId - ID kursus.
 * @returns {Promise<any>} Respons server.
 */
export const deleteCourse = async (courseId) => {
	const token = localStorage.getItem("token");
	const response = await api.delete(`/kursus/${courseId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil mentor untuk admin.
 *
 * @async
 * @function getMentors
 * @endpoint GET /admin/mentor
 * @returns {Promise<any>} Data semua mentor.
 */
export const getMentors = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/mentor", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Mengambil mentor untuk admin.
 *
 * @async
 * @function getPackages
 * @endpoint GET /admin/paket
 * @returns {Promise<any>} Data semua paket.
 */
export const getPackages = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/paket", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Membuat jadwal pengajaran untuk Admin.
 *
 * @async
 * @function setsMentorSchedule
 * @endpoint PUT /mentor/atur-jadwal
 * @param {Object} payload - Data yang akan dibuat.
 * @returns {Promise<any>} Respons server.
 */
export const setSchedule = async (payload) => {
	const token = localStorage.getItem("token");
	const response = await api.post("/jadwal-kursus", payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== MENTOR COURSE ==========
/**
 * Mengambil daftar kursus milik mentor.
 *
 * @async
 * @function getMentorCourses
 * @endpoint GET /mentor/daftar-kursus
 * @returns {Promise<any>} Data kursus mentor.
 */
export const getMentorCourses = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/mentor/daftar-kursus", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Menambil daftar kursus milik mentor.
 *
 * @async
 * @function createMentorCourse
 * @endpoint POST /mentor/kursus
 * @param {Object} payload - Data yang akan dibuat.
 * @returns {Promise<any>} Respons server.
 */
export const createMentorCourse = async (payload) => {
	const token = localStorage.getItem("token");
	const response = await api.post("/mentor/kursus", payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

/**
 * Memperbarui kursus.
 *
 * @async
 * @function updateMentorCourse
 * @endpoint PUT /mentor/kursus/{courseId}
 * @param {string|number} courseId - ID kursus.
 * @param {Object} payload - Data yang akan diperbarui.
 * @returns {Promise<any>} Respons server.
 */
export const updateMentorCourse = async (courseId, payload) => {
	const token = localStorage.getItem("token");
	// Gunakan POST dengan _method PUT untuk kompatibilitas Laravel
	payload.append("_method", "PUT");
	const response = await api.post(`/mentor/kursus/${courseId}`, payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

/**
 * Membuat jadwal pengajaran.
 *
 * @async
 * @function setsMentorSchedule
 * @endpoint PUT /mentor/atur-jadwal
 * @param {Object} payload - Data yang akan dibuat.
 * @returns {Promise<any>} Respons server.
 */
export const setMentorSchedule = async (payload) => {
	const token = localStorage.getItem("token");
	const response = await api.post("/mentor/atur-jadwal", payload, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== PELANGGAN COURSE ==========
/**
 * Mengambil kursus yang dipakai oleh App dan AboutPage.
 *
 * @async
 * @function getPublicCourses
 * @endpoint GET /public/kursus
 * @returns {Promise<any>} Data semua kursus public.
 */
export const getPublicCourses = async () => {
	const token = localStorage.getItem("token");
	const endpoint = token ? "/pelanggan/daftar-kursus" : "/public/kursus";
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	const response = await api.get(endpoint, { headers });
	return response.data;
};
