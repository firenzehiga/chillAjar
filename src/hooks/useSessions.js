import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAppStore from "@/stores/useAppStore";
import {
	getSessions,
	deleteSession,
	getSessionById,
	updateSession,
	getMentors,
	getPelanggans,
	getKursus,
	getJadwalKursus,
	getMentorSessions,
	startSession,
	endSession,
} from "@/services/sessionsService";

// ========== ADMIN SESI ==========
// Hook untuk mengambil data sesi
export const useSessionsQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["adminSessions"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getSessions();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 60 * 1000, // 1 menit
		cacheTime: 5 * 60 * 1000, // 5 menit
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // fetch ulang otomatis tiap 1 menit
		retry: 1,
		onError: (err) => console.error("Error fetching sessions:", err),
	});
};

// Hook untuk menghapus sesi
export const useDeleteSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSession,
		onSuccess: (_, sessionId) => {
			// Update cache secara optimis
			queryClient.setQueryData(["adminSessions"], (oldData) =>
				oldData.filter((s) => s.id !== sessionId)
			);
			// toast success akan ditangani di komponen
		},
		onError: () => {
			// toast error akan ditangani di komponen
		},
	});
};

// ========== ADMIN FORM SESI ==========
// Hook untuk mengambil data sesi berdasarkan ID
export const useSessionByIdQuery = (sessionId) => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["session", sessionId],
		queryFn: async () => {
			if (!isAuthenticated || !sessionId) return null;
			const response = await getSessionById(sessionId);
			return response;
		},
		enabled: !!sessionId && isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// Hook untuk memperbarui sesi
export const useUpdateSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ sessionId, payload }) => updateSession(sessionId, payload),
		onSuccess: () => {
			// Invalidasi dan fetch ulang
			queryClient.invalidateQueries(["adminSessions"]);
			queryClient.invalidateQueries(["adminTransactions"]);
			queryClient.invalidateQueries(["statusTransactions"]);
			queryClient.invalidateQueries(["sessionsWidget"]);
		},
	});
};

// Hook untuk mengambil data mentor
export const useMentorsQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["mentors"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getMentors();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// Hook untuk mengambil data pelanggan
export const usePelanggansQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["pelanggans"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getPelanggans();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// Hook untuk mengambil data kursus
export const useKursusQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["kursus"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getKursus();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// Hook untuk mengambil data jadwal kursus
export const useJadwalKursusQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["jadwalKursus"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getJadwalKursus();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
	});
};

// ========== MENTOR SESI ==========
// Hook untuk mengambil data sesi mentor
export const useMentorSessionsQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["mentorSessions"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getMentorSessions();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 menit
		cacheTime: 10 * 60 * 1000, // 10 menit
		retry: 1,
		onError: (err) => {
			console.error("Error fetching mentor sessions:", err);
		},
	});
};

// Hook untuk memulai sesi
export const useStartSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: startSession,
		onSuccess: async () => {
			// Fetch ulang queries
			await queryClient.refetchQueries(["mentorSessions"]);
			queryClient.refetchQueries(["mentorTransactions"]);
			// Pesan sukses akan ditangani di komponen
		},
		onError: () => {
			// Error akan ditangani di komponen
		},
	});
};

// Hook untuk mengakhiri sesi
export const useEndSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: endSession,
		onSuccess: async () => {
			// Fetch ulang queries
			await queryClient.refetchQueries(["mentorSessions"]);
			queryClient.refetchQueries(["mentorTransactions"]);
			// Pesan sukses akan ditangani di komponen
		},
		onError: () => {
			// Error akan ditangani di komponen
		},
	});
};
