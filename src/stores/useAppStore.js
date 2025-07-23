import { create } from "zustand";

const useAppStore = create((set, get) => ({
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
	showPostLoginLoading: false,
	showHelpMenu: false,
	showFlowModal: false,

	// Course & Booking State
	selectedCourse: null,
	selectedMentor: null,
	bookingCourse: null,
	currentBooking: null,
	searchQuery: "",

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
	setShowPostLoginLoading: (show) => set({ showPostLoginLoading: show }),
	setShowHelpMenu: (show) => set({ showHelpMenu: show }),
	setShowFlowModal: (show) => set({ showFlowModal: show }),

	// Actions - Course & Booking
	setSelectedCourse: (course) => set({ selectedCourse: course }),
	setSelectedMentor: (mentor) => set({ selectedMentor: mentor }),
	setBookingCourse: (course) => set({ bookingCourse: course }),
	setCurrentBooking: (booking) => set({ currentBooking: booking }),
	setSearchQuery: (query) => set({ searchQuery: query }),

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
