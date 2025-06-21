// =====================[ getImageUrl.js ]=====================
// Helper untuk generate URL gambar dari base URL di .env
//
// Pakai: getImageUrl(path, fallback)
// - path: path gambar dari backend
// - fallback: gambar default jika path kosong/null

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const DEFAULT_IMAGE_BASE_URL = "https://peladen.my.id";

/**
 * Generate URL gambar dari path backend.
 * @param {string} path - Path gambar dari backend (relatif, tanpa domain).
 * @param {string} [fallback] - Fallback jika path kosong/null.
 * @returns {string} - URL gambar absolut siap pakai di <img src=...>
 */
export function getImageUrl(path, fallback) {
	const baseUrl = IMAGE_BASE_URL || DEFAULT_IMAGE_BASE_URL;
	if (!path) return fallback || "";
	// Jika path sudah absolute (http/https), langsung return
	if (/^https?:\/\//.test(path)) return path;
	// Gabungkan base URL dengan path gambar (tanpa / di depan)
	return `${baseUrl.replace(/\/$/, "")}/storage/${path.replace(/^\//, "")}`;
}
