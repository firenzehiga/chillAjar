import React from "react";
import { Users, BookOpen, Clock, DollarSign } from "lucide-react";

export function AdminDashboard() {
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
				<p className="text-gray-600">Overview of your platform's resources</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Users className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">1,234</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total Users</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<BookOpen className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">45</span>
					</div>
					<h3 className="text-gray-600 font-medium">Active Courses</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<Clock className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">12</span>
					</div>
					<h3 className="text-gray-600 font-medium">Pending Approvals</h3>
				</div>
				<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
					<div className="flex items-center justify-between mb-4">
						<DollarSign className="h-8 w-8 text-blue-600" />
						<span className="text-2xl font-bold text-gray-900">$15,678</span>
					</div>
					<h3 className="text-gray-600 font-medium">Total Revenue</h3>
				</div>
			</div>
		</div>
	);
}
