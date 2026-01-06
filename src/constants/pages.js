export const PAGES = {
	// Public
	home: { title: "Beranda", roles: ["public"] },
	courses: { title: "Kursus", roles: ["public"] },
	mentors: { title: "Mentor", roles: ["public"] },
	about: { title: "Tentang Kami", roles: ["public"] },

	"privacy-policy": { title: "Kebijakan Privasi", roles: ["public"] },
	"terms-conditions": { title: "Syarat & Ketentuan", roles: ["public"] },

	// Pelanggan
	"transaction-history": { title: "Riwayat Transaksi", roles: ["pelanggan"] },
	"session-history": { title: "Riwayat Sesi", roles: ["pelanggan"] },
	profile: { title: "Profile", roles: ["pelanggan"] },
	"edit-profile": { title: "Edit Profile", roles: ["pelanggan"] },
	"session-detail": { title: "Detail Transaksi", roles: ["pelanggan"] },

	// Admin
	"admin-dashboard": { title: "Admin Dashboard", roles: ["admin"] },
	"admin-manage-users": { title: "Users", roles: ["admin"] },
	"admin-manage-payments": { title: "Payments", roles: ["admin"] },
	"admin-manage-sessions": { title: "Sessions", roles: ["admin"] },
	"admin-edit-session": { title: "Edit Session", roles: ["admin"] },
	"admin-manage-courses": { title: "Courses", roles: ["admin"] },
	"admin-add-course": { title: "Add Course", roles: ["admin"] },
	"admin-edit-course": { title: "Edit Course", roles: ["admin"] },
	"admin-manage-mentors": { title: "Mentors", roles: ["admin"] },
	"admin-add-mentor": { title: "Add Mentor", roles: ["admin"] },
	"admin-edit-mentor": { title: "Edit Mentor", roles: ["admin"] },
	"admin-manage-items": { title: "Items", roles: ["admin"] },
	"admin-add-item": { title: "Tambah Item", roles: ["admin"] },
	"admin-edit-item": { title: "Edit Item", roles: ["admin"] },
	"admin-manage-packages": { title: "Paket", roles: ["admin"] },
	"admin-add-package": { title: "Tambah Paket", roles: ["admin"] },
	"admin-edit-package": { title: "Edit Paket", roles: ["admin"] },
	"admin-profile": { title: "Admin Profile", roles: ["admin"] },
	"admin-edit-profile": { title: "Admin Edit Profile", roles: ["admin"] },
	"admin-testimonial": { title: "Mentor Testimonials", roles: ["admin"] },
	"admin-edit-testimonial": {
		title: "Edit Mentor Testimonials",
		roles: ["admin"],
	},

	// Mentor
	"mentor-dashboard": { title: "Mentor Dashboard", roles: ["mentor"] },
	"mentor-manage-schedule": { title: "Schedule", roles: ["mentor"] },
	"mentor-manage-courses": { title: "My Courses", roles: ["mentor"] },
	"mentor-manage-students": { title: "Students", roles: ["mentor"] },
	"mentor-testimonial": { title: "Testimonies", roles: ["mentor"] },
	"mentor-add-course": { title: "Add Course", roles: ["mentor"] },
	"mentor-edit-course": { title: "Edit Course", roles: ["mentor"] },
	"mentor-profile": { title: "Mentor Profile", roles: ["mentor"] },
	"mentor-edit-profile": { title: "Mentor Edit Profile", roles: ["mentor"] },
};

/**
 * Mengambil daftar halaman yang dapat diakses oleh pengguna dengan peran "pelanggan".
 * Prosesnya adalah dengan memfilter key dari objek PAGES, lalu memilih yang memiliki peran "pelanggan" di properti roles.
 * Contoh hasil: ["transaction-history", "session-history", "profile", "edit-profile"]
 */
/**
 * Memfilter key dari objek PAGES untuk hanya menyertakan halaman
 * yang memiliki peran "pelanggan" di array roles.
 *
 * @param {Object} PAGES - Objek yang setiap key-nya adalah identifier halaman dan value-nya berisi properti 'roles' berupa array.
 * pageKey adalah nama-nama halaman seperti "dashboard", "profile", "settings", dll., sesuai dengan key pada objek PAGES.
 * @returns {string[]} Array key halaman yang dapat diakses oleh peran "pelanggan".
 */
export const pelangganPages = Object.keys(PAGES).filter((pageKey) =>
	PAGES[pageKey].roles?.includes("pelanggan")
);

export const publicPages = Object.keys(PAGES).filter((pageKey) =>
	PAGES[pageKey].roles?.includes("public")
);

export const adminPages = Object.keys(PAGES).filter((pageKey) =>
	PAGES[pageKey].roles?.includes("admin")
);

export const mentorPages = Object.keys(PAGES).filter((pageKey) =>
	PAGES[pageKey].roles?.includes("mentor")
);

/**
 * PAGE_ROLES berisi daftar halaman yang dapat diakses berdasarkan peran pengguna.
 * Setiap properti (admin, mentor, pelanggan, public) merupakan array halaman yang sesuai dengan peran tersebut.
 * - admin: Halaman khusus untuk admin.
 * - mentor: Halaman khusus untuk mentor.
 * - pelanggan: Halaman khusus untuk pelanggan.
 * - public: Halaman yang dapat diakses oleh semua pengguna (publik).
 */
export const PAGE_ROLES = {
	admin: [...adminPages],
	mentor: [...mentorPages],
	pelanggan: [...pelangganPages],
	public: [...publicPages],
};

