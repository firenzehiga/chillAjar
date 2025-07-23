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
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor - handle session expired
api.interceptors.response.use(
	(response) => {
		return response;
	},
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
				message.toLowerCase().includes("unauthorized") ||
				error.response.status === 401
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
			}
		}

		return Promise.reject(error);
	}
);

export default api;
