import { create } from "zustand";

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
	currentPage: "home",

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

	// Testimoni State
	testimoniSession: null,

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

	// Actions - Testimoni
	setTestimoniSession: (session) => set({ testimoniSession: session }),
	openTestimoniModal: (session) =>
		set({
			testimoniSession: session,
			showTestimoniModal: true,
		}),
	closeTestimoniModal: () =>
		set({
			testimoniSession: null,
			showTestimoniModal: false,
		}),

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

					// Setup periodic session check (setiap 5 menit)
					setInterval(() => {
						get().checkSessionValid();
					}, 5 * 60 * 1000); // 5 menit
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
