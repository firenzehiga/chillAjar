// Helper API instance pakai base URL dari .env
// Pakai: import api from './api.jsx'
// - Base URL diatur lewat VITE_PUBLIC_API di .env
// - Jika .env tidak diisi, fallback ke backend public default
import axios from "axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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
		const originalRequest = error.config;
		const message = error.response?.data?.message || "";

		// Jangan trigger logout/toast jika error dari /login atau /register
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 403) &&
			originalRequest &&
			!["/login", "/register"].some((path) =>
				originalRequest.url?.includes(path)
			)
		) {
			if (
				message.toLowerCase().includes("token") ||
				message.toLowerCase().includes("expired") ||
				message.toLowerCase().includes("unauthorized")
			) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				import("./stores/useAppStore").then((module) => {
					module.default.getState().handleLogout();
				});
				toast.error(
					<div className="text-center">
						<div className="font-semibold text-red-800 mb-2">
							Sesi Anda telah berakhir
						</div>
						<div className="text-sm text-gray-700">
							Silakan login kembali untuk melanjutkan.
						</div>
					</div>,
					{
						duration: 2000,
						position: "top-center",
						style: {
							background: "#fef2f2",
							border: "1px solid #ef4444",
							padding: "16px",
							borderRadius: "8px",
							minWidth: "300px",
						},
					}
				);
				return Promise.reject(error);
			}
		}

		// JANGAN setApiError untuk error dari /login atau /register
		if (
			originalRequest &&
			["/login", "/register"].some((path) =>
				originalRequest.url?.includes(path)
			)
		) {
			return Promise.reject(error);
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
