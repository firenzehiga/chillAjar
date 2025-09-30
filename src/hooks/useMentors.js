import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getPublicMentors,
	getMentors,
	getMentorById,
	updateMentor,
	deleteMentor,
	toggleMentorStatus,
	downloadMentorDocument,
} from "@/services/mentorsService";

// ========== MENTOR ADMIN ==========
// Hook untuk mengambil data mentor
export const useMentorsQuery = () => {
	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	return useQuery({
		queryKey: ["adminMentors"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getMentors();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000, // 1 menit - cukup fresh tapi tidak terlalu sering refetch
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		retry: 1,
		onError: (err) => {
			console.error("Error fetching Mentors:", err);
		},
	});
};

// Hook untuk mengambil data mentor berdasarkan ID
export const useMentorByIdQuery = (mentorId) => {
	const token = localStorage.getItem("token");
	const isAuthenticated = !!token;

	return useQuery({
		queryKey: ["mentor", mentorId],
		queryFn: async () => {
			if (!isAuthenticated || !mentorId) return null;
			const response = await getMentorById(mentorId);
			return response;
		},
		enabled: !!mentorId && isAuthenticated,
		staleTime: 0, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// Hook untuk menghapus mentor
export const useDeleteMentorMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteMentor,
		onSuccess: (_, mentorId) => {
			// Update cache secara optimis
			queryClient.setQueryData(["adminMentors"], (oldData) =>
				oldData.filter((mentor) => mentor.id !== mentorId)
			);
			queryClient.invalidateQueries(["publicMentorsPage"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};

// Hook untuk update mentor
export const useUpdateMentorMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ mentorId, payload }) => {
			// Jika payload adalah FormData, kirim langsung
			if (payload instanceof FormData) {
				return updateMentor(mentorId, payload);
			}
			// Jika bukan FormData, kirim sebagai objek biasa
			return updateMentor(mentorId, payload);
		},
		onSuccess: () => {
			// Invalidasi dan fetch ulang
			queryClient.invalidateQueries(["adminMentors"]);
			queryClient.invalidateQueries(["publicMentorsPage"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};

// Hook untuk toggle status mentor
export const useToggleMentorStatusMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ mentorId, newStatus }) =>
			toggleMentorStatus(mentorId, newStatus),
		onSuccess: (_, { mentorId, newStatus }) => {
			// Update cache optimistically
			queryClient.setQueryData(["adminMentors"], (oldData) =>
				oldData.map((mentor) =>
					mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
				)
			);
			queryClient.invalidateQueries(["adminMentors"]);
		},
	});
};

// Hook untuk download dokumen mentor
export const useDownloadMentorDocument = () => {
	return useMutation({
		mutationFn: downloadMentorDocument,
	});
};

// ========== PELANGGAN MENTORS ==========
// Hook untuk mengambil data mentor public untuk halaman about
export const usePublicMentorsQuery = () => {
	return useQuery({
		queryKey: ["publicMentors"],
		queryFn: async () => {
			const response = await getPublicMentors();
			return response;
		},
		// staleTime: 60 * 1000, // 30 detik (sangat pendek)
		// cacheTime: 2 * 60 * 1000, // 2 menit cache
		// refetchOnWindowFocus: true, // Refetch saat focus (safety)
		// refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit
		// retry: 1,
		onError: (err) => {
			console.error("Error fetching public Mentors:", err);
		},
	});
};
