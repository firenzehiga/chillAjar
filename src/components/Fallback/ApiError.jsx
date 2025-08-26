import React from "react";

export default function ApiError({ code, message, alias }) {
	return (
		<div className="flex flex-col items-center justify-center h-96">
			<img src="/logo.png" alt="Logo" className="w-16 mb-4" />
			<h2 className="text-xl font-bold text-red-600 mb-2">
				Terjadi Kesalahan Pada Backend
			</h2>
			<div className="text-sm text-gray-500 mb-2">
				Kode Error:{" "}
				<span className="font-mono text-red-700">{code || "Unknown"}</span>
				{alias && <span className="ml-2 text-red-700">({alias})</span>}
			</div>
			<p className="text-gray-700 mb-4">
				{message ||
					"Terjadi masalah saat menghubungi server. Silakan coba lagi atau hubungi admin."}
			</p>
			<button
				className="px-4 py-2 bg-yellow-400 rounded font-semibold"
				onClick={() => window.location.reload()}>
				Coba Lagi
			</button>
		</div>
	);
}
