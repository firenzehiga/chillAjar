import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAppStore from "@/stores/useAppStore";
import {
	getPayments,
	verifyPayment,
	rejectPayment,
	deletePayment,
} from "@/services/paymentsService";

/**
 * Hook React Query untuk mengambil daftar pembayaran (admin).
 *
 * - Hanya berjalan jika user sudah terautentikasi.
 * - Data otomatis refresh setiap 1 menit.
 * - Cache bertahan 5 menit.
 *
 * @function usePaymentsQuery
 * @returns {UseQueryResult<any>} Objek hasil query dari React Query.
 *
 * @example
 * const { data, isLoading } = usePaymentsQuery();
 */
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
		staleTime: 1 * 60 * 1000, // 1 menit
		cacheTime: 5 * 60 * 1000, // 5 menit
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000, // tiap 1 menit
		retry: 1,
		onError: (err) => {
			console.error("Error fetching payments:", err);
		},
	});
};

/**
 * Hapus transaksi (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminPayments"]
 * @optimisticUpdate Cache ["adminPayments"] langsung difilter
 */
export const useDeletePaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deletePayment,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminPayments"], (oldData) =>
				oldData.filter((payment) => payment.id !== id)
			);
			queryClient.invalidateQueries(["adminPayments"]);
		},
	});
};

/**
 * Hook React Query untuk memverifikasi pembayaran (admin).z
 *
 * - Menggunakan mutation ke endpoint verifikasi pembayaran.
 * - Setelah berhasil, query "adminPayments" dan "courses" di-refresh.
 *
 * @function useVerifyPaymentMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const verifyPayment = useVerifyPaymentMutation();
 * verifyPayment.mutate(transaksiId);
 */
export const useVerifyPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: verifyPayment,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminPayments"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};

/**
 * Hook React Query untuk menolak pembayaran (admin).
 *
 * - Menggunakan mutation ke endpoint tolak pembayaran.
 * - Setelah berhasil, query "adminPayments" dan "courses" di-refresh.
 *
 * @function useRejectPaymentMutation
 * @returns {UseMutationResult<any>} Objek hasil mutation dari React Query.
 *
 * @example
 * const rejectPayment = useRejectPaymentMutation();
 * rejectPayment.mutate(transaksiId);
 */
export const useRejectPaymentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rejectPayment,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminPayments"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};
