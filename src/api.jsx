// Helper: instance API pakai base URL dari .env (VITE_PUBLIC_API)
// - Jika VITE_PUBLIC_API tidak di-set, fallback ke https://peladen.my.id/api
import axios from "axios";
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

// Request interceptor - tambahkan token jika ada
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	} else {
		// pastikan tidak mengirim header Authorization jika tidak ada token
		delete config.headers.Authorization;
	}
	return config;
});

/**
 * Mapping singkat untuk alias error
 * @param {any} error
 * @returns {string}
 */
function getErrorAlias(error) {
	if (error.code === "ERR_NETWORK") return "Network";
	if (error.response?.status === 401 || error.response?.status === 403)
		return "Auth";
	if (error.response?.status >= 500) return "Server";
	if (error.response?.status === 404) return "Not Found";
	return "Unknown";
}

// Response interceptor - handle session expired & set api error di store
api.interceptors.response.use(
	(response) => response,
	(error) => {
		const originalRequest = error.config;
		const message = error.response?.data?.message || "";

		// Jangan trigger logout/toast untuk requests ke /login atau /register
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 403) &&
			originalRequest &&
			!["/login", "/register"].some((path) =>
				originalRequest.url?.includes(path)
			)
		) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");

			// Panggil action logout dari store (dinamis import)
			import("./stores/useAppStore").then((module) => {
				module.default.getState().handleLogout();
			});

			// Informasi singkat ke user
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

		// Jika request menandakan skipGlobalError, jangan set api error di store
		if (originalRequest && originalRequest.skipGlobalError) {
			return Promise.reject(error);
		}
		// Set api error di store untuk kasus selain login/register
		const alias = getErrorAlias(error);
		import("./stores/useAppStore").then((module) => {
			module.default.getState().setApiError({
				code: (error.code || "") + " - " + (error.response?.status || ""),
				alias,
				message:
					error.response?.data?.message ||
					"Terjadi kesalahan pada server. Silakan coba lagi atau hubungi admin.",
			});
		});

		return Promise.reject(error);
	}
);

export default api;
