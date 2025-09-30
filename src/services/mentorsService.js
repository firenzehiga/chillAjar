import api from "@/api";

// ========== MENTOR ADMIN ==========
// Mengambil semua mentor
export const getMentors = async () => {
	const token = localStorage.getItem("token");
	const response = await api.get("/admin/mentor", {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Mengambil mentor berdasarkan ID
export const getMentorById = async (mentorId) => {
	const token = localStorage.getItem("token");
	const response = await api.get(`/admin/mentor/${mentorId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Memperbarui mentor
export const updateMentor = async (mentorId, payload) => {
	const token = localStorage.getItem("token");
	const response = await api.post(`/admin/mentor/${mentorId}`, payload, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

// Menghapus mentor
export const deleteMentor = async (mentorId) => {
	const token = localStorage.getItem("token");
	const response = await api.delete(`/admin/mentor/${mentorId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};

// Download dokumen mentor
export const downloadMentorDocument = async (mentorId) => {
	const token = localStorage.getItem("token");
	const timestamp = new Date().getTime(); // Cache busting
	const response = await api.get(
		`/admin/download-dokumen-mentor/${mentorId}?t=${timestamp}`,
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

// Toggle status mentor
export const toggleMentorStatus = async (mentorId, newStatus) => {
	const token = localStorage.getItem("token");
	const response = await api.put(
		`/admin/mentor/${mentorId}`,
		{ status: newStatus },
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return response.data;
};
