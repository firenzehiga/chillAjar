// Helper API instance pakai base URL dari .env
// Pakai: import api from './api.jsx'
// - Base URL diatur lewat VITE_PUBLIC_API di .env
// - Jika .env tidak diisi, fallback ke backend public default
import axios from "axios";

const PUBLIC_API =
	import.meta.env.VITE_PUBLIC_API || "https://peladen.my.id/api";

const api = axios.create({
	baseURL: PUBLIC_API,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
