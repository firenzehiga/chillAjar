export const PAGES = {
	// Public
	home: { title: "Beranda", roles: ["public"] },
	courses: { title: "Kursus", roles: ["public"] },
	mentors: { title: "Mentor", roles: ["public"] },
	about: { title: "Tentang Kami", roles: ["public"] },

	// Pelanggan
	"transaction-history": { title: "Riwayat Transaksi", roles: ["pelanggan"] },
	"session-history": { title: "Riwayat Sesi", roles: ["pelanggan"] },
	profile: { title: "Profile", roles: ["pelanggan"] },
	"edit-profile": { title: "Edit Profile", roles: ["pelanggan"] },

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
 */
export const hideNavigationPages = ["edit-profile"];

/**
 * Mengambil judul halaman berdasarkan nama halaman yang diberikan.
 *
 * @param {string} page - Nama halaman yang ingin diambil judulnya. Biasanya berisi key dari objek PAGES, seperti 'dashboard', 'profile', atau 'settings'.
 * @returns {string} Judul halaman sesuai dengan key yang diberikan, atau "Home" jika key tidak ditemukan.
 */
export const getPageTitle = (page) => PAGES[page]?.title ?? "Home";
