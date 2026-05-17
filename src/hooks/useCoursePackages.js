import { useQuery } from "@tanstack/react-query";
import api from "@/api";

/**
 * Normalisasi data paket dari API agar konsisten dipakai di UI.
 * @param {object} pkg - Paket dari API.
 * @returns {object} Paket hasil mapping.
 */
const mapPackage = (pkg) => ({
	id: pkg.id,
	name: pkg.nama,
	description: pkg.deskripsi,
	totalPrice: pkg.harga_dasar || 0,
	packageDiscount: pkg.diskon || 0,
	items:
		pkg.items?.map((item) => ({
			id: item.id,
			name: item.nama,
			price: item.harga,
			harga: item.harga,
			diskon: item.diskon || 0,
			description: item.deskripsi,
		})) || [],
	tanggal_mulai: pkg.tanggal_mulai,
	tanggal_berakhir: pkg.tanggal_berakhir,
});

/**
 * Filter paket yang sudah dimulai dan belum kedaluwarsa.
 * @param {Array<object>} packages - Daftar paket dari API.
 * @returns {Array<object>} Paket yang aktif.
 */
const filterActivePackages = (packages) => {
	const now = new Date();

	return packages.filter((pkg) => {
		// Cek tanggal mulai - paket harus sudah dimulai
		if (pkg.tanggal_mulai) {
			const startDate = new Date(pkg.tanggal_mulai);
			if (startDate > now) return false;
		}

		// Cek tanggal berakhir - paket tidak boleh expired
		if (pkg.tanggal_berakhir) {
			const endDate = new Date(pkg.tanggal_berakhir);
			if (endDate < now) return false;
		}
		return true; // Paket aktif dan dapat dibeli
	});
};

/**
 * Hitung harga paket setelah diskon item dan diskon paket.
 * @param {object} packageData - Data paket dengan `items` dan `packageDiscount`.
 * @param {number} [mentorFee=0] - Biaya tambahan mentor.
 * @returns {{
 *   actualPackagePrice: number,
 *   finalPackagePrice: number,
 *   totalFinalPrice: number
 * }}
 */
export const computePackagePricing = (packageData, mentorFee = 0) => {
	const items = packageData?.items || [];
	const actualPackagePrice = items.reduce(
		(sum, item) =>
			sum + Math.max((item.harga || item.price || 0) - (item.diskon || 0), 0),
		0
	);
	const finalPackagePrice = Math.max(
		actualPackagePrice - (packageData?.packageDiscount || 0),
		0
	);
	const totalFinalPrice = finalPackagePrice + (mentorFee || 0);

	return {
		actualPackagePrice,
		finalPackagePrice,
		totalFinalPrice,
	};
};

/**
 * Ambil paket kursus yang visible dan aktif (berdasarkan tanggal).
 * @param {object} params
 * @param {number|string} params.courseId - ID kursus.
 * @param {boolean} [params.enabled=true] - Toggle eksekusi query.
 * @returns {import("@tanstack/react-query").UseQueryResult<Array<object>, unknown>}
 */
export const useCoursePackages = ({ courseId, enabled = true } = {}) => {
	return useQuery({
		queryKey: ["coursePackages", courseId],
		queryFn: async () => {
			if (!courseId) return [];

			const token = localStorage.getItem("token");
			const headers = token ? { Authorization: `Bearer ${token}` } : {};

			const response = await api.get(`/kursus/${courseId}`, { headers });
			const visiblePackages =
				response.data.visibilitas_paket
					?.filter((vp) => vp.visibilitas === 1)
					?.map((vp) => vp.paket)
					?.filter((pkg) => pkg) || [];

			const activePackages = filterActivePackages(visiblePackages);
			return activePackages.map(mapPackage);
		},
		enabled: Boolean(courseId) && enabled,
	});
};
