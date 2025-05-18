import React from "react";
import { Users, BookOpen, Clock, Award, Target, Heart } from "lucide-react";
import teamsData from "../utils/constants/TeamData";
export function AboutPage() {
	const stats = [
		{ icon: Users, label: "Active Students", value: "10,000+" },
		{ icon: BookOpen, label: "Courses", value: "50+" },
		{ icon: Clock, label: "Learning Hours", value: "100,000+" },
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

	const team = teamsData;

	return (
		<div className="py-12">
			{/* Hero Section */}
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">
					Empowering Students Through Peer Learning
				</h1>
				<p className="text-xl text-gray-600 max-w-2xl mx-auto">
					BelajarWoy connects students with expert peer mentors to create
					meaningful learning experiences.
				</p>
			</div>

			{/* Stats */}
			<div className="bg-chill-yellow  py-12 mb-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<stat.icon className="h-8 w-8 text-white mx-auto mb-2" />
								<div className="text-3xl font-bold text-white mb-1">
									{stat.value}
								</div>
								<div className="text-grey-800 font-semibold">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Our Values */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
					Our Values
				</h2>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{values.map((value, index) => (
							<div
								key={index}
								className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
							>
								<value.icon className="h-12 w-12 text-chill-yellow mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{value.title}
								</h3>
								<p className="text-gray-600">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Team Section */}
			<div>
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
					Our Team
				</h2>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{team.map((member, index) => (
							<div key={index} className="text-center">
								<img
									src={member.image}
									alt={member.name}
									className="w-32 h-32 rounded-full  mx-auto mb-4 object-cover ring-4 ring-blue-100"
								/>
								<h3 className="text-xl font-semibold text-gray-900">
									{member.name}
								</h3>
								<p className="text-gray-600">{member.role}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
