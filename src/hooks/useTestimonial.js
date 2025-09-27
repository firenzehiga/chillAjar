import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAppStore from "@/stores/useAppStore";
import {
	getTestimonies,
	getTestimonieById,
	updateTestimonie,
	deleteTestimonie,
	getMentorTestimonies,
} from "@/services/testimonialService";

// ========== TESTIMONIAL ADMIN ==========

/**
 * Ambil semua testimoni (admin).
 *
 * - Hanya aktif bila user terautentikasi.
 * - Auto-refetch tiap 1 menit, cache 5 menit.
 *
 * @function useTestimoniesQuery
 * @returns {UseQueryResult<Array>} List testimoni
 * @auth Required (Bearer Token)
 */
export const useTestimoniesQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["adminTestimonies"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getTestimonies();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		onError: (err) => {
			console.error("Error fetching testimonies:", err);
		},
	});
};

/**
 * Ambil detail testimoni berdasarkan ID.
 *
 * @function useTestimonieByIdQuery
 * @param {string|number} testimonieId - ID testimoni
 * @returns {UseQueryResult<Object|null>} Data testimoni atau null
 * @auth Required (Bearer Token)
 */
export const useTestimonieByIdQuery = (testimonieId) => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["testimonie", testimonieId],
		queryFn: async () => {
			if (!isAuthenticated || !testimonieId) return null;
			const response = await getTestimonieById(testimonieId);
			return response;
		},
		enabled: !!testimonieId && isAuthenticated,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Update testimoni (admin).
 *
 * @function useUpdateTestimonieMutation
 * @returns {UseMutationResult} Mutation hook
 * @example Gunakan .mutate({ testimonieId, payload })
 */
export const useUpdateTestimonieMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ testimonieId, payload }) =>
			updateTestimonie(testimonieId, payload),
		onSuccess: () => {
			// Invalidasi cache setelah update
			queryClient.invalidateQueries(["adminTestimonies"]);
		},
	});
};

/**
 * Hapus testimoni (admin).
 *
 * - Menggunakan optimistic update pada cache "adminTestimonies".
 *
 * @function useDeleteTestimonieMutation
 * @returns {UseMutationResult} Mutation hook
 * @example Gunakan .mutate(testimonieId)
 */
export const useDeleteTestimonieMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTestimonie,
		onSuccess: (_, id) => {
			// Optimistic update: filter item dari cache
			queryClient.setQueryData(["adminTestimonies"], (oldData) =>
				oldData.filter((t) => t.id !== id)
			);
			// Pastikan juga cache mentor testimonies di-refresh
			queryClient.invalidateQueries(["mentorTestimonies"]);
		},
	});
};

// ========== TESTIMONIAL MENTOR ==========

/**
 * Ambil daftar testimoni milik mentor.
 *
 * - Digunakan pada dashboard/halaman mentor.
 *
 * @function useMentorTestimoniesQuery
 * @returns {UseQueryResult<Array>} List testimoni mentor
 */
export const useMentorTestimoniesQuery = () => {
	return useQuery({
		queryKey: ["mentorTestimonies"],
		queryFn: async () => {
			const response = await getMentorTestimonies();
			// (Opsional) mapping/normalisasi respons jika dibutuhkan
			return response;
		},
		onError: (err) => {
			console.error("Error fetching testimonies:", err);
		},
	});
};
