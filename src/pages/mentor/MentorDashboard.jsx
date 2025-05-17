import React from "react";
import { Users, BookOpen, Star, Clock } from "lucide-react";

export function MentorDashboard() {
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
				<p className="text-gray-600">Overview of your teaching activities</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">24</span>
					</div>
					<h3 className="text-gray-600 font-medium">Active Students</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">156</span>
					</div>
					<h3 className="text-gray-600 font-medium">Teaching Hours</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Star className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">4.8</span>
					</div>
					<h3 className="text-gray-600 font-medium">Average Rating</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">5</span>
					</div>
					<h3 className="text-gray-600 font-medium">Courses</h3>
				</div>
			</div>

			<div className="bg-white rounded-xl shadow-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 border rounded-lg">
						<div>
							<h3 className="font-medium">Advanced Calculus</h3>
							<p className="text-sm text-gray-600">with John Doe</p>
						</div>
						<div className="text-right">
							<p className="text-sm text-gray-600">2024-03-20</p>
							<p className="text-sm text-gray-600">14:00</p>
						</div>
					</div>
					{/* Add more upcoming sessions */}
				</div>
			</div>
		</div>
	);
}