/**
 * Gabungan halaman yang dilindungi
 * Mencegah user mengakses halaman langsung menggunakan URL
 */
export const protectedPages = [
	...adminPages,
	...mentorPages,
	...pelangganPages,
];

/**
 * Halaman yang menyembunyikan navigasi (manual override)
 * Tambahkan page key di sini jika ingin menyembunyikan navigasi secara eksplisit
 */
export const hideNavigationPages = [
	"edit-profile",
	"privacy-policy",
	"terms-conditions",
	"session-detail",
];

/**
 * Konfigurasi untuk menentukan apakah halaman yang tidak terdaftar
 * di PAGES harus menyembunyikan navigasi atau tidak.
 *
 * true  = halaman tidak terdaftar (404) akan menyembunyikan navigasi
 * false = halaman tidak terdaftar (404) akan tetap menampilkan navigasi
 */
const HIDE_NAVIGATION_FOR_UNREGISTERED_PAGES = true;

/**
 * Cek apakah sebuah page key terdaftar di PAGES
 * @param {string} pageKey - Key halaman yang akan dicek
 * @returns {boolean} true jika page terdaftar, false jika tidak
 */
const isPageRegistered = (pageKey) => Boolean(PAGES?.[pageKey]);

/**
 * Menentukan apakah navigasi harus disembunyikan untuk sebuah URL atau page key.
 *
 * Aturan penyembunyian navigasi:
 * 1. Jika pageKey ada di array hideNavigationPages => sembunyikan navigasi
 * 2. Jika pageKey tidak terdaftar di PAGES (halaman 404/tidak dikenal):
 *    - Jika HIDE_NAVIGATION_FOR_UNREGISTERED_PAGES = true => sembunyikan navigasi
 *    - Jika HIDE_NAVIGATION_FOR_UNREGISTERED_PAGES = false => tampilkan navigasi
 *
 * @param {string} pathOrPage - URL path (misal: '/admin/dashboard') atau page key (misal: 'admin-dashboard')
 * @returns {boolean} true = sembunyikan navigasi, false = tampilkan navigasi
 *
 * @example
 * // Halaman terdaftar dan tidak ada di hideNavigationPages
 * shouldHideNavigation('/home') // false - tampilkan navigasi
 * shouldHideNavigation('home') // false - tampilkan navigasi
 *
 * // Halaman terdaftar tapi ada di hideNavigationPages
 * shouldHideNavigation('/edit-profile') // true - sembunyikan navigasi
 *
 * // Halaman tidak terdaftar (404)
 * shouldHideNavigation('/halaman-tidak-ada') // true/false tergantung config
 *
 * // Path kosong atau invalid
 * shouldHideNavigation('') // false - tampilkan navigasi
 * shouldHideNavigation('/') // false - tampilkan navigasi (home)
 */
export const shouldHideNavigation = (pathOrPage) => {
	if (!pathOrPage) return false;

	// Ekstrak segment pertama dari URL sebagai page key
	// Contoh: '/admin/dashboard/edit' => 'admin'
	// Contoh: 'edit-profile' => 'edit-profile'
	const pageKey = pathOrPage.replace(/^\/+/, "").split("/")[0];

	// Jika tidak ada pageKey (URL root '/'), tampilkan navigasi
	if (!pageKey) return false;

	// Prioritas 1: Cek manual override di hideNavigationPages
	if (hideNavigationPages.includes(pageKey)) {
		return true; // Sembunyikan navigasi (manual override)
	}

	// Prioritas 2: Cek apakah halaman terdaftar di PAGES
	const isRegistered = isPageRegistered(pageKey);
	if (!isRegistered) {
		// Halaman tidak terdaftar - gunakan konfigurasi
		return HIDE_NAVIGATION_FOR_UNREGISTERED_PAGES;
	}

	// Halaman terdaftar dan tidak ada di hideNavigationPages
	return false; // Tampilkan navigasi
};
/**
 * Mengambil judul halaman berdasarkan nama halaman yang diberikan.
 *
 * @param {string} page - Nama halaman yang ingin diambil judulnya. Biasanya berisi key dari objek PAGES, seperti 'dashboard', 'profile', atau 'settings'.
 * @returns {string} Judul halaman sesuai dengan key yang diberikan, atau "Home" jika key tidak ditemukan.
 */
export const getPageTitle = (page) => PAGES[page]?.title ?? "Home";

// ==== FUNGSI REDIRECT JIKA AKSES HALAMAN YANG TIDAK DIIZINKAN ====
export const getRedirectPage = (currentPage, userRole) => {
	const isPelangganPage = [...pelangganPages, ...publicPages].includes(
		currentPage
	);
	const isMentorPage = mentorPages.includes(currentPage);
	const isAdminPage = adminPages.includes(currentPage);
	const isAdminOrMentor = userRole === "admin" || userRole === "mentor";

	// Jika admin/mentor mengakses halaman pelanggan
	if (isAdminOrMentor && isPelangganPage)
		return userRole === "admin" ? "admin-dashboard" : "mentor-dashboard";

	// Jika pelanggan mengakses halaman admin/mentor
	if (userRole === "pelanggan" && (isAdminPage || isMentorPage)) return "home";

	// Jika admin dan mentor saling mengakses halaman masing-masing
	if (
		(userRole === "admin" && isMentorPage) ||
		(userRole === "mentor" && isAdminPage)
	)
		return userRole === "admin" ? "admin-dashboard" : "mentor-dashboard";

	return null; // Tidak perlu redirect
};
