import axios from "axios";

const LOCAL_API = "http://localhost:8000/api";

const api = axios.create({
	baseURL: LOCAL_API,
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
