import api from "@/api";

/**
 * Mengambil semua data transaksi/pembayaran.
 *
 * @async
 * @function getPayments
 * @endpoint GET /transaksi
 * @returns {Promise<any>} Data transaksi.
 *
 */
export const getPayments = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/transaksi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

/**
 * Menghapusdata transaksi/pembayaran.
 *
 * @async
 * @function deletePayment
 * @endpoint DELETE /transaksi
 * @returns {Promise<any>} Data transaksi.
 *
 */
export const deletePayment = async (id) => {
	try {
		await api.delete(`/transaksi/${id}`);
	} catch (error) {
		console.error("Error deleting payment:", error);
		throw error;
	}
};

/**
 * Verifikasi pembayaran untuk transaksi tertentu (admin).
 *
 * @async
 * @function verifyPayment
 * @endpoint POST /admin/verifikasi-pembayaran
 * @param {string|number} transaksiId - ID transaksi.
 * @returns {Promise<any>} Respons server.
 *
 */
export const verifyPayment = async (transaksiId) => {
	const token = localStorage.getItem("token");
	const response = await api.post(
		`/admin/verifikasi-pembayaran/${transaksiId}`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

/**
 * Menolak pembayaran untuk transaksi tertentu (admin).
 *
 * @async
 * @function rejectPayment
 * @endpoint POST /admin/tolak-pembayaran
 * @param {string|number} transaksiId - ID transaksi.
 * @returns {Promise<any>} Respons server.
 *
 */
export const rejectPayment = async (transaksiId) => {
	const token = localStorage.getItem("token");
	const response = await api.post(
		`/admin/tolak-pembayaran/${transaksiId}`,
		{},
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};

/**
 * Mengunduh file bukti pembayaran (Blob).
 *
 * @async
 * @function downloadPaymentProof
 * @endpoint GET /admin/download-bukti-pembayaran/{transaksiId}
 * @param {string|number} transaksiId - ID transaksi.
 * @returns {Promise<Blob>} File bukti pembayaran.
 *
 */
export const downloadPaymentProof = async (transaksiId) => {
	const token = localStorage.getItem("token");
	const timestamp = new Date().getTime(); // Cache busting
	const response = await api.get(
		`/admin/download-bukti-pembayaran/${transaksiId}?t=${timestamp}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
			},
			responseType: "blob",
		}
	);
	return response.data;
};
