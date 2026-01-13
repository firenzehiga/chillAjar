/**
 * Application Helper Functions
 * Berisi utility functions yang digunakan di berbagai bagian aplikasi
 */

// ============================================
// SHARED HELPERS (Dipakai di 2+ tempat)
// ============================================

/**
 * Calculate session end time (start time + 1 hour)
 * 📍 Dipakai di: SessionHistory, SessionDetail, TransactionHistory
 * @param {string} startTime - Time in HH:MM format
 * @returns {string} End time in HH:MM format or "-"
 */
export const getSessionEndTime = (startTime) => {
    if (!startTime) return "-";

    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = (hours + 1) % 24;

    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Get session status styling classes
 * 📍 Dipakai di: SessionHistory, SessionDetail, SessionWidget
 * @param {string} status - Session status (pending, started, end, reviewed)
 * @returns {string} Tailwind CSS classes for styling
 */
export const getSessionStatusStyle = (status) => {
    switch (status) {
        case "pending":
            return "bg-gray-200 text-gray-700";
        case "started":
            return "bg-blue-100 text-blue-800";
        case "end":
            return "bg-orange-100 text-orange-800";
        case "reviewed":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

/**
 * Get human-readable session status text
 * 📍 Dipakai di: SessionHistory, SessionDetail, SessionWidget
 * @param {string} status - Session status
 * @returns {string} Human-readable status text in Indonesian
 */
export const getSessionStatusText = (status) => {
    switch (status) {
        case "pending":
            return "Belum Dimulai";
        case "started":
            return "Sedang Berlangsung";
        case "end":
            return "Selesai";
        case "reviewed":
            return "Reviewed";
        default:
            return status || "Unknown";
    }
};

/**
 * Get transaction/payment status styling classes
 * 📍 Dipakai di: TransactionHistory, TransactionReminder
 * @param {string} status - Transaction status
 * @returns {string} Tailwind CSS classes for styling
 */
export const getTransactionStatusStyle = (status) => {
    switch (status) {
        case "waiting_verification":
            return "bg-blue-100 text-blue-800";
        case "accepted":
            return "bg-green-100 text-green-800";
        case "rejected":
            return "bg-red-100 text-red-800";
        case "pending_payment":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

/**
 * Get human-readable transaction/payment status text
 * 📍 Dipakai di: TransactionHistory, TransactionReminder
 * @param {string} status - Transaction status
 * @returns {string} Human-readable status text in Indonesian
 */
export const getTransactionStatusText = (status) => {
    switch (status) {
        case "waiting_verification":
            return "Menunggu Verifikasi";
        case "accepted":
            return "Disetujui";
        case "rejected":
            return "Ditolak";
        case "pending_payment":
            return "Menunggu Pembayaran";
        default:
            return status || "Unknown";
    }
};

/**
 * Format currency to Indonesian Rupiah
 * 📍 Dipakai di: TransactionHistory, SessionDetail, dan berbagai komponen lainnya
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Rp 0";
    return `Rp ${amount.toLocaleString("id-ID")}`;
};

/**
 * Calculate discount amount
 * 📍 Dipakai di: SessionDetail, TransactionHistory
 * @param {number} price - Original price
 * @param {number} discountPercentage - Discount percentage
 * @returns {number} Discount amount
 */
export const calculateDiscount = (price, discountPercentage) => {
    if (!price || !discountPercentage) return 0;
    return (price * discountPercentage) / 100;
};

// ============================================
// FORMATTING HELPERS
// ============================================

/**
 * Format session ID to look like a receipt number
 * 📍 Dipakai di: SessionDetail (specific)
 * @param {number} id - Session ID
 * @returns {string} Formatted session ID (e.g., "CHILL-000123")
 */
export const formatSessionId = (id) => {
    const paddedId = String(id).padStart(6, "0");
    return `CHILL-${paddedId}`;
};

/**
 * Generate invoice number from transaction ID and created date
 * 📍 Dipakai di: Invoice (specific)
 * @param {number} transactionId - Transaction ID
 * @param {string} createdAt - Created date (ISO format)
 * @returns {string} Formatted invoice number (e.g., "INV-2026-00148")
 */
export const generateInvoiceNumber = (transactionId, createdAt) => {
    if (!transactionId || !createdAt) return "INV-0000-00000";

    const year = new Date(createdAt).getFullYear();
    const paddedId = String(transactionId).padStart(5, "0");

    return `INV-${year}-${paddedId}`;
};
