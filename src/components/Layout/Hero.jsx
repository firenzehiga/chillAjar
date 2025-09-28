import { Star, Zap, Coffee } from "lucide-react";
export default function Hero({ onNavigate }) {
	return (
		<section className="relative left-1/2 right-1/2 bg-gradient-to-b w-full from-chill-yellow to-gray-50  -translate-x-1/2 transform py-10 overflow-hidden">
			{/* Yang ini tetap batasi isi agar tidak melebar */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-5 relative">
					<div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-2  animate-fadeInUp">
						<Star className="w-4 h-4 mr-2" />
						Menuju Platform Pembelajaran Terdepan
					</div>{" "}
					<div
						className="flex items-center justify-center mb-2"
						style={{ height: 100 }}>
						{Array.from({ length: 5 }).map((_, i) => {
							const count = 5;
							const center = Math.floor(count / 2); // index tengah
							// besar untuk yang tengah, kecil untuk sisanya
							const sizeClass =
								i === center
									? "w-24 h-24 md:w-28 md:h-28"
									: "w-12 h-12 md:w-16 md:h-16";

							// overlap dan z-index: tengah paling depan
							const overlap = -18;
							const marginLeft = i === 0 ? 0 : overlap;
							const zIndex = i === center ? 50 : 10 + i;

							// sedikit penekanan (angkat) untuk yang tengah
							const transformStyle = i === center ? "translateY(-6px)" : "none";

							// --- Ganti di sini untuk gambar berbeda ---
							// Masukkan array link gambar Anda di bawah:
							const heroImages = [
								"https://cdn.devdojo.com/tails/avatars/024.jpg",
								"https://cdn.devdojo.com/tails/avatars/032.jpg",
								"https://cdn.devdojo.com/tails/avatars/105.jpg",
								"https://cdn.devdojo.com/tails/avatars/011.jpg",
								"https://cdn.devdojo.com/tails/avatars/099.jpg",
							];
							// Gunakan link sesuai index; fallback ke picsum jika kosong
							const avatarUrl =
								heroImages[i % heroImages.length] ||
								`https://picsum.photos/seed/hero-${i + 1}/200/200`;

							return (
								<img
									key={i}
									src={avatarUrl}
									alt={`avatar-${i}`}
									className={`rounded-full border-4 border-white ${sizeClass} object-cover`}
									style={{
										marginLeft,
										zIndex,
										boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
										transform: transformStyle,
									}}
								/>
							);
						})}
					</div>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
						Empowering{" "}
						<span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
							Students
						</span>{" "}
						<span className="px-2 py-1 relative inline-block">
							<svg
								className="absolute -bottom-4 left-0 w-full text-yellow-300"
								viewBox="0 0 410 18"
								xmlns="http://www.w3.org/2000/svg"
								preserveAspectRatio="none"
								style={{ height: 22 }}>
								<path
									d="M6 6.4c16.8 16.8 380.8-11.2 397.6 5.602"
									strokeWidth="12"
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"></path>
							</svg>
							Through{" "}
							<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
								Peer Learning
							</span>
						</span>
					</h1>
					<p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
						ChillAjar menghubungkan mahasiswa dengan mentor ahli untuk
						menciptakan pengalaman belajar yang bermakna dan transformatif.
					</p>
					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp ">
						<a
							href="mentors"
							className="focus:outline-none outline-none relative group text-white transition-all transform will-change-transform flex items-center justify-center whitespace-nowrap rounded-xl hover:rotate-[3deg] duration-300 shadow-lg hover:shadow-xl h-14 text-md pl-[5rem] pr-6 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-400/30 hover:shadow-yellow-400/30 active:translate-y-1 active:scale-95 active:duration-150"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("mentors");
							}}>
							<div className="absolute left-0 top-0 mt-1 ml-1 bg-white text-white p-[0.35rem] bottom-1 group-hover:w-[calc(100%-0.5rem)] group-active:translate-y-1 group-active:scale-95 transition-all rounded-lg duration-300 h-12 w-12 overflow-hidden">
								<img
									src="/logo.png"
									alt="icon"
									className="h-full w-full object-contain"
								/>
							</div>
							<span className="font-medium">Mulai Belajar</span>
						</a>
						<a
							href="about"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("about");
							}}
							className="border-2 border-gray-300 text-gray-700 px-8 py-3
                                                                                        rounded-xl font-semibold hover:border-yellow-400
                                                                                        hover:text-yellow-600 transition-all duration-300 flex
                                                                                        items-center justify-center gap-2">
							<Coffee className="w-5 h-5" />
							Pelajari Lebih Lanjut
						</a>
					</div>
				</div>
			</div>

			{/* fade overlay: memudar dari transparan ke kuning yang sama dengan background bawah */}
			{/* <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-gray-50"></div> */}
		</section>
	);
}
