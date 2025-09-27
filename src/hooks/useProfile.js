import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getMentorProfile,
	getPelangganProfileInfo,
	updateProfile,
} from "@/services/profileService";

/**
 * ROLE: MENTOR
 *
 * Hook React Query untuk mengambil profil mentor yang sedang login.
 *
 * - Hanya berjalan jika ada token di localStorage (autentikasi).
 * - Mengembalikan data profil mentor.
 *
 * @function useMentorProfileQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = useMentorProfileQuery();
 */
export const useMentorProfileQuery = () => {
	return useQuery({
		queryKey: ["mentorProfile"],
		queryFn: async () => {
			const response = await getMentorProfile();
			return response;
		},
	});
};

/**
 * ROLE: PELANGGAN
 *
 * Hook React Query untuk mengambil informasi profil pelanggan (statistik / info umum).
 *
 * - Hanya berjalan jika ada token di localStorage (autentikasi).
 * - Mengembalikan data profil pelanggan.
 *
 * @function usePelangganProfileInfoQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = usePelangganProfileInfoQuery();
 */
export const usePelangganProfileInfoQuery = () => {
	return useQuery({
		queryKey: ["pelangganStatistik"],
		queryFn: async () => {
			const response = await getPelangganProfileInfo();
			return response;
		},
	});
};

/**
 * ROLE: USER
 *
 * Hook React Query untuk meng-update profil user (umum).
 *
 * - Menggunakan mutation ke endpoint update profil.
 * - Setelah sukses, meng-invalidate query profil mentor dan pelanggan agar data direfresh.
 *
 * @function useUpdateProfileMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const updateProfile = useUpdateProfileMutation();
 * updateProfile.mutate(formData);
 */
export const useUpdateProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProfile,
		onSuccess: async () => {
			// Invalidate dan refetch berbagai query profil
			await queryClient.invalidateQueries({ queryKey: ["mentorProfile"] });
			await queryClient.invalidateQueries({ queryKey: ["pelangganStatistik"] });
			// Tidak perlu invalidate user profile karena admin tidak menggunakannya
		},
	});
};
