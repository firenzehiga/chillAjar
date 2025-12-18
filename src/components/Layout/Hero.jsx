import { Star, Zap, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import GradientText from "../ui/GradientText";
export function Hero({ onNavigate }) {
	return (
		<section className="relative left-1/2 right-1/2 bg-gradient-to-b w-full from-chill-blue to-gray-50  -translate-x-1/2 transform py-10 overflow-hidden">
			{/* Yang ini tetap batasi isi agar tidak melebar */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-5 relative">
					<div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2  animate-fadeInUp">
						<Star className="w-4 h-4 mr-2" />
						Menuju Platform Pembelajaran Terdepan
					</div>{" "}
					<div
						className="flex items-center justify-center mb-2"
						style={{ height: 100 }}>
						{Array.from({ length: 5 }).map((_, i) => {
							const count = 5;
							const center = Math.floor(count / 2); // index tengah
							const rightAfterCenter = Math.floor(count / 2) + 1; // index setelah tengah
							const leftBeforeCenter = Math.floor(count / 2) - 1; // index sebelum tengah
							const rightMost = count - 1; // index paling kanan
							// besar untuk yang tengah, kecil untuk sisanya
							const sizeClass =
								i === center
									? "w-24 h-24 md:w-28 md:h-28"
									: i === rightAfterCenter
									? "w-20 h-20 md:w-22 md:h-22"
									: i === leftBeforeCenter
									? "w-20 h-20 md:w-22 md:h-22"
									: "w-12 h-12 md:w-16 md:h-16";

							// overlap dan z-index: tengah paling depan
							const overlap = -15;
							const marginLeft = i === 0 ? 0 : overlap;
							const zIndex =
								i === center
									? 50
									: i === leftBeforeCenter
									? 50
									: i === rightMost
									? -50
									: 10 + i;

							// sedikit penekanan (angkat) untuk yang tengah
							const transformStyle = i === center ? "translateY(-6px)" : "none";

							// --- Ganti di sini untuk gambar berbeda ---
							// Masukkan array link gambar Anda di bawah:
							const heroImages = [
								"/hero/1.jpg",
								"/hero/2.jpg",
								"/hero/3.jpg",
								"/hero/4.jpg",
								"/hero/5.jpg",
							];
							// Gunakan link sesuai index; fallback ke picsum jika kosong
							const avatarUrl = heroImages[i % heroImages.length];

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
						<GradientText
							colors={["#6366f1", "#6366f1", "#a855f7", "#f472b6", "#6366f1"]}
							animationSpeed={8}
							showBorder={false}
							className="text-transparent bg-clip-text mt-3 inline-block">
							Students
						</GradientText>
						<span className="px-2 py-1 relative inline-block">
							<svg
								className="absolute -bottom-4 left-0 w-full text-blue-300"
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
							<GradientText
								colors={["#3b82f6", "#3b82f6", "#8b5cf6", "#8b5cf6", "#3b82f6"]}
								animationSpeed={8}
								showBorder={false}
								className="text-transparent bg-clip-text mt-3 inline-block">
								Peer Learning
							</GradientText>
						</span>
					</h1>
					<p className="max-w-3xl mx-auto text-lg md:text-lg font-semibold text-gray-600">
						ChillAjar menghubungkan mahasiswa dengan mentor ahli untuk
						menciptakan pengalaman belajar yang bermakna dan transformatif.
					</p>
					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp ">
						<a
							href="mentors"
							className="focus:outline-none outline-none relative group text-white transition-all transform will-change-transform flex items-center justify-center whitespace-nowrap rounded-xl hover:rotate-[3deg] duration-300 shadow-lg hover:shadow-xl h-14 text-md pl-[5rem] pr-6 bg-gradient-to-r from-blue-500 to-chill-blue-dark shadow-blue-400/30 hover:shadow-blue-400/30 active:translate-y-1 active:scale-95 active:duration-150"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("mentors");
							}}>
							<div className="absolute left-0 top-0 mt-1 ml-1 bg-white text-white p-[0.35rem] bottom-1 group-hover:w-[calc(100%-0.5rem)] group-active:translate-y-1 group-active:scale-95 transition-all rounded-lg duration-300 h-12 w-12 overflow-hidden">
								<img
									src="/hero.png"
									alt="icon"
									className="h-full w-full object-contain"
								/>
							</div>
							<Zap className="w-5 h-5 mr-2" />
							<span className="font-medium">Mulai Belajar</span>
						</a>
						<a
							href="about"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("about");
							}}
							className="border-2 border-gray-300 text-gray-700 px-8 py-3
                                                                                        rounded-xl font-semibold hover:border-blue-400
                                                                                        hover:text-blue-600 transition-all duration-300 flex
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

export function HeroRandom({ onNavigate }) {
	// State untuk menyimpan gambar avatar random
	const [randomAvatars, setRandomAvatars] = useState([]);

	// Fungsi untuk generate random avatar URL
	const generateRandomAvatar = () => {
		const randomNum = Math.floor(Math.random() * 110) + 1;
		const paddedNum = randomNum.toString().padStart(3, "0");
		return `https://cdn.devdojo.com/tails/avatars/${paddedNum}.jpg`;
	};

	// Fungsi untuk generate array avatar random
	const generateRandomAvatars = () => {
		const avatars = [];
		for (let i = 0; i < 5; i++) {
			avatars.push(generateRandomAvatar());
		}
		setRandomAvatars(avatars);
	};

	// Effect untuk generate avatar pertama kali dan set interval
	useEffect(() => {
		// Generate avatar pertama kali
		generateRandomAvatars();

		// Set interval untuk refresh setiap 10 detik (bisa diubah sesuai kebutuhan)
		const interval = setInterval(() => {
			generateRandomAvatars();
		}, 10000); // 10000ms = 10 detik

		// Cleanup interval saat component unmount
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="relative left-1/2 right-1/2 bg-gradient-to-b w-full from-chill-blue to-gray-50  -translate-x-1/2 transform py-10 overflow-hidden">
			{/* Yang ini tetap batasi isi agar tidak melebar */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-5 relative">
					<div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2  animate-fadeInUp">
						<Star className="w-4 h-4 mr-2" />
						Menuju Platform Pembelajaran Terdepan
					</div>

					{/* Tombol refresh avatar (opsional - bisa dihapus jika tidak diperlukan) */}
					{/* <div className="flex justify-center mb-2">
						<button
							onClick={generateRandomAvatars}
							className="px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm">
							🔄 Refresh Avatar
						</button>
					</div> */}
					<div
						className="flex items-center justify-center mb-2"
						style={{ height: 100 }}>
						{Array.from({ length: 5 }).map((_, i) => {
							const count = 5;
							const center = Math.floor(count / 2); // index tengah
							const rightAfterCenter = Math.floor(count / 2) + 1; // index setelah tengah
							const leftBeforeCenter = Math.floor(count / 2) - 1; // index sebelum tengah
							const rightMost = count - 1; // index paling kanan
							// besar untuk yang tengah, kecil untuk sisanya
							const sizeClass =
								i === center
									? "w-24 h-24 md:w-28 md:h-28"
									: i === rightAfterCenter
									? "w-20 h-20 md:w-22 md:h-22"
									: i === leftBeforeCenter
									? "w-20 h-20 md:w-22 md:h-22"
									: "w-12 h-12 md:w-16 md:h-16";

							// overlap dan z-index: tengah paling depan
							const overlap = -15;
							const marginLeft = i === 0 ? 0 : overlap;
							const zIndex =
								i === center
									? 50
									: i === leftBeforeCenter
									? 50
									: i === rightMost
									? -50
									: 10 + i;

							// sedikit penekanan (angkat) untuk yang tengah
							const transformStyle = i === center ? "translateY(-6px)" : "none";

							// Gunakan avatar random atau fallback
							const avatarUrl = randomAvatars[i] || generateRandomAvatar();

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
						<GradientText
							colors={["#6366f1", "#6366f1", "#a855f7", "#f472b6", "#6366f1"]}
							animationSpeed={6}
							showBorder={false}
							className="text-transparent bg-clip-text mt-3 inline-block">
							Students
						</GradientText>
						<span className="px-2 py-1 relative inline-block">
							<svg
								className="absolute -bottom-4 left-0 w-full text-blue-300"
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
							<GradientText
								colors={["#3b82f6", "#3b82f6", "#8b5cf6", "#8b5cf6", "#3b82f6"]}
								animationSpeed={6}
								showBorder={false}
								className="text-transparent bg-clip-text mt-3 inline-block">
								Peer Learning
							</GradientText>
						</span>
					</h1>
					<p className="max-w-3xl mx-auto text-lg md:text-lg font-semibold text-gray-600">
						ChillAjar menghubungkan mahasiswa dengan mentor ahli untuk
						menciptakan pengalaman belajar yang bermakna dan transformatif.
					</p>
					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp ">
						<a
							href="mentors"
							className="focus:outline-none outline-none relative group text-white transition-all transform will-change-transform flex items-center justify-center whitespace-nowrap rounded-xl hover:rotate-[3deg] duration-300 shadow-lg hover:shadow-xl h-14 text-md pl-[5rem] pr-6 bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-400/30 hover:shadow-blue-400/30 active:translate-y-1 active:scale-95 active:duration-150"
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
							<Zap className="w-5 h-5 mr-2" />
							<span className="font-medium">Mulai Belajar</span>
						</a>
						<a
							href="about"
							onClick={(e) => {
								e.preventDefault();
								onNavigate("about");
							}}
							className="border-2 border-gray-300 text-gray-700 px-8 py-3
                                                                                        rounded-xl font-semibold hover:border-blue-400
                                                                                        hover:text-blue-600 transition-all duration-300 flex
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
