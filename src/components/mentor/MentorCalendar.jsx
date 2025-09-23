import { useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	User,
	BookOpen,
	MapPin,
	Calendar,
} from "lucide-react";
import { formatDateDay, formatTime } from "@/utils/dateFormatter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
dayjs.extend(relativeTime);
dayjs.locale("id");
const MentorCalendar = ({ calendarData, loading }) => {
	const [currentDate, setCurrentDate] = useState(new Date());

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<div className="animate-pulse">
					<div className="flex items-center justify-between mb-6">
						<div className="w-32 h-6 bg-gray-200 rounded"></div>
						<div className="flex space-x-2">
							<div className="w-8 h-8 bg-gray-200 rounded"></div>
							<div className="w-8 h-8 bg-gray-200 rounded"></div>
						</div>
					</div>
					<div className="grid grid-cols-7 gap-2 mb-4">
						{[...Array(7)].map((_, i) => (
							<div key={i} className="w-10 h-6 bg-gray-200 rounded"></div>
						))}
					</div>
					<div className="grid grid-cols-7 gap-2">
						{[...Array(35)].map((_, i) => (
							<div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Transform calendar data untuk jadwal yang sudah dibooking (hanya status pending)
	// Backend sudah memfilter hanya sesi dengan status pending dan transaksi accepted
	const sessions =
		calendarData?.map((info) => ({
			id: info.id,
			date: info.tanggal,
			time: info.waktu,
			course: info.kursus?.namaKursus || "Kursus",
			student: info.siswaNama || "Siswa",
			status: info.status,
			gayaMengajar: info.gayaMengajar,
			keterangan: info.keterangan,
			tempat: info.tempat,
		})) || [];

	const monthNames = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];

	const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(day);
		}

		return days;
	};

	const getSessionsForDate = (day) => {
		if (!day) return [];

		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
			day
		).padStart(2, "0")}`;

		return sessions.filter((session) => session.date === dateString);
	};

	const navigateMonth = (direction) => {
		const newDate = new Date(currentDate);
		newDate.setMonth(currentDate.getMonth() + direction);
		setCurrentDate(newDate);
	};

	const isToday = (day) => {
		if (!day) return false;
		const today = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		return (
			today.getDate() === day &&
			today.getMonth() === month &&
			today.getFullYear() === year
		);
	};

	const getStatusColor = (status) => {
		// Karena backend hanya mengirim status "pending", semua akan berwarna kuning
		return "bg-yellow-100 text-yellow-800 border-yellow-200";
	};

	const getStatusText = (status) => {
		// Karena backend hanya mengirim status "pending"
		return "Menunggu Jadwal";
	};

	const days = getDaysInMonth(currentDate);

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold text-gray-900">Kalender Jadwal</h2>
				<div className="flex items-center space-x-4">
					<button
						onClick={() => navigateMonth(-1)}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<ChevronLeft className="w-4 h-4" />
					</button>

					<h3 className="text-lg font-medium text-gray-900 min-w-[180px] text-center">
						{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
					</h3>

					<button
						onClick={() => navigateMonth(1)}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-1 mb-4">
				{/* Day headers */}
				{dayNames.map((day) => (
					<div
						key={day}
						className="p-2 text-center text-sm font-medium text-gray-500">
						{day}
					</div>
				))}

				{/* Calendar days */}
				{days.map((day, index) => {
					const sessions = getSessionsForDate(day);
					const hasSession = sessions.length > 0;

					return (
						<div
							key={index}
							className={`
                min-h-[80px] p-1 border border-gray-100 rounded-lg
                ${day ? "bg-white hover:bg-gray-50" : "bg-gray-25"}
                ${isToday(day) ? "ring-2 ring-blue-500 bg-blue-50" : ""}
                transition-colors cursor-pointer
              `}>
							{day && (
								<>
									<div
										className={`
                    text-sm font-medium text-center mb-1
                    ${isToday(day) ? "text-blue-600" : "text-gray-900"}
                  `}>
										{day}
									</div>

									{hasSession && (
										<div className="space-y-1">
											{sessions.slice(0, 2).map((session) => (
												<div
													key={session.id}
													className={`
                            text-xs p-1 rounded border
                            ${getStatusColor(session.status)}
                            truncate
                          `}
													title={`${session.time} - ${session.student} (${session.course})`}>
													{formatTime(session.time, true)}
												</div>
											))}
											{sessions.length > 2 && (
												<div className="text-xs text-gray-500 text-center">
													+{sessions.length - 2} lagi
												</div>
											)}
										</div>
									)}
								</>
							)}
						</div>
					);
				})}
			</div>

			{/* Upcoming Sessions List */}
			<div className="mt-6 pt-6 border-t border-gray-100">
				<h3 className="text-md font-medium text-gray-900 mb-4">
					Sesi Mendatang
				</h3>

				{sessions.length > 0 ? (
					<div className="space-y-3">
						{sessions.map((session) => (
							<div
								key={session.id}
								className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="flex-shrink-0">
										<Clock className="w-4 h-4 text-gray-400" />
									</div>
									<div>
										<div className="text-sm font-medium text-gray-900">
											{formatDateDay(session.date)} •{" "}
											{formatTime(session.time, true)}
										</div>
										<div className="text-xs text-gray-500 flex items-center space-x-2">
											<span className="flex items-center">
												<User className="w-3 h-3 mr-1" />
												{session.student}
											</span>
											<span className="flex items-center">
												<BookOpen className="w-3 h-3 mr-1" />
												{session.course}
											</span>
											{session.gayaMengajar && (
												<span className="flex items-center">
													<MapPin className="w-3 h-3 mr-1" />
													{session.gayaMengajar}
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-2">
									<span
										className={`
                    inline-block px-2 py-1 text-xs font-medium rounded-full border
                    ${getStatusColor(session.status)}
                  `}>
										{dayjs(session.date).fromNow()}{" "}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						<Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
						<p>Belum ada sesi terjadwal</p>
					</div>
				)}
			</div>

			{/* Legend */}
			<div className="mt-4 pt-4 border-t border-gray-100">
				<div className="flex items-center justify-center space-x-6 text-xs">
					<div className="flex items-center space-x-1">
						<div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
						<span className="text-gray-600">Dikonfirmasi</span>
					</div>
					<div className="flex items-center space-x-1">
						<div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
						<span className="text-gray-600">Menunggu</span>
					</div>
					<div className="flex items-center space-x-1">
						<div className="w-3 h-3 ring-2 ring-blue-500 bg-blue-50 rounded"></div>
						<span className="text-gray-600">Hari ini</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MentorCalendar;
