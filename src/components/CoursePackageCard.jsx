import React, { useState, useEffect } from "react";
import { Gift, Clock, Star, ArrowRight, Check } from "lucide-react";
import useAppStore from "../stores/useAppStore";
export function CoursePackageCard({
	packageData,
	onSelect,
	isSelected = false,
}) {
	const {
		id,
		name,
		description,
		totalPrice,
		packageDiscount,
		items = [],
		tanggal_mulai,
		tanggal_berakhir,
	} = packageData;

	// Ambil data mentor yang dipilih menggunakan useAppStore agar tidak props drilling dari app > package selection modal > course package card
	const selectedMentor = useAppStore((state) => state.selectedMentor);

	const [timeRemaining, setTimeRemaining] = useState(null);

	// Biaya default mentor
	const mentorFee =
		selectedMentor?.biayaPerSesi || selectedMentor?.mentorBiayaPerSesi || 0;

	// Hitung harga paket berdasarkan harga aktual items (setelah diskon item diterapkan)
	const actualPackagePrice = items.reduce(
		(sum, item) =>
			sum + Math.max((item.harga || item.price || 0) - (item.diskon || 0), 0),
		0
	);

	// Harga paket final setelah diskon paket
	const finalPackagePrice = Math.max(
		actualPackagePrice - (packageDiscount || 0),
		0
	);

	// Total harga Jual (paket + sesi mentor)
	const totalFinalPrice = finalPackagePrice + mentorFee;

	// Cek status promo
	const getPromoStatus = () => {
		// Jika tidak ada tanggal mulai dan berakhir, anggap sebagai paket normal
		if (!tanggal_mulai && !tanggal_berakhir) {
			return {
				status: "normal",
				label: "Paket Normal",
				color: "bg-gray-100 text-gray-600",
			};
		}

		// Jika hanya ada tanggal mulai tapi tidak ada tanggal berakhir (paket default)
		if (tanggal_mulai && !tanggal_berakhir) {
			const now = new Date();
			const startDate = new Date(tanggal_mulai);

			if (now >= startDate) {
				return {
					status: "normal",
					label: "Paket Normal",
					color: "bg-gray-100 text-gray-600",
				};
			} else {
				return {
					status: "upcoming",
					label: "Akan Datang",
					color: "bg-blue-100 text-blue-600",
				};
			}
		}

		// Jika ada kedua tanggal (paket promo)
		if (tanggal_mulai && tanggal_berakhir) {
			const now = new Date();
			const startDate = new Date(tanggal_mulai);
			const endDate = new Date(tanggal_berakhir);

			if (now < startDate) {
				return {
					status: "upcoming",
					label: "Akan Datang",
					color: "bg-blue-100 text-blue-600",
				};
			} else if (now >= startDate && now <= endDate) {
				return {
					status: "active",
					label: "Promo Aktif",
					color: "bg-green-100 text-green-600",
				};
			} else {
				return {
					status: "expired",
					label: "Promo Berakhir",
					color: "bg-red-100 text-red-600",
				};
			}
		}

		// fallback - kalo ada kondisi aneh
		return {
			status: "normal",
			label: "Paket Normal",
			color: "bg-gray-100 text-gray-600",
		};
	};

	const promoStatus = getPromoStatus();

	// Fungsi untuk menghitung waktu tersisa
	const calculateTimeRemaining = () => {
		if (!tanggal_berakhir) return null;

		const now = new Date();
		const endDate = new Date(tanggal_berakhir);

		// Jika sudah berakhir, return null
		if (now >= endDate) return null;

		const timeDiff = endDate.getTime() - now.getTime();

		if (timeDiff <= 0) return null;

		const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

		return {
			days,
			hours,
			minutes,
			seconds,
		};
	};

	// Update countdown setiap detik
	useEffect(() => {
		if (!tanggal_berakhir) return;

		const updateCountdown = () => {
			setTimeRemaining(calculateTimeRemaining());
		};

		// Update immediately
		updateCountdown();

		// Set interval untuk update setiap detik
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [tanggal_berakhir]);

	// Format countdown display - simplified and inline-sized badge
	const formatCountdown = (time) => {
		if (!time) return null;

		const { days, hours, minutes, seconds } = time;

		let displayText = "";
		if (days > 0) {
			displayText = `${days} hari ${hours}j ${minutes}m ${seconds}s`;
		} else if (hours > 0) {
			displayText = `${hours} jam ${minutes}m ${seconds}s`;
		} else if (minutes > 0) {
			displayText = `${minutes}m ${seconds}s`;
		} else {
			displayText = `${seconds}s`;
		}

		return (
			<div className="mt-2">
				<span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
					<Clock className="w-3 h-3 mr-1 text-red-600" />
					Berakhir Pada: {displayText}
				</span>
			</div>
		);
	};

	return (
		<div
			onClick={() => onSelect(packageData)}
			className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
				isSelected
					? "border-blue-500 ring-2 ring-blue-200"
					: "border-gray-200 hover:border-blue-300"
			} overflow-hidden group flex flex-col h-full`}>
			{/* Header dengan nama paket - Mobile-friendly */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 text-white flex-shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center min-w-0 flex-1">
						<Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 flex-shrink-0" />
						<h3 className="text-sm sm:text-lg font-bold truncate">{name}</h3>
					</div>
					{isSelected && (
						<div className="bg-white bg-opacity-20 rounded-full p-1 flex-shrink-0 ml-2">
							<Check className="w-3 h-3 sm:w-4 sm:h-4" />
						</div>
					)}
				</div>

				{/* Status badge
				{promoStatus && (
					<div className="mt-1">
						<span
							className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${promoStatus.color} bg-white bg-opacity-90`}>
							<Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
							{promoStatus.label}
						</span>
					</div>
				)} */}

				{/* Countdown timer promo habis*/}
				{timeRemaining && formatCountdown(timeRemaining)}
			</div>

			{/* Content - Mobile-optimized with flex-grow */}
			<div className="p-3 sm:p-4 flex flex-col flex-grow">
				{/* Deskripsi - Limit to 2 lines */}
				<p
					className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 leading-relaxed overflow-hidden flex-shrink-0"
					style={{
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
					}}>
					{description || "Unknown description"}
				</p>

				{/* Items yang termasuk - Takes remaining space */}
				<div className="mb-2 sm:mb-3 flex-grow">
					<h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm">
						<Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
						Yang Anda Dapatkan:
					</h4>
					<div className="space-y-0.5 sm:space-y-1">
						{items.length > 0 ? (
							items.slice(0, 3).map((item, index) => (
								<div
									key={index}
									className="flex items-center text-xs text-gray-600">
									<div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
									<span className="truncate">{item.name}</span>
								</div>
							))
						) : (
							<div className="flex items-center text-xs text-gray-600">
								<div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
								<span>Akses pembelajaran dengan mentor</span>
							</div>
						)}
						{items.length > 3 && (
							<div className="text-xs text-gray-500 ml-2.5 sm:ml-3">
								+{items.length - 3} item lainnya
							</div>
						)}
					</div>
				</div>

				<div className="border-t pt-2 sm:pt-3 flex-shrink-0 mt-auto">
					<div className="space-y-2">
						{/* Pricing - Simplified tanpa breakdown mentor fee */}
						<div className="text-xs text-gray-600 space-y-1">
							{/* Hanya tampilkan harga paket final */}
							{packageDiscount > 0 && (
								<div className="flex justify-between">
									<span>Harga Normal:</span>
									<div className="line-through text-gray-400">
										Rp{" "}
										{(actualPackagePrice + mentorFee).toLocaleString("id-ID")}
									</div>
								</div>
							)}

							{/* Total Price - yang sudah include mentor */}
							<div className="flex justify-between items-center">
								<span className="font-medium text-gray-800">Harga Paket:</span>
								<div className="text-right">
									<div className="text-base sm:text-lg font-bold text-gray-800">
										Rp {totalFinalPrice.toLocaleString("id-ID")}
									</div>
									{packageDiscount > 0 && (
										<div className="text-xs text-green-600 font-medium">
											Hemat Rp {packageDiscount.toLocaleString("id-ID")}
										</div>
									)}
								</div>
							</div>

							{/* Keterangan include mentor */}
							<div className="text-xs text-gray-500 italic">
								*Sudah termasuk biaya mentoring
							</div>
						</div>

						{/* Arrow indicator */}
						{/* <div className="flex justify-end">
							<div className="text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
								<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
							</div>
						</div> */}
					</div>
				</div>
			</div>

			{/* Overlay untuk selected state */}
			{isSelected && (
				<div className="absolute inset-0 bg-chill-blue bg-opacity-10 pointer-events-none"></div>
			)}
		</div>
	);
}

export default CoursePackageCard;
