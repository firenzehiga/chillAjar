// Helper API instance pakai base URL dari .env
// Pakai: import api from './api.jsx'
// - Base URL diatur lewat VITE_PUBLIC_API di .env
// - Jika .env tidak diisi, fallback ke backend public default
import axios from "axios";
import Swal from "sweetalert2";

const PUBLIC_API =
	import.meta.env.VITE_PUBLIC_API || "https://peladen.my.id/api";

const api = axios.create({
	baseURL: PUBLIC_API,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Request interceptor - tambah token ke header
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	// Hanya tambahkan Authorization jika token ada
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	} else {
		// Pastikan header Authorization tidak dikirim jika tidak login
		delete config.headers.Authorization;
	}
	return config;
});

function getErrorAlias(error) {
	if (error.code === "ERR_NETWORK") return "Network";
	if (error.response?.status === 401 || error.response?.status === 403)
		return "Auth";
	if (error.response?.status >= 500) return "Server";
	if (error.response?.status === 404) return "Not Found";
	return "Unknown";
}
// Response interceptor - handle session expired
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Cek kalau token expired atau unauthorized
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 403)
		) {
			const message = error.response.data?.message || "";

			// Cek kalau memang session expired (bukan login gagal biasa)
			if (
				message.toLowerCase().includes("token") ||
				message.toLowerCase().includes("expired") ||
				message.toLowerCase().includes("unauthorized")
			) {
				// Auto logout
				localStorage.removeItem("token");
				localStorage.removeItem("user");

				// Import store function untuk logout
				import("./stores/useAppStore").then((module) => {
					module.default.getState().handleLogout();
				});

				// Tampilkan pesan
				Swal.fire({
					icon: "warning",
					title: "Sesi Berakhir",
					text: "Sesi Anda telah berakhir. Silakan login kembali.",
					confirmButtonColor: "#3B82F6",
					confirmButtonText: "OK",
				});

				// STOP di sini, JANGAN setApiError!
				return Promise.reject(error);
			}

			// Jika user memang belum login (tidak ada token), JANGAN setApiError!
			if (!localStorage.getItem("token")) {
				return Promise.reject(error);
			}
		}

		// Selain kasus Auth/session expired, baru setApiError
		const alias = getErrorAlias(error);
		import("./stores/useAppStore").then((module) => {
			module.default.getState().setApiError({
				code: error.code + " - " + error.response?.status,
				alias,
				message:
					"Terjadi masalah saat menghubungi server. Silakan coba lagi atau hubungi admin.",
			});
		});

		return Promise.reject(error);
	}
);

export default api;
