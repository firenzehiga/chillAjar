import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAppStore from "@/stores/useAppStore";
import {
	getPublicCourses,
	getCourses,
	getCourseById,
	createCourse,
	updateCourse,
	deleteCourse,
	getMentors,
	getPackages,
	getMentorCourses,
	createMentorCourse,
	updateMentorCourse,
	setMentorSchedule,
	setSchedule,
} from "@/services/courseService";

// ========== COURSE ADMIN ===============
/**
 * Ambil semua data kursus (khusus admin).
 *
 * @returns {UseQueryResult<Array>} List kursus
 * @auth Required (Bearer Token)
 * @features Auto-refetch setiap 1 menit, cache 5 menit
 */
export const useCoursesQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["adminCourses"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getCourses();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		onError: (err) => {
			console.error("Error fetching courses:", err);
		},
	});
};

/**
 * Ambil detail kursus berdasarkan ID (admin/mentor/pelanggan).
 *
 * @param {string|number} courseId - ID kursus
 * @returns {UseQueryResult<Object>} Data detail kursus
 * @auth Required (Bearer Token)
 */
export const useCourseByIdQuery = (courseId) => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["course", courseId],
		queryFn: async () => {
			if (!isAuthenticated || !courseId) return null;
			const response = await getCourseById(courseId);
			return response;
		},
		enabled: !!courseId && isAuthenticated,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Buat kursus baru (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["adminCourses", "mentorCourses"]
 */
export const useCreateCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCourse,
		onSuccess: () => {
			queryClient.invalidateQueries(["adminCourses"]);
			queryClient.invalidateQueries(["mentorCourses"]);
		},
	});
};

/**
 * Update kursus (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.courseId - ID kursus
 * @param {Object} variables.payload - Data kursus baru
 * @invalidates ["adminCourses", "mentorCourses"]
 */
export const useUpdateCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ courseId, payload }) => updateCourse(courseId, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries(["formCoursePackages"]);
			queryClient.invalidateQueries(["adminCourses"]);
			queryClient.invalidateQueries(["mentorCourses"]);
		},
	});
};

/**
 * Hapus kursus (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorCourses"]
 * @optimisticUpdate Cache ["adminCourses"] langsung difilter
 */
export const useDeleteCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCourse,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["adminCourses"], (oldData) =>
				oldData.filter((course) => course.id !== id)
			);
			queryClient.invalidateQueries(["mentorCourses"]);
		},
	});
};

/**
 * Ambil daftar mentor.
 *
 * @returns {UseQueryResult<Array>} List mentor
 * @auth Required (Bearer Token)
 */
export const useMentorsQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["formCourseMentors"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getMentors();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
	});
};

/**
 * Ambil daftar paket kursus.
 *
 * @returns {UseQueryResult<Array>} List paket
 * @auth Required (Bearer Token)
 */
export const usePackagesQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["formCoursePackages"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getPackages();
			return response;
		},
		enabled: isAuthenticated,
		// staleTime: 1 * 60 * 1000,
		// cacheTime: 5 * 60 * 1000,
		// retry: 1,
	});
};

// ========== COURSE MENTOR ==============
/**
 * Ambil daftar kursus yang dimiliki mentor.
 *
 * @returns {UseQueryResult<Array>} List kursus mentor
 * @auth Required (Bearer Token)
 * @features Auto-refetch setiap 1 menit
 */
export const useMentorCoursesQuery = () => {
	const { isAuthenticated } = useAppStore();

	return useQuery({
		queryKey: ["mentorCourses"],
		queryFn: async () => {
			if (!isAuthenticated) return [];
			const response = await getMentorCourses();
			return response;
		},
		enabled: isAuthenticated,
		staleTime: 1 * 60 * 1000,
		cacheTime: 5 * 60 * 1000,
		retry: 1,
		refetchOnWindowFocus: true,
		onError: (err) => {
			console.error("Error fetching courses:", err);
		},
	});
};

/**
 * Buat kursus baru (mentor).
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorCourses", "adminCourses"]
 */
export const useCreateMentorCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createMentorCourse,
		onSuccess: () => {
			queryClient.invalidateQueries(["mentorCourses"]);
			queryClient.invalidateQueries(["adminCourses"]);
		},
	});
};

/**
 * Update kursus (mentor).
 *
 * @param {Object} variables - Parameter update
 * @param {string|number} variables.courseId - ID kursus
 * @param {Object} variables.payload - Data kursus baru
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorCourses", "adminCourses"]
 */
export const useUpdateMentorCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ courseId, payload }) =>
			updateMentorCourse(courseId, payload),
		onSuccess: (data, { courseId }) => {
			queryClient.invalidateQueries(["mentorCourses"]);
			queryClient.invalidateQueries(["adminCourses"]);
			queryClient.invalidateQueries(["courses"]);
		},
	});
};

/**
 * Hapus kursus mentor.
 *
 * @returns {UseMutationResult} Mutation hook
 * @invalidates ["mentorCourses"]
 * @optimisticUpdate Cache ["mentorCourses"] langsung difilter
 */
export const useDeleteMentorCourseMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCourse,
		onSuccess: (_, id) => {
			queryClient.setQueryData(["mentorCourses"], (oldData) =>
				oldData.filter((course) => course.id !== id)
			);
			queryClient.invalidateQueries(["mentorCourses"]);
		},
	});
};

/**
 * Set jadwal mentor (misal jam ketersediaan).
 *
 * @returns {UseMutationResult} Mutation hook
 */
export const useSetMentorScheduleMutation = () => {
	return useMutation({
		mutationFn: setMentorSchedule,
	});
};

/**
 * Set jadwal global (admin).
 *
 * @returns {UseMutationResult} Mutation hook
 */
export const useSetScheduleMutation = () => {
	return useMutation({
		mutationFn: setSchedule,
	});
};

// ========== PELANGGAN COURSE ==============
/**
 * Ambil kursus untuk halaman about/public.
 *
 * @returns {UseQueryResult<Array>} Daftar kursus
 */
export const usePublicCoursesQuery = (options = {}) => {
	return useQuery({
		queryKey: ["courses"],
		queryFn: async () => {
			const response = await getPublicCourses();
			return response;
		},
		// staleTime: 60 * 1000, // 30 detik (sangat pendek)
		// cacheTime: 2 * 60 * 1000, // 2 menit cache
		// refetchOnWindowFocus: true, // Refetch saat focus (safety)
		// refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit
		// retry: 1,
		onError: (err) => {
			console.error("Error fetching public Courses:", err);
		},
		...options, // Spread opsi tambahan
	});
};
