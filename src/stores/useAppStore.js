import { create } from "zustand";

/**
 * Global application store (Zustand)
 *
 * Menyimpan state aplikasi yang dipakai di banyak komponen,
 * termasuk authentication, UI modal states, filter state, dan actions terkait.
 *
 * Perubahan kecil:
 * - Menambahkan kontrol start/stop untuk periodic session checker agar interval
 *   tidak bocor jika `initializeAuth` dipanggil berulang kali.
 */
const useAppStore = create((set, get) => ({
	// Global API Error State
	apiError: null,
	setApiError: (err) => set({ apiError: err }),
	// Authentication State
	isAuthenticated: false,
	userRole: null,
	userData: null,
	authChecked: false,

	// Navigation State
	currentPage:
		typeof window !== "undefined"
			? window.location.pathname.slice(1) || "home"
			: "home",

	// UI State
	showAuthModal: false,
	showPayment: false,
	showBookingModal: false,
	showCourseSelection: false,
	showPackageSelection: false,
	showPostLoginLoading: false,
	showHelpMenu: false,
	showFlowModal: false,
	showTestimoniModal: false,

	// Course & Booking State
	selectedCourse: null,
	selectedMentor: null,
	selectedPackage: null,
	bookingCourse: null,
	currentBooking: null,
	searchQuery: "",

	// Filter State
	courseFilters: {
		priceRange: [0, 100000],
		mentorRating: 0,
		availability: "",
		mode: "",
	},

	// Testimoni State
	testimoniSession: null,
	isSubmittingTestimoni: false,

	// Interval ID untuk periodic session check (jika dijalankan)
	sessionCheckerIntervalId: null,

	// Actions - Authentication
	setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
	setUserRole: (role) => set({ userRole: role }),
	setUserData: (data) => set({ userData: data }),
	setAuthChecked: (checked) => set({ authChecked: checked }),

	// Actions - Navigation
	setCurrentPage: (page) => set({ currentPage: page }),

	// Actions - UI Modals
	setShowAuthModal: (show) => set({ showAuthModal: show }),
	setShowPayment: (show) => set({ showPayment: show }),
	setShowBookingModal: (show) => set({ showBookingModal: show }),
	setShowCourseSelection: (show) => set({ showCourseSelection: show }),
	setShowPackageSelection: (show) => set({ showPackageSelection: show }),
	setShowPostLoginLoading: (show) => set({ showPostLoginLoading: show }),
	setShowHelpMenu: (show) => set({ showHelpMenu: show }),
	setShowFlowModal: (show) => set({ showFlowModal: show }),
	setShowTestimoniModal: (show) => set({ showTestimoniModal: show }),

	// Actions - Course & Booking
	setSelectedCourse: (course) => set({ selectedCourse: course }),
	setSelectedMentor: (mentor) => set({ selectedMentor: mentor }),
	setSelectedPackage: (packageData) => set({ selectedPackage: packageData }),
	setBookingCourse: (course) => set({ bookingCourse: course }),
	setCurrentBooking: (booking) => set({ currentBooking: booking }),
	setSearchQuery: (query) => set({ searchQuery: query }),

	// Actions - Course Filters
	setCourseFilters: (filters) => set({ courseFilters: filters }),
	updateCourseFilter: (key, value) =>
		set((state) => ({
			courseFilters: { ...state.courseFilters, [key]: value },
		})),
	resetCourseFilters: () =>
		set({
			courseFilters: {
				priceRange: [0, 100000],
				mentorRating: 0,
				availability: "",
				mode: "",
			},
			searchQuery: "",
		}),

	// Course Filtering Logic
	applyFilters: (courses, searchQuery, filters) => {
		return courses.filter((course) => {
			// Filter berdasarkan search query
			if (searchQuery?.trim()) {
				const query = searchQuery.toLowerCase();
				const courseName = course.courseName?.toLowerCase() || "";
				const courseDescription = course.courseDescription?.toLowerCase() || "";
				if (!courseName.includes(query) && !courseDescription.includes(query)) {
					return false;
				}
			}

			// Filter berdasarkan mode pembelajaran
			if (filters.mode) {
				const schedules = course.jadwal_kursus || [];
				const hasMode = schedules.some(
					(schedule) =>
						schedule.gayaMengajar?.toLowerCase() === filters.mode.toLowerCase()
				);
				if (!hasMode) return false;
			}

			// Filter berdasarkan ketersediaan jadwal
			if (filters.availability) {
				const now = new Date();
				const today = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate()
				);
				const schedules = course.jadwal_kursus || [];

				const hasAvailability = schedules.some((schedule) => {
					if (!schedule.tanggal) return false;
					const scheduleDate = new Date(schedule.tanggal);

					if (filters.availability === "today") {
						return scheduleDate.toDateString() === today.toDateString();
					} else if (filters.availability === "week") {
						const weekFromNow = new Date(today);
						weekFromNow.setDate(today.getDate() + 7);
						return scheduleDate >= today && scheduleDate <= weekFromNow;
					}
					return false;
				});
				if (!hasAvailability) return false;
			}

			// Filter berdasarkan rentang harga
			if (filters.priceRange && filters.priceRange[1] < 100000) {
				let coursePrice = 0;

				// Cek packages terlebih dahulu
				if (course.packages && course.packages.length > 0) {
					const packagePrices = course.packages.map((pkg) => {
						let finalPrice = 0;

						// Jika package memiliki items, hitung total dari items
						if (pkg.items && pkg.items.length > 0) {
							const itemsTotal = pkg.items.reduce((total, item) => {
								const itemPrice = item.harga || item.price || 0;
								const itemDiscount = item.diskon || item.discount || 0;
								const discountedPrice =
									itemPrice - (itemPrice * itemDiscount) / 100;
								return total + discountedPrice;
							}, 0);

							// Apply package-level discount jika ada
							const packageDiscount = pkg.diskon || pkg.discount || 0;
							finalPrice = itemsTotal - (itemsTotal * packageDiscount) / 100;
						}
						// Jika tidak ada items, gunakan harga package langsung
						else {
							const basePrice =
								pkg.totalPrice || pkg.harga_dasar || pkg.price || 0;
							const packageDiscount = pkg.diskon || pkg.discount || 0;
							finalPrice = basePrice - (basePrice * packageDiscount) / 100;
						}

						return finalPrice;
					});

					coursePrice = Math.min(...packagePrices);
				}
				// Jika tidak ada package, cek biaya mentor
				else if (course.mentor && course.mentor.biayaPerSesi) {
					coursePrice = course.mentor.biayaPerSesi;
				}

				if (coursePrice > filters.priceRange[1]) return false;
			}

			// Filter berdasarkan rating mentor
			if (filters.mentorRating > 0) {
				const mentorRating = course.mentor?.rating || 0;
				if (mentorRating < filters.mentorRating) return false;
			}

			return true;
		});
	},

	// Actions - Testimoni
	setTestimoniSession: (session) => set({ testimoniSession: session }),
	setIsSubmittingTestimoni: (loading) =>
		set({ isSubmittingTestimoni: loading }),
	openTestimoniModal: (session) =>
		set({
			testimoniSession: session,
			showTestimoniModal: true,
		}),
	closeTestimoniModal: () =>
		set({
			testimoniSession: null,
			showTestimoniModal: false,
			isSubmittingTestimoni: false, // Reset loading saat close
		}),

	// Session checker control: start/stop periodic validity check
	startSessionChecker: () => {
		// Jika sudah jalan, jangan buat interval baru
		if (get().sessionCheckerIntervalId) return;
		const id = setInterval(() => {
			get().checkSessionValid();
		}, 5 * 60 * 1000); // 5 menit
		set({ sessionCheckerIntervalId: id });
	},

	stopSessionChecker: () => {
		const id = get().sessionCheckerIntervalId;
		if (id) {
			clearInterval(id);
			set({ sessionCheckerIntervalId: null });
		}
	},

	// Session Management
	checkSessionValid: () => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		// Kalau tidak ada token atau user, auto logout
		if (!token || !storedUser) {
			get().handleLogout();
			return false;
		}

		return true;
	},

	// Composite Actions
	handleAuthSuccess: (role, user) => {
		set({
			isAuthenticated: true,
			userRole: role,
			userData: user,
			showAuthModal: false,
			showPostLoginLoading: true,
		});

		// Auto hide loading after 1 second
		setTimeout(() => {
			set({ showPostLoginLoading: false });
		}, 1000);
	},

	handleLogout: () => {
		// Pastikan hentikan session checker saat logout
		get().stopSessionChecker();

		set({
			isAuthenticated: false,
			userRole: null,
			userData: null,
			currentPage: "home",
			selectedCourse: null,
			selectedMentor: null,
			bookingCourse: null,
			currentBooking: null,
			showAuthModal: false,
			showPayment: false,
			showBookingModal: false,
			showCourseSelection: false,
			showTestimoniModal: false,
			testimoniSession: null,
			searchQuery: "",
			courseFilters: {
				priceRange: [0, 100000],
				mentorRating: 0,
				availability: "",
				mode: "",
			},
		});
	},

	updateUserData: (updatedData) => {
		set({
			userData: updatedData,
			userRole: updatedData.peran?.toLowerCase(),
		});
		localStorage.setItem("user", JSON.stringify(updatedData));
	},

	// Initialize auth from localStorage
	initializeAuth: () => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (token && storedUser) {
			try {
				const user = JSON.parse(storedUser);
				const roleFromBackend = user.peran?.toLowerCase();

				if (roleFromBackend) {
					set({
						isAuthenticated: true,
						userRole: roleFromBackend,
						userData: user,
					});

					// Mulai periodic session check (jika belum berjalan)
					get().startSessionChecker();
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
				}
			} catch (error) {
				console.error("Error parsing stored user:", error);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		}

		set({ authChecked: true });
	},
}));

export default useAppStore;
