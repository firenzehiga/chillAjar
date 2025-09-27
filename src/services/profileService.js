import api from "@/api";

// ========== PROFIL ADMIN ==========
// Admin tidak perlu endpoint get karena hanya menggunakan data dari props

// ========== PROFIL MENTOR ==========
/**
 * Mengambil data profil mentor yang sedang login.
 *
 * @async
 * @function getMentorProfile
 * @endpoint GET /mentor/profil-saya
 * @returns {Promise<any>} Data profil mentor.
 */
export const getMentorProfile = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/mentor/profil-saya", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== PROFIL PELANGGAN ==========
/**
 * Mengambil data profil pelanggan (informasi umum).
 *
 * @async
 * @function getPelangganProfileInfo
 * @endpoint GET /pelanggan/profil-info
 * @returns {Promise<any>} Data profil pelanggan.
 */
export const getPelangganProfileInfo = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/pelanggan/profil-info", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// ========== EDIT PROFIL (UMUM) ==========
/**
 * Memperbarui profil user (umum). Menggunakan multipart/form-data agar mendukung upload foto.
 *
 * @async
 * @function updateProfile
 * @endpoint POST /user/profil  (mengirim _method=PUT)
 * @param {Object} payload - Data profil yang akan diupdate.
 * @param {string} payload.nama - Nama user.
 * @param {string} payload.email - Email user.
 * @param {string} [payload.nomorTelepon] - Nomor telepon (opsional).
 * @param {string} [payload.alamat] - Alamat (opsional).
 * @param {File} [payload.foto_profil] - File foto profil (opsional).
 * @param {string} [payload.deskripsi] - Deskripsi/bio (opsional).
 * @returns {Promise<any>} Respons server.
 */
export const updateProfile = async (payload) => {
	const token = localStorage.getItem("token");
	const userPayload = new FormData();

	userPayload.append("nama", payload.nama);
	userPayload.append("email", payload.email);
	if (payload.nomorTelepon) {
		userPayload.append("nomorTelepon", payload.nomorTelepon);
	}
	if (payload.alamat) {
		userPayload.append("alamat", payload.alamat);
	}
	if (payload.foto_profil instanceof File) {
		userPayload.append("foto_profil", payload.foto_profil);
	}
	if (payload.deskripsi) {
		userPayload.append("deskripsi", payload.deskripsi);
	}
	userPayload.append("_method", "PUT");

	const response = await api.post("/user/profil", userPayload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};
