import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getMentorProfile,
	getPelangganProfileInfo,
	updateProfile,
} from "@/services/profileService";

// ========== PROFIL MENTOR ==========
export const useMentorProfileQuery = () => {
	return useQuery({
		queryKey: ["mentorProfile"],
		queryFn: async () => {
			const response = await getMentorProfile();
			return response;
		},
	});
};

// ========== PROFIL PELANGGAN ==========
export const usePelangganProfileInfoQuery = () => {
	return useQuery({
		queryKey: ["pelangganStatistik"],
		queryFn: async () => {
			const response = await getPelangganProfileInfo();
			return response;
		},
	});
};

// ========== EDIT PROFIL ==========
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
