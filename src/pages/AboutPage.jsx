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
} from "lucide-react";
import teamsData from "../utils/constants/TeamData";
import { useQuery } from "@tanstack/react-query";
import api from "../api";

export function AboutPage() {
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
					: {}, // Header hanya ditambahkan jika token ada
			});
			return response.data.length;
		},
	});

	const stats = [
		{ icon: Users, label: "Pelajar Terdaftar", value: "20+" },
		{
			icon: BookOpen,
			label: "Kursus Tersedia",
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
			label: "Mentor Aktif",
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
		<div className="py-12">
			{/* Hero Section */}
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Empowering Students Through Peer Learning
				</h1>
				<p className="text-xl text-gray-600 max-w-2xl mx-auto">
					ChillAjar menghubungkan siswa dengan mentor sebaya yang ahli untuk
					menciptakan pengalaman belajar yang bermakna.{" "}
				</p>
			</div>

			{/* Stats */}
			<div className="bg-chill-yellow py-12 mb-16 rounded-2xl shadow-lg">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<stat.icon className="h-8 w-8 text-white mx-auto mb-2" />
								<div className="text-3xl font-bold text-white mb-1">
									{stat.value}
								</div>
								<div className="text-grey-800 font-semibold text-lg">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Our Values */}
			<div className="mb-20">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Our Core Values
					</h2>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						The principles that guide everything we do and shape our community
					</p>
				</div>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{values.map((value, index) => (
							<div key={index} className="group">
								<div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 hover:-translate-y-2 overflow-hidden">
									<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
									<div className="relative z-10">
										<div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
											<value.icon className="h-8 w-8 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors duration-300">
											{value.title}
										</h3>
										<p className="text-gray-600 leading-relaxed">
											{value.description}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Team Section */}
			<div>
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
					Founder
				</h2>
				<div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
					{productManager && (
						<div
							className="text-center relative group mb-8"
							onMouseEnter={(e) => handleMouseEnter(productManager, e)}
							onMouseMove={handleMouseMove}
							onMouseLeave={handleMouseLeave}>
							<div className="relative">
								<img
									src={productManager.image}
									alt={productManager.name}
									className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-yellow-300 transition-all duration-500 group-hover:ring-8 group-hover:ring-yellow-400 group-hover:scale-110 group-hover:shadow-2xl cursor-pointer"
								/>
							</div>
							<div className="flex flex-col items-center">
								<a
									href={productManager.socials?.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300 hover:underline focus:outline-none outline-none">
									{productManager.name}
								</a>
								<a
									href={productManager.socials?.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hover:underline focus:outline-none outline-none">
									{productManager.role}
								</a>
							</div>
							<div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<p className="text-sm text-yellow-600 font-medium animate-pulse">
									Hover untuk detail ✨
								</p>
							</div>
						</div>
					)}
					{anggotaTim.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{anggotaTim.map((member, index) => (
								<div
									key={index}
									className="text-center relative group"
									onMouseEnter={(e) => handleMouseEnter(member, e)}
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}>
									<div className="relative">
										<img
											src={member.image}
											alt={member.name}
											className="w-32 h-32 rounded-full mx-auto mb-4 object-cover ring-4 ring-yellow-300 transition-all duration-500 group-hover:ring-8 group-hover:ring-yellow-400 group-hover:scale-110 group-hover:shadow-2xl cursor-pointer"
										/>
									</div>
									<div className="flex flex-col items-center">
										<a
											href={member.socials?.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300 hover:underline focus:outline-none outline-none">
											{member.name}
										</a>
										<a
											href={member.socials?.github}
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hover:underline focus:outline-none outline-none">
											{member.role}
										</a>
									</div>
									<div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<p className="text-sm text-yellow-600 font-medium animate-pulse">
											Hover untuk detail ✨
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				{/* Popup Card */}
				{hoveredMember && (
					<div
						className="fixed z-50 pointer-events-none transition-all duration-300 ease-out"
						style={{
							left: `${mousePosition.x + 20}px`,
							top: `${mousePosition.y - 200}px`,
							transform: "translateY(-50%)",
						}}>
						<div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-80 animate-scaleIn relative">
							<div className="flex items-center mb-4">
								<img
									src={hoveredMember.image}
									alt={hoveredMember.name}
									className="w-16 h-16 rounded-full object-cover ring-2 ring-yellow-200"
								/>
								<div className="ml-4 flex-1">
									<h3 className="text-lg font-bold text-gray-900">
										{hoveredMember.name}
									</h3>
									<p className="text-yellow-600 font-medium">
										{hoveredMember.role}
									</p>
								</div>
							</div>
							{/* Bio/Deskripsi */}
							{hoveredMember.bio && (
								<p className="text-gray-600 text-sm mb-3 leading-relaxed">
									{hoveredMember.bio}
								</p>
							)}
							{/* Fun Facts */}
							{hoveredMember.funFacts && hoveredMember.funFacts.length > 0 && (
								<div className="mb-4">
									<h4 className="text-sm font-semibold text-gray-900 mb-2">
										Fun Facts
									</h4>
									<div className="space-y-1">
										{hoveredMember.funFacts.map((fact, idx) => (
											<div
												key={idx}
												className="text-xs text-gray-600 flex items-center">
												<Coffee className="w-3 h-3 mr-2 text-orange-500" />
												{fact}
											</div>
										))}
									</div>
								</div>
							)}
							{/* Footer Sosmed */}
							{hoveredMember.socials && (
								<div className="border-t pt-3 flex justify-center gap-3">
									{hoveredMember.socials.linkedin && (
										<a
											href={hoveredMember.socials.linkedin}
											className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
											target="_blank"
											rel="noopener noreferrer">
											<Linkedin className="w-4 h-4 text-blue-600" />
										</a>
									)}
									{hoveredMember.socials.github && (
										<a
											href={hoveredMember.socials.github}
											className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
											target="_blank"
											rel="noopener noreferrer">
											<svg
												className="w-4 h-4 text-gray-700"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path d="M12 .5c-6.62 0-12 5.38-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.304-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.872.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.218.694.825.576 4.765-1.587 8.2-6.086 8.2-11.385 0-6.62-5.38-12-12-12z" />
											</svg>
										</a>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
