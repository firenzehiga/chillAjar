import api from "@/api";

// Mengambil semua pembayaran
export const getPayments = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/transaksi", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Verifikasi pembayaran
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

// Tolak pembayaran
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

// Unduh bukti pembayaran
export const downloadPaymentProof = async (transaksiId) => {
	const token = localStorage.getItem("token");
	const timestamp = new Date().getTime(); // Cache busting
	const response = await api.get(
		`/admin/download-bukti-pembayaran/${transaksiId}?t=${timestamp}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Cache-Control": "no-cache",
				Praga: "no-cache",
			},
			responseType: "blob",
		}
	);
	return response.data;
};
