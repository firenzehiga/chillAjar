export default function ApiError({ code, message, alias }) {
	return (
		<div className="flex flex-col items-center justify-center h-96">
			<img src="/logo.png" alt="Logo" className="w-16 mb-4" />
			<h2 className="text-xl font-bold text-red-600 mb-2">
				Terjadi Kesalahan Pada Server
			</h2>
			<div className="text-sm text-gray-500 mb-2">
				Kode Error:{" "}
				<span className="font-mono text-red-700">{code || "Unknown"}</span>
				{alias && <span className="ml-2 text-red-700">({alias})</span>}
			</div>
			<p className="text-gray-700 mb-4 bg-red-100 p-3 rounded border border-red-600 inline-block max-w-full sm:max-w-2xl break-words whitespace-normal mx-auto">
				{message ||
					"Terjadi masalah saat menghubungi server. Silakan coba lagi atau hubungi admin."}
			</p>
			<p className="text-gray-700 mb-4">
				Tips 💡: Silakan coba lagi atau hubungi admin.
			</p>
			<button
				className="focus:outline-none outline-none relative group text-slate-950 transition-all transform will-change-transform flex items-center justify-center whitespace-nowrap rounded-lg hover:rotate-[3deg] duration-300 shadow-lg hover:shadow-xl h-14 text-lg pl-[5rem] pr-6 bg-yellow-400 shadow-yellow-400/30 hover:shadow-yellow-400/30 active:translate-y-1 active:scale-95 active:duration-150"
				onClick={() => window.location.reload()}>
				<div className="absolute left-0 top-0 mt-1 ml-1 bg-white text-slate-950 p-[0.35rem] bottom-1 group-hover:w-[calc(100%-0.5rem)] group-active:translate-y-1 group-active:scale-95 transition-all rounded-md duration-300 h-12 w-12 overflow-hidden">
					<img
						src="/logo.png"
						alt="icon"
						className="h-full w-full object-contain"
					/>
				</div>
				<span className="font-semibold">Coba Lagi</span>
			</button>
		</div>
	);
}
