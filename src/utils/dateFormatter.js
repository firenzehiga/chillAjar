import dayjs from "dayjs";
import "dayjs/locale/id";

export const formatDateDay = (tgl) => {
	if (!tgl) return "-";

	let d;
	if (tgl instanceof Date) {
		d = dayjs(tgl);
	} else {
		d = dayjs(String(tgl).replace(" ", "T"));
	}

	if (d.isValid()) {
		// Contoh: "Senin, 1 Januari 2024"
		return d.locale("id").format("dddd, D MMMM YYYY");
	}

	// Fallback ke Intl.DateTimeFormat jika dayjs gagal
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
export const formatDate = (tgl) => {
	if (!tgl) return "-";
	const d = dayjs(tgl.replace(" ", "T"));
	return d.isValid() ? d.locale("id").format("D MMMM YYYY") : "-";
};

export const formatDateTime = (tgl) => {
	if (!tgl) return "-";
	const d = dayjs(tgl.replace(" ", "T"));
	return d.isValid() ? d.locale("id").format("D MMMM YYYY, HH:mm") : "-";
};

export const formatTime = (time, withZone = false) => {
	// Mengembalikan waktu dalam format lokal Indonesia (HH:mm).
	// withZone:
	//   - false (default) => "07:30"
	//   - true  => "07:30 WIB"
	//   - string => "07:30 <string>" (mis. 'WITA', 'WIT', 'UTC+7')
	if (!time) return "-";

	const tStr = String(time).trim();

	// Coba parse dengan dayjs:
	let d;
	// Jika hanya jam:menit atau jam:menit:detik
	if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(tStr)) {
		d = dayjs(`1970-01-01T${tStr}`);
	} else {
		// terima juga format yang sudah ISO-like atau ada spasi
		d = dayjs(tStr.replace(" ", "T"));
	}

	let out;
	if (d.isValid()) {
		out = d.locale("id").format("HH:mm");
	} else {
		// Fallback sederhana jika dayjs gagal
		const t = tStr.slice(0, 5);
		const [h = "0", m = "0"] = t.split(":");
		out = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
	}

	// Tentukan suffix zona waktu
	if (withZone) {
		const suffix = typeof withZone === "string" ? withZone : "WIB";
		return `${out} ${suffix}`;
	}
	return out;
};

/*
Contoh pemakaian:
- Tanpa zona:
  {formatTime(schedule.waktu)}             // => "07:30" atau "-"

- Dengan zona default (WIB):
  {formatTime(schedule.waktu, true)}       // => "07:30 WIB"

- Dengan nama zona khusus:
  {formatTime(schedule.waktu, 'WITA')}     // => "07:30 WITA"
  {formatTime(schedule.waktu, 'WIT')}      // => "07:30 WIT"
  {formatTime(schedule.waktu, 'UTC+7')}    // => "07:30 UTC+7"

Catatan: Konvensi zona waktu Indonesia:
- WIB = UTC+7
- WITA = UTC+8
- WIT = UTC+9
*/
