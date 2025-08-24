import dayjs from "dayjs";
import "dayjs/locale/id";

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
