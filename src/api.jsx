import axios from "axios";

// Setup: gunakan PUBLIC_API jika bisa diakses, jika tidak fallback ke LOCAL_API
const LOCAL_API = "http://localhost:8000/api";
const PUBLIC_API =
	"https://manpro-sizzlingchilli-backend-chill-ajar.onrender.com/api";

async function checkPublicApiAlive() {
	try {
		const res = await fetch(PUBLIC_API + "/ping", { method: "GET" });
		return res.ok;
	} catch {
		return false;
	}
}

export async function getApiInstance() {
	let usePublic = await checkPublicApiAlive();
	return axios.create({
		baseURL: usePublic ? PUBLIC_API : LOCAL_API,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
}

// Default export: tetap PUBLIC_API agar tidak breaking, tapi untuk auto fallback gunakan getApiInstance()
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
