import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8000/api", // Sesuaikan dengan URL Laravel Anda
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Tambahkan interceptor untuk menyisipkan token di setiap request
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
