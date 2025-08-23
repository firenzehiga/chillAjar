import React from "react";
import { Download } from "lucide-react";
import { FaFileCsv } from "react-icons/fa";

export function ExportData({
	data = [],
	filename = "export-data",
	columns = [],
	buttonText = "Export CSV",
	className = "",
	disabled = false,
	variant = "primary", // primary, secondary, success
}) {
	const exportToCSV = () => {
		try {
			if (!data || data.length === 0) {
				alert("Tidak ada data untuk diekspor");
				return;
			}

			// Jika columns tidak didefinisikan, gunakan semua keys dari data pertama
			const csvColumns = columns.length > 0 ? columns : Object.keys(data[0]);

			// Format data sesuai dengan columns yang didefinisikan
			const csvData = data.map((row, index) => {
				const formattedRow = {};

				csvColumns.forEach((col) => {
					if (typeof col === "string") {
						formattedRow[col] = row[col] || "";
					} else if (typeof col === "object" && col.key && col.header) {
						formattedRow[col.header] = col.formatter
							? col.formatter(row)
							: row[col.key] || "";
					}
				});

				return formattedRow;
			});

			// Headers untuk CSV
			const headers = csvColumns.map((col) => {
				if (typeof col === "string") return col;
				return col.header || col.key;
			});

			// Create CSV content
			const csvContent = [
				headers.join(","),
				...csvData.map((row) =>
					Object.values(row)
						.map((val) => `"${String(val).replace(/"/g, '""')}"`)
						.join(",")
				),
			].join("\n");

			// Download file
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting CSV:", error);
			alert("Gagal mengekspor data");
		}
	};

	const getButtonClass = () => {
		const baseClass =
			"flex items-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

		switch (variant) {
			case "success":
				return `${baseClass} bg-green-600 text-white hover:bg-green-700`;
			case "secondary":
				return `${baseClass} bg-gray-600 text-white hover:bg-gray-700`;
			default:
				return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700`;
		}
	};

	return (
		<button
			onClick={exportToCSV}
			disabled={disabled || !data || data.length === 0}
			className={`${getButtonClass()} ${className}`}>
			<FaFileCsv className="w-4 h-4 mr-2" />
			{buttonText}
		</button>
	);
}

export default ExportData;
