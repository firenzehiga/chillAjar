import { useState, useEffect } from "react";

/**
 * Custom hook untuk debounce value
 * Berguna untuk search input agar tidak trigger filter setiap karakter diketik
 * 
 * @param {any} value - Value yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default 500ms)
 * @returns {any} - Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // Hanya akan dijalankan setelah user berhenti mengetik selama 500ms
 *   fetchSearchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set timeout untuk update debounced value
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout jika value berubah sebelum delay selesai
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
