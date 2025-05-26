import React from "react";
import { X, BookOpen } from "lucide-react";

// Komponen Modal untuk Memilih Kursus
export function CourseSelectionModal({
	courses,
	onSelect,
	onConfirm,
	onClose,
	selectedCourse,
}) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md">
				{/* Header Modal */}
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Select a Course</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Daftar Kursus */}
				<div className="p-6 max-h-[60vh] overflow-y-auto">
					<div className="space-y-4">
						{courses.length === 0 ? (
							<div className="text-center text-gray-500 py-8">
								Mentor ini belum menetapkan kursus.
								<br /> Silahkan memilih kursus lain.
							</div>
						) : (
							courses.map((course) => (
								<button
									type="button"
									key={course.id}
									onClick={() => onSelect(course)}
									className={`w-full p-4 rounded-lg border transition-all outline-none focus:outline-none ${
										selectedCourse?.id === course.id
											? "border-yellow-500 bg-yellow-50"
											: "border-gray-200 hover:border-yellow-300 hover:bg-gray-50"
									}`}>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<BookOpen className="w-4 h-4 text-yellow-600 mr-2" />
											<span className="font-medium">{course.courseName}</span>
										</div>
										<span className="text-sm text-gray-600">
											Rp{course.price_per_hour}/sesi
										</span>
									</div>
									<p className="text-sm text-gray-500 mt-1 text-left">
										{course.courseDescription}
									</p>
								</button>
							))
						)}
					</div>
				</div>
				{/* Footer Modal */}
				<div className="p-6 border-t bg-gray-50">
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
							Cancel
						</button>
						<button
							type="button"
							onClick={onConfirm}
							className={`px-4 py-2 rounded-lg font-medium ${
								selectedCourse
									? "bg-black text-white hover:bg-yellow-600"
									: "bg-gray-200 text-gray-500 cursor-not-allowed"
							}`}
							disabled={!selectedCourse}>
							Confirm Selection
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
