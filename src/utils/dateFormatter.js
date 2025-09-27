import dayjs from "dayjs";
import "dayjs/locale/id";

/**
 * Util: Ambil token dari localStorage (jika diperlukan di masa depan).
 * @returns {string|null}
 */
const getToken = () => localStorage.getItem("token"); // Tidak lagi menggunakan localStorage token setelah migrasi ke Sanctum

/**
 * Util: Normalisasi input menjadi objek dayjs.
 * Menerima: Date, number (timestamp), atau string (termasuk format "YYYY-MM-DD HH:mm:ss" atau ISO).
 *
 * @param {Date|number|string} input
 * @returns {dayjs.Dayjs}
 */
const toDayjs = (input) => {
	if (input instanceof Date) return dayjs(input);
	if (typeof input === "number") return dayjs(input);
	if (typeof input === "string") {
		// Ganti spasi pertama menjadi 'T' agar dayjs mengenali 'YYYY-MM-DD HH:mm:ss'
		const isoLike = input.replace(" ", "T");
		return dayjs(isoLike);
	}
	// fallback: coba dayjs langsung
	return dayjs(input);
};

/**
 * Mengformat tanggal menjadi "Hari, D Bulan YYYY"
 *
 * Contoh: "Senin, 1 Januari 2024"
 *
 * @async
 * @function formatDateDay
 * @param {Date|number|string} tgl - Tanggal input.
 * @returns {string} Hasil format atau "-" jika tidak valid.
 */
export const formatDateDay = (tgl) => {
	if (!tgl && tgl !== 0) return "-";

	const d = toDayjs(tgl);
	if (d.isValid()) return d.locale("id").format("dddd, D MMMM YYYY");

	// Fallback ke Intl jika dayjs gagal
	try {
		const dt = new Date(tgl);
		if (!Number.isNaN(dt.getTime())) {
			return dt.toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}
	} catch (e) {
		// ignore
	}

	return "-";
};

/**
 * Mengformat tanggal menjadi "D Bulan YYYY"
 *
 * Contoh: "1 Januari 2024"
 *
 * @async
 * @function formatDate
 * @param {Date|number|string} tgl - Tanggal input.
 * @returns {string} Hasil format atau "-" jika tidak valid.
 */
export const formatDate = (tgl) => {
	if (!tgl && tgl !== 0) return "-";

	const d = toDayjs(tgl);
	return d.isValid() ? d.locale("id").format("D MMMM YYYY") : "-";
};

/**
 * Mengformat tanggal + waktu menjadi "D Bulan YYYY, HH:mm"
 *
 * Contoh: "1 Januari 2024, 07:30"
 *
 * @async
 * @function formatDateTime
 * @param {Date|number|string} tgl - Tanggal/waktu input.
 * @returns {string} Hasil format atau "-" jika tidak valid.
 */
export const formatDateTime = (tgl) => {
	if (!tgl && tgl !== 0) return "-";

	const d = toDayjs(tgl);
	return d.isValid() ? d.locale("id").format("D MMMM YYYY, HH:mm") : "-";
};

/**
 * Mengformat waktu menjadi "HH:mm" (opsional dengan suffix zona waktu).
 *
 * - withZone:
 *   - false (default) => "07:30"
 *   - true  => "07:30 WIB"
 *   - string => "07:30 <string>" (mis. 'WITA', 'WIT', 'UTC+7')
 *
 * Menerima input seperti "07:30", "07:30:00", "2024-01-01 07:30", Date, atau timestamp.
 *
 * @async
 * @function formatTime
 * @param {string|Date|number} time - Waktu input.
 * @param {boolean|string} [withZone=false] - Tanda zona waktu atau nama zona.
 * @returns {string} Hasil format atau "-" jika tidak valid.
 */
export const formatTime = (time, withZone = false) => {
	if (!time && time !== 0) return "-";

	const tStr = String(time).trim();

	let d;
	// Jika hanya jam:menit atau jam:menit:detik
	if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(tStr)) {
		// Bentukkan ke ISO tanggal sementara agar dayjs bisa parse jam
		d = dayjs(`1970-01-01T${tStr}`);
	} else {
		// Terima juga format tanggal+jam atau timestamp
		d = toDayjs(tStr);
	}

	let out;
	if (d.isValid()) {
		out = d.locale("id").format("HH:mm");
	} else {
		// Fallback manual: ambil 2 bagian pertama "HH:mm"
		const fallback = tStr.split(" ")[0].slice(0, 5);
		const [h = "00", m = "00"] = fallback.split(":");
		out = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
	}

	if (withZone) {
		const suffix = typeof withZone === "string" ? withZone : "WIB";
		return `${out} ${suffix}`;
	}
	return out;
};

/*
Contoh penggunaan (bahasa Indonesia):
- formatDateDay(tgl)        => "Senin, 1 Januari 2024"
- formatDate(tgl)           => "1 Januari 2024"
- formatDateTime(tgl)       => "1 Januari 2024, 07:30"
- formatTime('07:30')       => "07:30"
- formatTime('07:30', true) => "07:30 WIB"
- formatTime('07:30', 'WITA') => "07:30 WITA"
*/
