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
	getPelangganSessions,
	getPelangganSessionsTransaction,
} from "@/services/sessionsService";

// ========== ADMIN SESI ==========

/**
 * ROLE: ADMIN
 *
 * Mengambil semua sesi.
 *
 * - Hanya berjalan jika user terautentikasi.
 * - Data otomatis refresh setiap 1 menit.
 * - Cache bertahan 5 menit.
 *
 * @function useSessionsQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useSessionsQuery();
 */
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
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		onError: (err) => console.error("Error fetching sessions:", err),
	});
};

/**
 * ROLE: ADMIN
 *
 * Mutation untuk menghapus sesi.
 *
 * - Menggunakan endpoint DELETE /sesi/{sessionId}.
 * - Melakukan update cache secara optimis setelah sukses.
 *
 * @function useDeleteSessionMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const deleteSession = useDeleteSessionMutation();
 * deleteSession.mutate(sessionId);
 */
export const useDeleteSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteSession,
		onSuccess: (_, sessionId) => {
			// Update cache secara optimis
			queryClient.setQueryData(["adminSessions"], (oldData) =>
				oldData.filter((s) => s.id !== sessionId)
			);
			queryClient.invalidateQueries(["adminSessions"]);

			// toast success akan ditangani di komponen
		},
		onError: () => {
			// toast error akan ditangani di komponen
		},
	});
};

// ========== ADMIN FORM SESI ==========

/**
 * ROLE: ADMIN
 *
 * Mengambil data sesi berdasarkan ID.
 *
 * @function useSessionByIdQuery
 * @param {string|number} sessionId - ID sesi.
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useSessionByIdQuery(sessionId);
 */
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

/**
 * ROLE: ADMIN
 *
 * Mutation untuk memperbarui sesi.
 *
 * - Menggunakan endpoint PUT /sesi/{sessionId}.
 * - Setelah sukses, melakukan invalidasi query terkait agar data direfresh.
 *
 * @function useUpdateSessionMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const updateSession = useUpdateSessionMutation();
 * updateSession.mutate({ sessionId, payload });
 */
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

/**
 * ROLE: ADMIN
 *
 * Mengambil daftar mentor (admin).
 *
 * @function useMentorsQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useMentorsQuery();
 */
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

/**
 * ROLE: ADMIN
 *
 * Mengambil daftar pelanggan (admin).
 *
 * @function usePelanggansQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = usePelanggansQuery();
 */
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

/**
 * ROLE: ADMIN
 *
 * Mengambil daftar kursus.
 *
 * @function useKursusQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useKursusQuery();
 */
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

/**
 * ROLE: ADMIN
 *
 * Mengambil daftar jadwal kursus.
 *
 * @function useJadwalKursusQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useJadwalKursusQuery();
 */
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

/**
 * ROLE: MENTOR
 *
 * Mengambil daftar sesi milik mentor yang sedang login.
 *
 * @function useMentorSessionsQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useMentorSessionsQuery();
 */
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

/**
 * ROLE: MENTOR
 *
 * Mutation untuk memulai sesi.
 *
 * - Menggunakan endpoint POST /mentor/mulai-sesi/{sessionId}.
 * - Setelah sukses, melakukan refetch queries terkait.
 *
 * @function useStartSessionMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const startSession = useStartSessionMutation();
 * startSession.mutate(sessionId);
 */
export const useStartSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: startSession,
		onSuccess: () => {
			// Fetch ulang queries
			queryClient.invalidateQueries(["mentorSessions"]);
			queryClient.invalidateQueries(["mentorTransactions"]);
			// Pesan sukses akan ditangani di komponen
		},
		onError: () => {
			// Error akan ditangani di komponen
		},
	});
};

/**
 * ROLE: MENTOR
 *
 * Mutation untuk mengakhiri sesi.
 *
 * - Menggunakan endpoint POST /mentor/selesai-sesi/{sessionId}.
 * - Setelah sukses, melakukan refetch queries terkait.
 *
 * @function useEndSessionMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const endSession = useEndSessionMutation();
 * endSession.mutate(sessionId);
 */
export const useEndSessionMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: endSession,
		onSuccess: () => {
			// Fetch ulang queries
			queryClient.invalidateQueries(["mentorSessions"]);
			queryClient.invalidateQueries(["mentorTransactions"]);
			// Pesan sukses akan ditangani di komponen
		},
		onError: () => {
			// Error akan ditangani di komponen
		},
	});
};

// ========== PELANGGAN SESI ==========

/**
 * ROLE: PELANGGAN
 *
 * Mengambil daftar sesi milik pelanggan yang sedang login.
 *
 * @function usePelangganSessionsQuery
 * @param {string|number} pelangganId - ID pelanggan.
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = usePelangganSessionsQuery(pelangganId);
 */
export const usePelangganSessionsQuery = (pelangganId) => {
	const { isAuthenticated, userRole } = useAppStore();
	const isEnabled =
		isAuthenticated && userRole === "pelanggan" && !!pelangganId;

	return useQuery({
		queryKey: ["pelangganSessions", pelangganId],
		queryFn: async () => {
			if (!isEnabled) return [];
			const response = await getPelangganSessions();
			return response;
		},
		enabled: isEnabled,
		// staleTime: 30 * 1000, // 30 detik - balance antara fresh dan performance
		// cacheTime: 5 * 60 * 1000, // 5 menit cache
		// refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		// refetchOnWindowFocus: true,
		retry: 1,
		onError: (err) => {
			console.error("Error fetching pelanggan sessions:", err);
		},
	});
};

/**
 * ROLE: PELANGGAN
 *
 * Mengambil daftar sesi milik pelanggan yang sedang login.
 *
 * @function usePelangganSessionsQuery
 * @param {string|number} pelangganId - ID pelanggan.
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = usePelangganSessionsQuery(pelangganId);
 */
export const usePelangganSessionsTransactionQuery = (pelangganId) => {
	const { isAuthenticated, userRole } = useAppStore();
	const isEnabled =
		isAuthenticated && userRole === "pelanggan" && !!pelangganId;

	return useQuery({
		queryKey: ["pelangganSessionsTransaction", pelangganId],
		queryFn: async () => {
			if (!isEnabled) return [];
			const response = await getPelangganSessionsTransaction();
			return response;
		},
		enabled: isEnabled,
		// staleTime: 30 * 1000, // 30 detik - balance antara fresh dan performance
		// cacheTime: 5 * 60 * 1000, // 5 menit cache
		// refetchInterval: 60 * 1000, // Auto refetch tiap 1 menit untuk update real-time
		// refetchOnWindowFocus: true,
		retry: 1,
		onError: (err) => {
			console.error("Error fetching pelanggan sessions:", err);
		},
	});
};
