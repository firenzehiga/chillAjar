import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Clock, Monitor, MapPin, BookOpen } from "lucide-react";

export function BookingModal({
	mentor,
	selectedCourse,
	onClose,
	onSubmit,
	schedules,
	location,
}) {
	const [selectedMode, setSelectedMode] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(location || "");
	const [topic, setTopic] = useState("");

	const handleSubmit = () => {
		if (selectedDate && selectedTime && selectedMode) {
			onSubmit(
				selectedDate,
				selectedTime,
				selectedMode,
				selectedCourse,
				topic,
				selectedLocation
			);
			onClose();
		}
	};

	// Pastikan selectedCourse ada
	const filteredSchedules = (schedules || []).filter(
		(s) => s.kursus_id === selectedCourse?.id
	);

	// Untuk menampilkan tanggal yang tersedia
	const availableDates =
		filteredSchedules.length > 0
			? [...new Set(filteredSchedules.map((s) => s.tanggal))].map(
					(date) => new Date(date)
			  )
			: [];

	// Untuk menampilkan waktu yang tersedia
	const availableTimes =
		selectedDate && filteredSchedules.length > 0
			? filteredSchedules
					.filter(
						(schedule) =>
							schedule.tanggal === selectedDate.toISOString().split("T")[0]
					)
					.map((schedule) => schedule.waktu)
			: [];

	const isOnline = selectedCourse?.learnMethod === "Online Learning";
	const isOffline = selectedCourse?.learnMethod === "Offline Learning";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
				{/* Header Modal */}
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Book a Session with {mentor.mentorName}
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Konten Modal (Scrollable) */}
				<div className="flex-1 overflow-y-auto p-6">
					{/* Informasi Kursus yang Dipilih */}
					{selectedCourse && (
						<div className="mb-6 p-4 bg-blue-50 rounded-lg">
							<div className="flex items-center">
								<BookOpen className="w-5 h-5 text-blue-600 mr-2" />
								<h3 className="font-medium text-blue-900">
									{selectedCourse.courseName}
								</h3>
							</div>
							<p className="text-sm text-blue-700">
								Rp{selectedCourse.price_per_hour}/sesi
							</p>
						</div>
					)}

					{/* Input Topik yang Ingin Dibahas */}
					<div className="mb-6">
						<label
							htmlFor="topic"
							className="block text-sm font-medium text-gray-700 mb-1">
							Topic to Discuss (Optional)
						</label>
						<textarea
							id="topic"
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							placeholder="Enter the topic you want to discuss in this session..."
							className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows="3"
						/>
					</div>

					{/* Pilihan Mode Belajar */}
					<div className="mb-6">
						<h3 className="font-medium mb-2">Select Learning Mode:</h3>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => {
									setSelectedMode("online");
									setSelectedDate(null);
									setSelectedTime(null);
									setSelectedLocation(null);
								}}
								disabled={!isOnline}
								className={`flex items-center justify-center p-3 rounded-lg border ${
									selectedMode === "online"
										? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
										: isOnline
										? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
										: "bg-gray-100 text-gray-400 cursor-not-allowed"
								}`}>
								<Monitor className="w-5 h-5 mr-2" />
								Online
							</button>
							<button
								type="button"
								onClick={() => {
									setSelectedMode("offline");
									setSelectedDate(null);
									setSelectedTime(null);
									setSelectedLocation("");
								}}
								disabled={!isOffline}
								className={`flex items-center justify-center p-3 rounded-lg border ${
									selectedMode === "offline"
										? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
										: isOffline
										? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
										: "bg-gray-100 text-gray-400 cursor-not-allowed"
								}`}>
								<MapPin className="w-5 h-5 mr-2" />
								Offline
							</button>
						</div>
					</div>

					{/* Pilihan Lokasi (Jika Offline) */}
					{selectedMode === "offline" && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Select Location:</h3>
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => setSelectedLocation(mentor.location)}
									className={`w-1/2 p-3 rounded-lg border text-left ${
										selectedLocation === mentor.location
											? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
											: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
									}`}>
									<div className="flex items-center">
										<MapPin className="w-4 h-4 mr-2" />
										{mentor.location}
									</div>
								</button>
							</div>
						</div>
					)}

					{/* Pilihan Tanggal */}
					{selectedMode && (selectedMode === "online" || selectedLocation) && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Select Date:</h3>
							{availableDates.length === 0 ? (
								<div className="text-red-500 text-sm p-2 bg-red-50 rounded">
									Belum ada jadwal tersedia untuk kursus ini.
								</div>
							) : (
								<div className="grid grid-cols-3 gap-2">
									{availableDates.map((date) => (
										<button
											type="button"
											key={date.toISOString()}
											onClick={() => setSelectedDate(date)}
											className={`p-2 rounded ${
												selectedDate?.toDateString() === date.toDateString()
													? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
													: "bg-gray-100 hover:bg-gray-200"
											}`}>
											{format(date, "MMM d")}
										</button>
									))}
								</div>
							)}
						</div>
					)}
					{/* Pilihan Waktu */}
					{selectedDate && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Select Time:</h3>
							<div className="grid grid-cols-3 gap-2">
								{availableTimes.map((time) => (
									<button
										type="button"
										key={time}
										onClick={() => setSelectedTime(time)}
										className={`flex items-center justify-center p-2 rounded ${
											selectedTime === time
												? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
												: "bg-gray-100 hover:bg-gray-200"
										}`}>
										<Clock className="w-4 h-4 mr-1" />
										{time.slice(0, 5)} WIB
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Footer Modal */}
				<div className="p-6 border-t bg-gray-50">
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none">
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={
								!selectedDate ||
								!selectedTime ||
								!selectedMode ||
								(selectedMode === "offline" && !selectedLocation)
							}
							className={`px-4 py-2 rounded-lg transition-colors ${
								selectedDate &&
								selectedTime &&
								selectedMode &&
								(selectedMode === "online" || selectedLocation)
									? "bg-black text-white hover:bg-yellow-600"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}>
							Confirm Booking
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
