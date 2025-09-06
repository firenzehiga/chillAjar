import React, { useState } from "react";
import {
	Users,
	BookOpen,
	Clock,
	Award,
	Target,
	Heart,
	MapPin,
	Mail,
	Phone,
	Linkedin,
	Twitter,
	Github,
	Star,
	Calendar,
	Coffee,
	Zap,
	Lightbulb,
	Rocket,
	Shield,
	Globe,
	TrendingUp,
	Quote,
} from "lucide-react";
import teamsData from "../utils/constants/TeamData";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

export function AboutPage({ onNavigate }) {
	const [hoveredMember, setHoveredMember] = useState(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	// Menggunakan endpoint publik untuk jumlah kursus tanpa autentikasi
	const {
		data: jumlahCourse,
		isLoading: coursesLoading,
		error: coursesError,
	} = useQuery({
		queryKey: ["publicCountCourses"],
		queryFn: async () => {
			const response = await api.get("/public/kursus	", {
				headers: localStorage.getItem("token")
					? { Authorization: `Bearer ${localStorage.getItem("token")}` }
					: {}, // Header hanya ditambahkan jika token ada
			});
			return response.data.length;
		},
		staleTime: 60 * 1000, // 30 detik (sangat pendek)
		cacheTime: 2 * 60 * 1000, // 2 menit cache
		refetchOnWindowFocus: true, // Refetch saat focus (safety)
		refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit
		retry: 1,
	});

	const {
		data: jumlahMentor,
		isLoading: mentorsLoading,
		error: mentorsError,
	} = useQuery({
		queryKey: ["publicCountMentors"],
		queryFn: async () => {
			const response = await api.get("/public/mentor", {
				headers: localStorage.getItem("token")
					? { Authorization: `Bearer ${localStorage.getItem("token")}` }
					: {},
			});
			// Hanya hitung mentor dengan status 'aktif'
			return response.data.filter((mentor) => mentor.status === "active")
				.length;
		},
		staleTime: 60 * 1000, // 30 detik (sangat pendek)
		cacheTime: 2 * 60 * 1000, // 2 menit cache
		refetchOnWindowFocus: true, // Refetch saat focus (safety)
		refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit
		retry: 1,
	});

	const stats = [
		{ icon: Users, label: "Active Students", value: "20+" },
		{
			icon: BookOpen,
			label: "Available Courses",
			value: coursesLoading ? (
				<span className="inline-block w-12 h-7 rounded-xl bg-yellow-500 animate-pulse mx-auto" />
			) : coursesError ? (
				"Error"
			) : (
				jumlahCourse
			),
		},
		{
			icon: Users,
			label: "Active Mentors",
			value: mentorsLoading ? (
				<span className="inline-block w-12 h-7 rounded-xl bg-yellow-500 animate-pulse mx-auto" />
			) : mentorsError ? (
				"Error"
			) : (
				jumlahMentor
			),
		},
	];

	const values = [
		{
			icon: Target,
			title: "Excellence",
			description: "We strive for excellence in every learning interaction.",
		},
		{
			icon: Users,
			title: "Community",
			description: "Building a supportive community of learners and mentors.",
		},
		{
			icon: Heart,
			title: "Passion",
			description: "Passionate about helping students achieve their goals.",
		},
	];

	const handleMouseEnter = (member, event) => {
		setHoveredMember(member);
		updateMousePosition(event);
	};

	const handleMouseMove = (event) => {
		if (hoveredMember) updateMousePosition(event);
	};

	const updateMousePosition = (event) => {
		const rect = event.currentTarget.getBoundingClientRect();
		setMousePosition({
			x: event.clientX,
			y: event.clientY,
		});
	};

	const handleMouseLeave = () => setHoveredMember(null);

	const team = teamsData;
	const productManager = team.find(
		(member) => member.role.toLowerCase() === "product manager"
	);
	const anggotaTim = team.filter(
		(member) => member.role.toLowerCase() !== "product manager"
	);

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0 -z-10">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50"></div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
				<div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

				{/* Grid Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="grid grid-cols-12 h-full">
						{[...Array(12)].map((_, i) => (
							<div key={i} className="border-r border-gray-300"></div>
						))}
					</div>
				</div>
			</div>

			<div className="relative z-10 py-12">
				{/* Hero Section */}
				<div className="text-center mb-16 relative">
					{/* Background decoration */}
					<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
						<div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-3xl"></div>
					</div>

					<div className="relative z-20 max-w-4xl mx-auto px-4">
						<div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6 animate-fadeInUp">
							<Star className="w-4 h-4 mr-2" />
							Platform Pembelajaran Terdepan
						</div>

						<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeInUp animation-delay-200">
							Empowering{" "}
							<span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
								Students
							</span>{" "}
							Through{" "}
							<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
								Peer Learning
							</span>
						</h1>

						<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-400">
							ChillAjar menghubungkan mahasiswa dengan mentor ahli untuk
							menciptakan pengalaman belajar yang bermakna dan transformatif.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp animation-delay-600">
							<button
								onClick={() => onNavigate("courses")}
								className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
								<Zap className="w-5 h-5" />
								Mulai Belajar
							</button>
							<a
								href="#cerita-kami"
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
				{/* Stats */}
				<div className="relative mb-20">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl transform rotate-1 opacity-10"></div>
					<div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl transform -rotate-1 opacity-10"></div>

					<div className="relative bg-yellow-500 py-8 rounded-3xl shadow-2xl mx-4">
						<div className="max-w-4xl mx-auto px-1 sm:px-3 lg:px-5">
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-white mb-4">
									Platform dalam Angka
								</h2>
								<p className="text-yellow-100 text-lg">
									Pencapaian yang membanggakan
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{stats.map((stat, index) => (
									<div key={index} className="text-center group">
										<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
											<div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
												<stat.icon className="h-6 w-6 text-white" />
											</div>
											<div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
												{stat.value}
											</div>
											<div className="text-yellow-100 font-semibold text-sm">
												{stat.label}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				{/* Our Values */}
				<div className="mb-20">
					<div className="text-center mb-16">
						<div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
							<Heart className="w-4 h-4 mr-2" />
							Nilai-Nilai Kami
						</div>
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Core Values yang{" "}
							<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
								Menginspirasi
							</span>
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Prinsip-prinsip yang memandu setiap langkah kami dan membentuk
							komunitas pembelajaran yang luar biasa
						</p>
					</div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{values.map((value, index) => (
								<div key={index} className="group">
									<div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 p-8 hover:-translate-y-4 overflow-hidden border border-gray-100">
										{/* Background decorations */}
										<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-1000"></div>
										<div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-1000"></div>

										<div className="relative z-10">
											<div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 w-20 h-20 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
												<value.icon className="h-10 w-10 text-white" />
											</div>
											<h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-500">
												{value.title}
											</h3>
											<p className="text-gray-600 leading-relaxed text-lg">
												{value.description}
											</p>

											{/* Hover indicator */}
											<div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
												<div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Our Story Section */}
				<section id="cerita-kami" className="mb-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="relative">
							{/* Background decoration */}
							<div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl transform rotate-1 opacity-30"></div>
							<div className="absolute inset-0 bg-gradient-to-l from-blue-100 to-cyan-100 rounded-3xl transform -rotate-1 opacity-30"></div>

							<div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
								<div className="text-center mb-12">
									<div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
										<Lightbulb className="w-4 h-4 mr-2" />
										Cerita Kami
									</div>
									<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
										Perjalanan{" "}
										<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
											ChillAjar
										</span>
									</h2>
								</div>

								<div className="grid md:grid-cols-2 gap-12 items-center">
									<div className="space-y-6">
										<div className="flex items-start space-x-4">
											<div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
												<Quote className="w-6 h-6 text-white" />
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-900 mb-2">
													Awal Mula
												</h3>
												<p className="text-gray-600 leading-relaxed">
													ChillAjar lahir dari kebutuhan nyata mahasiswa yang
													kesulitan mencari mentor berkualitas. Kami percaya
													bahwa pembelajaran terbaik terjadi ketika ada koneksi
													personal antara mentor dan mentee.
												</p>
											</div>
										</div>

										<div className="flex items-start space-x-4">
											<div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
												<Rocket className="w-6 h-6 text-white" />
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-900 mb-2">
													Misi Kami
												</h3>
												<p className="text-gray-600 leading-relaxed">
													Menciptakan ekosistem pembelajaran yang inklusif, di
													mana setiap mahasiswa memiliki akses ke mentor terbaik
													untuk mengembangkan potensi mereka secara maksimal.
												</p>
											</div>
										</div>

										<div className="flex items-start space-x-4">
											<div className="bg-gradient-to-br from-green-400 to-cyan-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
												<Globe className="w-6 h-6 text-white" />
											</div>
											<div>
												<h3 className="text-xl font-bold text-gray-900 mb-2">
													Visi Masa Depan
												</h3>
												<p className="text-gray-600 leading-relaxed">
													Menjadi platform pembelajaran peer-to-peer terdepan di
													Indonesia yang memberdayakan generasi muda untuk
													mencapai impian mereka melalui mentoring berkualitas.
												</p>
											</div>
										</div>
									</div>

									<div className="relative">
										<div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 text-white">
											<div className="text-center">
												<div className="text-5xl font-bold mb-2">2025</div>
												<div className="text-yellow-100 mb-4">
													Tahun Berdiri
												</div>
												{/* <div className="space-y-4">
													<div className="flex items-center justify-between">
														<span>Platform Launch</span>
														<div className="w-3 h-3 bg-white rounded-full"></div>
													</div>
													<div className="flex items-center justify-between">
														<span>100+ Mahasiswa</span>
														<div className="w-3 h-3 bg-white rounded-full"></div>
													</div>
													<div className="flex items-center justify-between">
														<span>50+ Mentor Aktif</span>
														<div className="w-3 h-3 bg-white rounded-full"></div>
													</div>
													<div className="flex items-center justify-between">
														<span>1000+ Sesi Completed</span>
														<div className="w-3 h-3 bg-white rounded-full"></div>
													</div>
												</div> */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Why Choose Us Section */}
				<div className="mb-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
								<Shield className="w-4 h-4 mr-2" />
								Keunggulan Kami
							</div>
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								Mengapa{" "}
								<span className="bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
									ChillAjar?
								</span>
							</h2>
							<p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
								Berbagai keunggulan yang membuat ChillAjar menjadi pilihan
								terbaik untuk perjalanan belajar Anda
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{[
								{
									icon: Users,
									title: "Mentor Berpengalaman",
									description:
										"Mentor yang ahli di bidangnya dengan track record yang jelas",
									color: "from-blue-400 to-blue-600",
								},
								{
									icon: Clock,
									title: "Fleksibel",
									description:
										"Jadwal yang bisa disesuaikan dengan aktivitas mahasiswa",
									color: "from-green-400 to-green-600",
								},
								{
									icon: Award,
									title: "Kualitas Terjamin",
									description:
										"Sistem rating dan review untuk memastikan kualitas mentoring",
									color: "from-purple-400 to-purple-600",
								},
							].map((feature, index) => (
								<div key={index} className="group">
									<div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
										<div
											className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
											<feature.icon className="w-7 h-7 text-white" />
										</div>
										<h3 className="text-lg font-bold text-gray-900 mb-3">
											{feature.title}
										</h3>
										<p className="text-gray-600 text-sm leading-relaxed">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Testimonials Section */}
				<div className="mb-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<div className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium mb-6">
								<Star className="w-4 h-4 mr-2" />
								Testimoni
							</div>
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								Apa Kata{" "}
								<span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
									Mereka?
								</span>
							</h2>
							<p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
								Pengalaman nyata dari mahasiswa dan mentor yang telah bergabung
								dengan ChillAjar
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									name: "Sarah Angelina",
									role: "Mahasiswa Informatika",
									content:
										"ChillAjar benar-benar mengubah cara saya belajar. Mentor yang saya dapat sangat sabar dan berpengalaman. Nilai saya meningkat drastis!",
									rating: 5,
									avatar: "🧑‍🎓",
								},
								{
									name: "Ahmad Rizki",
									role: "Mentor Data Science",
									content:
										"Sebagai mentor, saya merasa senang bisa berbagi ilmu dengan adik-adik. Platform ini memudahkan proses mentoring dengan fitur yang lengkap.",
									rating: 5,
									avatar: "👨‍🏫",
								},
								{
									name: "Dinda Pratiwi",
									role: "Mahasiswa Ekonomi",
									content:
										"Sistem booking yang mudah dan mentor yang profesional. ChillAjar membantu saya memahami materi yang sulit dengan pendekatan yang menyenangkan.",
									rating: 5,
									avatar: "👩‍🎓",
								},
							].map((testimonial, index) => (
								<div key={index} className="group">
									<div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
										<div className="flex items-center mb-6">
											<div className="text-3xl mr-4">{testimonial.avatar}</div>
											<div>
												<div className="font-bold text-gray-900">
													{testimonial.name}
												</div>
												<div className="text-sm text-gray-600">
													{testimonial.role}
												</div>
											</div>
										</div>
										<p className="text-gray-600 leading-relaxed mb-6 italic">
											"{testimonial.content}"
										</p>
										<div className="flex items-center">
											{[...Array(testimonial.rating)].map((_, i) => (
												<Star
													key={i}
													className="w-5 h-5 text-yellow-400 fill-current"
												/>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* Team Section - Commented for now */}
				{/* 
			<div>
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
					Our Team
				</h2>
				...team content...
			</div>
			*/}
			</div>
		</div>
	);
}
