import { useEffect } from "react";

export const useDocumentTitle = (title, subtitle) => {
	useEffect(() => {
		const newTitle =
			title && subtitle
				? `${title} - ${subtitle}`
				: title
				? ` ChillAjar - ${title}`
				: "ChillAjar - Peer-to-Peer Tutoring Platform";
		document.title = newTitle;

		// Cleanup: reset ke default saat unmount
		return () => {
			document.title = "ChillAjar - Peer-to-Peer Tutoring Platform";
		};
	}, [title]);
};
