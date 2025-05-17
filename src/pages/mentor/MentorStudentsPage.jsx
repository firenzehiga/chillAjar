import React from "react";
import { Users } from "lucide-react";

export function MentorStudentsPage() {
	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 flex items-center">
					<Users className="w-6 h-6 mr-2 text-blue-600" />
					My Students
				</h1>
				<p className="text-gray-600">Manage your students</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-6">My Students</h2>
				{/* Add student list component here */}
				<p className="text-gray-500">Student list will be displayed here.</p>
			</div>
		</div>
	);
}
