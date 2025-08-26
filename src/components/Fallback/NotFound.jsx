import React from "react";

export function NotFoundPage() {
	return (
		<div className="mt-8 mb-7 flex flex-col items-center justify-center">
			<div className="bg-white bg-opacity-80 rounded-xl px-8 py-6 shadow-lg text-center">
				<h1 className="text-4xl font-bold text-yellow-600 mb-2">404</h1>
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">
					Halaman Tidak Ditemukan
				</h2>
				<p className="text-gray-600 mb-6">
					Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
				</p>
				<a
					href="/"
					className="inline-block px-6 py-2 bg-yellow-600 text-white rounded-full font-semibold hover:bg-yellow-700 transition">
					Kembali ke Beranda
				</a>
			</div>
		</div>
	);
}
