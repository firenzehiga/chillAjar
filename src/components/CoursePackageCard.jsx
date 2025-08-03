import React from "react";
import { Gift, Clock, Star, ArrowRight, Check } from "lucide-react";

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
		diskon,
		items = [],
		tanggal_mulai,
		tanggal_berakhir,
	} = packageData;

	// Hitung harga akhir setelah diskon
	const finalPrice = Math.max(totalPrice - (diskon || 0), 0);

	// Cek status promo
	const getPromoStatus = () => {
		if (!tanggal_mulai || !tanggal_berakhir) return null;

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
	};

	const promoStatus = getPromoStatus();

	return (
		<div
			onClick={() => onSelect(packageData)}
			className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${
				isSelected
					? "border-yellow-500 ring-2 ring-yellow-200"
					: "border-gray-200 hover:border-yellow-300"
			} overflow-hidden group`}>
			{/* Header dengan nama paket */}
			<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<Gift className="w-6 h-6 mr-2" />
						<h3 className="text-xl font-bold">{name}</h3>
					</div>
					{isSelected && (
						<div className="bg-white bg-opacity-20 rounded-full p-1">
							<Check className="w-5 h-5" />
						</div>
					)}
				</div>
				{promoStatus && (
					<div className="mt-2">
						<span
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promoStatus.color} bg-white bg-opacity-90`}>
							<Clock className="w-3 h-3 mr-1" />
							{promoStatus.label}
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-6">
				{/* Deskripsi */}
				<p className="text-gray-600 text-sm mb-4 leading-relaxed">
					{description || "Paket lengkap untuk pembelajaran yang optimal"}
				</p>

				{/* Items yang termasuk */}
				<div className="mb-4">
					<h4 className="font-semibold text-gray-800 mb-2 flex items-center">
						<Star className="w-4 h-4 mr-1 text-yellow-500" />
						Yang Anda Dapatkan:
					</h4>
					<div className="space-y-2">
						{items.length > 0 ? (
							items.slice(0, 3).map((item, index) => (
								<div
									key={index}
									className="flex items-center text-sm text-gray-600">
									<div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
									<span>{item.name}</span>
								</div>
							))
						) : (
							<div className="flex items-center text-sm text-gray-600">
								<div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
								<span>Akses pembelajaran dengan mentor</span>
							</div>
						)}
						{items.length > 3 && (
							<div className="text-xs text-gray-500 pl-4">
								+{items.length - 3} item lainnya
							</div>
						)}
					</div>
				</div>

				{/* Pricing */}
				<div className="border-t pt-4">
					<div className="flex items-end justify-between">
						<div>
							{diskon > 0 && (
								<div className="text-sm text-gray-500 line-through">
									Rp {totalPrice.toLocaleString()}
								</div>
							)}
							<div className="text-2xl font-bold text-gray-800">
								Rp {finalPrice.toLocaleString()}
							</div>
							{diskon > 0 && (
								<div className="text-xs text-green-600 font-medium">
									Hemat Rp {diskon.toLocaleString()}
								</div>
							)}
						</div>
						<div className="text-yellow-600 group-hover:translate-x-1 transition-transform duration-200">
							<ArrowRight className="w-5 h-5" />
						</div>
					</div>
				</div>

				{/* Periode promo jika ada */}
				{promoStatus && tanggal_mulai && tanggal_berakhir && (
					<div className="mt-3 pt-3 border-t border-gray-100">
						<div className="text-xs text-gray-500">
							Periode promo:{" "}
							{new Date(tanggal_mulai).toLocaleDateString("id-ID")} -{" "}
							{new Date(tanggal_berakhir).toLocaleDateString("id-ID")}
						</div>
					</div>
				)}
			</div>

			{/* Overlay untuk selected state */}
			{isSelected && (
				<div className="absolute inset-0 bg-yellow-500 bg-opacity-10 pointer-events-none"></div>
			)}
		</div>
	);
}

export default CoursePackageCard;
