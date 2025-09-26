import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAppStore from "@/stores/useAppStore";
import {
	getPayments,
	verifyPayment,
	rejectPayment,
} from "@/services/paymentsService";

// Hook untuk mengambil data pembayaran
export const usePaymentsQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["adminPayments"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getPayments();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000, // 1 menit - cukup fresh tapi tidak terlalu sering fetch ulang
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // Fetch ulang tiap 1 menit untuk update real-time
		retry: 1,
		onError: () => {
			// Penanganan error dapat diimplementasikan di sini jika diperlukan
		},
	});
};

// Hook untuk verifikasi pembayaran
export const useVerifyPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: verifyPayment,
		onSuccess: () => {
			// Invalidasi dan fetch ulang data
			queryClient.invalidateQueries(["adminPayments"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};

// Hook untuk penolakan pembayaran
export const useRejectPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rejectPayment,
		onSuccess: () => {
			// Invalidasi dan fetch ulang data
			queryClient.invalidateQueries(["adminPayments"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};
