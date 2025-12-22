import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
	X,
	Clock,
	Monitor,
	MapPin,
	BookOpen,
	AlertCircle,
	Gift,
	Star,
	Loader2,
} from "lucide-react";

export function BookingModal({
	mentor,
	selectedCourse,
	selectedPackage,
	onClose,
	onSubmit,
}) {
	const [selectedMode, setSelectedMode] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [topic, setTopic] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	// Price calculations - SINGLE DECLARATION
	const mentorFee = mentor?.biayaPerSesi || 0;
	// Perhitungan harga - SATU DEKLARASI
	const packagePrice = selectedPackage?.totalPrice || 0;
	const packageDiscount = selectedPackage?.packageDiscount || 0;

	// Hitung harga paket dari item jika tersedia untuk menghormati diskon per item
	const itemsComputedPrice = (selectedPackage?.items || []).reduce(
		(sum, item) => {
			const itemPrice = item?.price ?? item?.harga ?? 0;
			const itemDiscount = item?.diskon ?? 0;
			return sum + Math.max(itemPrice - itemDiscount, 0);
		},
		0
	);
	// Gunakan harga hasil perhitungan item jika bernilai; jika tidak, gunakan packagePrice yang tersimpan (kompatibilitas mundur)
	const basePackagePrice =
		itemsComputedPrice > 0 ? itemsComputedPrice : packagePrice;

	const finalPackagePrice = Math.max(basePackagePrice - packageDiscount, 0);
	const totalFinalPrice = finalPackagePrice + mentorFee;

	// Ambil jadwal dari selectedCourse yang sudah difilter agar hanya jadwal yang belum memiliki data sesi dan transaksi
	const filteredSchedules = (selectedCourse?.jadwal_kursus || []).filter(
		(s) => s.gayaMengajar === "online" || s.gayaMengajar === "offline"
	);

	// Buat available modes dari jadwal
	const availableModes = Array.from(
		new Set(filteredSchedules.map((s) => s.gayaMengajar))
	);

	useEffect(() => {
		if (filteredSchedules.length === 0) {
			setErrorMsg(
				"Mohon maaf, tidak ada jadwal tersedia untuk kursus ini. Silakan pilih kursus lain."
			);
		} else {
			setErrorMsg("");
		}
	}, [selectedCourse]);

	// Buat available locations untuk offline
	const availableLocations =
		selectedMode === "offline"
			? [
					...new Set(
						filteredSchedules
							.filter((s) => s.gayaMengajar === "offline")
							.map((s) => s.tempat)
							.filter(Boolean)
					),
			  ]
			: [];

	// Buat available dates dari jadwal
	// --- Perubahan: Buat daftar tanggal hanya dari jadwal dengan gayaMengajar valid dan sesuai mode & lokasi ---
	const availableDates =
		selectedMode && filteredSchedules.length > 0
			? [
					...new Set(
						filteredSchedules
							.filter(
								(s) =>
									s.gayaMengajar === selectedMode &&
									// Untuk online: ambil semua tanggal, untuk offline: filter lokasi
									(selectedMode === "online" ||
										(selectedMode === "offline" &&
											(!selectedLocation || s.tempat === selectedLocation)))
							)
							.map((s) => s.tanggal)
					),
			  ].map((date) => new Date(date))
			: [];
	// --- END Perubahan ---

	// Buat available times dari jadwal untuk selected date/mode/location
	// --- Perubahan: Buat daftar waktu hanya dari jadwal dengan gayaMengajar valid, tanggal, mode, dan lokasi ---
	const availableTimes =
		selectedDate && selectedMode && filteredSchedules.length > 0
			? filteredSchedules
					.filter(
						(s) =>
							s.gayaMengajar === selectedMode &&
							s.tanggal === selectedDate.toISOString().split("T")[0] &&
							(selectedMode === "online" ||
								(selectedMode === "offline" &&
									(!selectedLocation || s.tempat === selectedLocation)))
					)
					.map((s) => s.waktu)
			: [];
	// --- END Perubahan ---

	const handleSubmit = async () => {
		if (!selectedMode) {
			setErrorMsg("Pilih mode pembelajaran terlebih dahulu.");
			return;
		}
		if (filteredSchedules.length === 0) {
			setErrorMsg("Tidak ada jadwal dengan gayaMengajar valid.");
			return;
		}
		if (!selectedDate || !selectedTime) {
			setErrorMsg("Pilih tanggal dan waktu terlebih dahulu.");
			return;
		}
		setIsProcessing(true);

		const found = filteredSchedules.find(
			(s) =>
				s.gayaMengajar === selectedMode &&
				s.tanggal === selectedDate.toISOString().split("T")[0] &&
				s.waktu === selectedTime &&
				(selectedMode === "online" ||
					(selectedMode === "offline" &&
						(!selectedLocation || s.tempat === selectedLocation)))
		);
		if (!found) {
			setErrorMsg("Jadwal tidak ditemukan atau tidak valid.");
			setIsProcessing(false);
			return;
		}
		setErrorMsg("");

		try {
			// Tunggu proses submit selesai jika onSubmit async
			await onSubmit(
				selectedDate,
				selectedTime,
				selectedMode,
				selectedCourse,
				topic,
				selectedLocation,
				selectedPackage
			);
			onClose();
		} catch (err) {
			setErrorMsg("Gagal memproses pesanan.");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] flex flex-col">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Pesan sesi dengan {mentor.mentorName || mentor.user?.nama}
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{/* Course Information */}
					{selectedCourse && (
						<div className="mb-4 p-4 bg-blue-50 rounded-lg">
							<div className="flex items-center">
								<BookOpen className="w-5 h-5 text-blue-600 mr-2" />
								<h3 className="font-medium text-blue-900">
									{selectedCourse.courseName}
								</h3>
							</div>
							<p className="text-sm text-blue-700 mt-1">
								{selectedCourse.courseDescription ||
									"Kursus pembelajaran dengan mentor berpengalaman"}
							</p>
						</div>
					)}

					{/* Package Information */}
					{selectedPackage && (
						<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center mb-2">
										<Gift className="w-5 h-5 text-blue-600 mr-2" />
										<h3 className="font-medium text-blue-900">
											{selectedPackage.name}
										</h3>
									</div>

									<p className="text-sm text-blue-700 mb-3">
										{selectedPackage.description}
									</p>

									{/* Package Items */}
									{selectedPackage.items &&
										selectedPackage.items.length > 0 && (
											<div className="mb-3">
												<h4 className="text-xs font-medium text-blue-800 mb-2 flex items-center">
													<Star className="w-3 h-3 mr-1" />
													Yang Anda Dapatkan:
												</h4>
												<div className="space-y-1">
													{selectedPackage.items
														.slice(0, 3)
														.map((item, index) => (
															<div
																key={index}
																className="flex items-center text-xs text-blue-700">
																<div className="w-1 h-1 bg-chill-blue rounded-full mr-2 flex-shrink-0"></div>
																<span>{item.name}</span>
															</div>
														))}
													{selectedPackage.items.length > 3 && (
														<div className="text-xs text-blue-600 ml-3">
															+{selectedPackage.items.length - 3} item lainnya
														</div>
													)}
												</div>
											</div>
										)}

									{/* Package Pricing */}
									<div className="border-t border-blue-200 pt-3">
										{packageDiscount > 0 && (
											<div className="text-xs text-gray-500 line-through">
												Harga Normal: Rp{" "}
												{(basePackagePrice + mentorFee).toLocaleString("id-ID")}
											</div>
										)}
										<div className="flex items-center justify-between">
											<div>
												<span className="text-lg font-bold text-blue-900">
													Rp {totalFinalPrice.toLocaleString("id-ID")}
												</span>
												{packageDiscount > 0 && (
													<div className="text-xs text-green-600 font-medium">
														Hemat Rp {packageDiscount.toLocaleString("id-ID")}
													</div>
												)}
											</div>
											<div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
												Paket Dipilih
											</div>
										</div>

										{/* Keterangan include mentor */}
										<div className="text-xs text-gray-500 italic mt-1">
											*Sudah termasuk biaya mentoring
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{errorMsg && (
						<div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 rounded p-2">
							<AlertCircle className="w-5 h-5" />
							<span>{errorMsg}</span>
						</div>
					)}

					<div className="mb-6">
						<label
							htmlFor="topic"
							className="block text-sm font-medium text-gray-700 mb-1">
							Kamu ingin membahas apa?
						</label>
						<textarea
							id="topic"
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							placeholder="Tuliskan topik yang ingin kamu bahas bersama mentor dalam sesi ini... (Bisa nama materi, pertanyaan spesifik, atau hal lain yang ingin didiskusikan)"
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
							rows="3"
						/>
					</div>

					<div className="mb-6">
						<h3 className="font-medium mb-2">Pilih Metode Belajar:</h3>
						<div className="text-xs text-gray-500 mb-3">
							Catatan: Pilihan jadwal, tempat, tanggal, dan jam disesuaikan
							berdasarkan ketersediaan mentor.
						</div>
						<div className="grid grid-cols-2 gap-3">
							{["online", "offline"].map((mode) => (
								<button
									key={mode}
									type="button"
									onClick={() => {
										setSelectedMode(mode);
										setSelectedLocation(null);
										setSelectedDate(null);
										setSelectedTime(null);
									}}
									disabled={!availableModes.includes(mode)}
									className={`flex items-center justify-center p-3 rounded-lg border ${
										selectedMode === mode
											? "bg-chill-blue text-white border-blue-500 focus:outline-none focus:ring-3 outline-none focus:border-blue-300 transition-colors"
											: availableModes.includes(mode)
											? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											: "bg-gray-100 text-gray-400 cursor-not-allowed"
									}`}>
									{mode === "online" ? (
										<Monitor className="w-5 h-5 mr-2" />
									) : (
										<MapPin className="w-5 h-5 mr-2" />
									)}
									{mode.charAt(0).toUpperCase() + mode.slice(1)}
								</button>
							))}
						</div>
					</div>

					{selectedMode === "offline" && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Pilih Lokasi:</h3>
							<div className="space-y-2 gap-3">
								{availableLocations.length > 0 ? (
									availableLocations.map((loc, index) => (
										<button
											key={index}
											type="button"
											onClick={() => {
												setSelectedLocation(loc);
												setSelectedDate(null);
												setSelectedTime(null);
											}}
											className={`w-full p-2 rounded-lg border text-left ${
												selectedLocation === loc
													? "bg-chill-blue text-white border-blue-500 focus:outline-none transition-colors"
													: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
											}`}>
											<div className="flex items-center">
												<MapPin className="w-4 h-4 mr-2" />
												{loc}
											</div>
										</button>
									))
								) : (
									<div className="text-red-500 text-sm p-2 bg-red-50 rounded">
										{filteredSchedules.length === 0
											? "Jadwal belum tersedia untuk kursus ini."
											: "Lokasi belum ditentukan untuk jadwal ini."}
									</div>
								)}
							</div>
						</div>
					)}

					{selectedMode && (selectedMode === "online" || selectedLocation) && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Tanggal:</h3>
							{availableDates.length === 0 ? (
								<div className="text-red-500 text-sm p-2 bg-red-50 rounded">
									Belum ada jadwal tersedia untuk{" "}
									{selectedMode === "offline" ? "lokasi ini" : "mode ini"}.
								</div>
							) : (
								<div className="grid grid-cols-3 gap-2">
									{availableDates.map((date) => (
										<button
											type="button"
											key={date.toISOString()}
											onClick={() => {
												setSelectedDate(date);
												setSelectedTime(null);
											}}
											className={`p-2 rounded ${
												selectedDate?.toDateString() === date.toDateString()
													? "bg-chill-blue text-white border-blue-500 focus:outline-none transition-colors"
													: "bg-gray-100 hover:bg-gray-200"
											}`}>
											{format(date, "MMM d")}
										</button>
									))}
								</div>
							)}
						</div>
					)}

					{selectedDate && (
						<div className="mb-6">
							<h3 className="font-medium mb-2">Waktu:</h3>
							<div className="grid grid-cols-2 gap-2">
								{availableTimes.map((time) => (
									<button
										type="button"
										key={time}
										onClick={() => setSelectedTime(time)}
										className={`flex items-center justify-center p-2 rounded whitespace-nowrap ${
											selectedTime === time
												? "bg-chill-blue text-white border-blue-500 focus:outline-none transition-colors"
												: "bg-gray-100 hover:bg-gray-200"
										}`}>
										<Clock className="w-4 h-4 mr-2 shrink-0" />
										<span className="whitespace-nowrap">
											{time.slice(0, 5)} WIB
										</span>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="p-6 border-t bg-gray-50">
					{isProcessing && (
						<div className="mb-4 flex items-center justify-center p-4 bg-blue-200 border-blue-700 rounded-lg">
							<Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-3" />
							<span className="text-blue-700 font-medium">
								Memproses pesanan Anda...
							</span>
						</div>
					)}
					<div className="flex justify-end space-x-3">
						<button
							onClick={onClose}
							disabled={isProcessing}
							className={`px-4 py-2 border focus:outline-blue-400 border-gray-300 rounded-lg transition-colors ${
								isProcessing
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-gray-100"
							}`}>
							Batal
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={
								!selectedDate ||
								!selectedTime ||
								!selectedMode ||
								filteredSchedules.length === 0 ||
								isProcessing ||
								(selectedMode === "offline" && !selectedLocation)
							}
							className={`px-4 py-2 rounded-lg transition-colors ${
								selectedDate &&
								selectedTime &&
								selectedMode &&
								filteredSchedules.length > 0 &&
								(selectedMode === "online" || selectedLocation)
									? "bg-black text-white hover:bg-blue-600"
									: "bg-gray-300 text-gray-500 cursor-not-allowed"
							}`}>
							{isProcessing ? (
								<>
									<Loader2 className="animate-spin w-3 h-3 mr-2 inline" />
									Memproses...
								</>
							) : (
								"Konfirmasi Pesanan"
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
