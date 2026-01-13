import { useEffect, useState } from "react";
import { usePelangganSessionsQuery } from "@/hooks/useSessions";
import {
	Calendar,
	Clock,
	MapPin,
	ArrowLeft,
	User,
	BookOpen,
	CreditCard,
	Package,
	Star,
	CheckCircle,
	XCircle,
	AlertCircle,
	Monitor,
	MapPinned,
} from "lucide-react";
import { BookLoader } from "@/components/ui/BookLoader";
import { getImageUrl } from "@/utils/getImageUrl";
import useAppStore from "@/stores/useAppStore";
import { formatSessionId } from "@/utils/helpers";

export default function SessionDetailPage({ sessionId, onNavigate }) {
	const { userData } = useAppStore();
	const pelangganId = userData?.pelanggan?.id;

	const {
		data: sessions = [],
		isLoading,
		error,
	} = usePelangganSessionsQuery(pelangganId);

	// Find the specific session by ID
	const session = sessions.find((s) => s.id === parseInt(sessionId));

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
				<BookLoader message="Memuat detail sesi" />
			</div>
		);
	}

	if (error || !session) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<div className="text-center">
					<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Sesi Tidak Ditemukan
					</h2>
					<p className="text-gray-600 mb-6">
						Sesi yang Anda cari tidak tersedia atau telah dihapus.
					</p>
					<button
						onClick={() => onNavigate("session-history")}
						className="px-6 py-3 bg-chill-blue text-white rounded-xl focus:outline-none outline-none hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-xl">
						Kembali ke Riwayat Sesi
					</button>
				</div>
			</div>
		);
	}

	// Extract session data
	const jadwal = session.jadwal_kursus || session.jadwalKursus;
	const kursus = session.kursus;
	const mentor = session.mentor;
	const transaksi = session.transaksi;
	const paket = session.paket;
	const testimoni = session.testimoni;

	const getStatusConfig = (status) => {
		switch (status) {
			case "pending":
				return {
					label: "Belum Dimulai",
					bg: "bg-gray-100",
					text: "text-gray-700",
					icon: Clock,
				};
			case "started":
				return {
					label: "Sedang Berlangsung",
					bg: "bg-blue-100",
					text: "text-blue-800",
					icon: AlertCircle,
				};
			case "end":
				return {
					label: "Selesai",
					bg: "bg-green-100",
					text: "text-green-800",
					icon: CheckCircle,
				};
			case "reviewed":
				return {
					label: "Sudah Direview",
					bg: "bg-purple-100",
					text: "text-purple-800",
					icon: Star,
				};
			default:
				return {
					label: status,
					bg: "bg-gray-100",
					text: "text-gray-800",
					icon: AlertCircle,
				};
		}
	};

	const statusConfig = getStatusConfig(session.statusSesi);
	const StatusIcon = statusConfig.icon;

	// Calculate session end time (start time + 1 hour)
	const getEndTime = (startTime) => {
		if (!startTime) return "-";
		const [hours, minutes] = startTime.split(":").map(Number);
		const endHours = (hours + 1) % 24;
		return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(
			2,
			"0"
		)}`;
	};

	return (
		<div className="min-h-screen py-8">
			{/* Header with Back Button */}
			<div className="mb-6">
				<button
					onClick={() => onNavigate("session-history")}
					className="flex items-center space-x-2 text-gray-600 hover:text-chill-blue transition-colors duration-300 mb-4 group">
					<ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
					<span className="font-medium">Kembali ke Riwayat Sesi</span>
				</button>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Detail Sesi
						</h1>
						<p className="text-gray-600 mt-1">
							Informasi lengkap tentang sesi pembelajaran Anda
						</p>
					</div>
					<div
						className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl ${statusConfig.bg} ${statusConfig.text} font-medium shadow-sm`}>
						<StatusIcon className="w-5 h-5" />
						<span>{statusConfig.label}</span>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Main Info */}
				<div className="lg:col-span-2 space-y-6">
					{/* Course, Mentor & Schedule Card - Combined */}
					<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
						{/* Course & Mentor Section */}
						<div className="flex items-start space-x-4">
							<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
								<BookOpen className="w-8 h-8 text-white" />
							</div>
							<div className="flex-1">
								<h2 className="text-lg font-bold text-gray-900 mb-2">
									{kursus?.namaKursus || "Nama Kursus"}
								</h2>
								<p className="text-gray-600 mb-3 text-sm text-justify">
									{kursus?.deskripsi || "Deskripsi kursus tidak tersedia"}
								</p>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
										{mentor?.user?.foto_profil ? (
											<img
												src={getImageUrl(
													mentor.user.foto_profil,
													"/foto_mentor/default.png"
												)}
												alt={mentor.user.nama}
												className="w-full h-full rounded-full object-cover"
											/>
										) : (
											<User className="w-5 h-5 text-gray-500" />
										)}
									</div>
									<div>
										<p className="text-sm text-gray-500">Mentor</p>
										<p className="font-semibold text-gray-900">
											{mentor?.user?.nama || "Nama Mentor"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Topic/Detail Kursus */}
						{session.detailKursus && (
							<div className="mt-4 pt-4 border-t border-gray-200">
								<p className="text-sm text-gray-500 mb-1">Topik Pembelajaran</p>
								<p className="text-gray-900 font-medium">
									{session.detailKursus}
								</p>
							</div>
						)}

						{/* Divider */}
						<div className="my-6 border-t-2 border-gray-200"></div>

						{/* Schedule & Location Section */}
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
								<Calendar className="w-6 h-6 text-white" />
							</div>
							<h3 className="text-lg font-bold text-gray-900">
								Jadwal & Lokasi
							</h3>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-start space-x-3">
								<Calendar className="w-5 h-5 text-blue-600 mt-1" />
								<div>
									<p className="text-sm text-gray-500">Tanggal</p>
									<p className="font-semibold text-gray-900">
										{jadwal?.tanggal
											? new Date(jadwal.tanggal).toLocaleDateString("id-ID", {
													weekday: "long",
													day: "numeric",
													month: "long",
													year: "numeric",
											  })
											: "-"}
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								<Clock className="w-5 h-5 text-blue-600 mt-1" />
								<div>
									<p className="text-sm text-gray-500">Waktu Sesi</p>
									<p className="font-semibold text-gray-900">
										{jadwal?.waktu ? (
											<>
												{jadwal.waktu.slice(0, 5)} - {getEndTime(jadwal.waktu)}{" "}
												WIB
												<span className="text-xs text-gray-500 ml-2">
													(1 jam)
												</span>
											</>
										) : (
											"-"
										)}
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3">
								{jadwal?.gayaMengajar === "online" ? (
									<Monitor className="w-5 h-5 text-blue-600 mt-1" />
								) : (
									<MapPinned className="w-5 h-5 text-blue-600 mt-1" />
								)}
								<div>
									<p className="text-sm text-gray-500">Metode Belajar</p>
									<span
										className={`inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium ${
											jadwal?.gayaMengajar === "online"
												? "bg-blue-100 text-blue-800"
												: "bg-red-100 text-red-800"
										}`}>
										{jadwal?.gayaMengajar === "online" ? "Online" : "Offline"}
									</span>
								</div>
							</div>

							{jadwal?.gayaMengajar === "offline" && jadwal?.tempat && (
								<div className="flex items-start space-x-3">
									<MapPin className="w-5 h-5 text-blue-600 mt-1" />
									<div>
										<p className="text-sm text-gray-500">Lokasi</p>
										<p className="font-semibold text-gray-900">
											{jadwal.tempat}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Payment Card */}
					{transaksi && (
						<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
									<CreditCard className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-lg font-bold text-gray-900">
									Informasi Pembayaran
								</h3>
							</div>

							{/* Price Breakdown */}
							<div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
								<h4 className="font-semibold text-gray-700 text-sm mb-3">
									Rincian Biaya
								</h4>

								{/* Biaya Sesi Mentor */}
								<div className="flex justify-between items-center">
									<span className="text-gray-600 text-sm">
										Biaya Sesi Mentor
									</span>
									<span className="font-semibold text-gray-900">
										Rp {mentor?.biayaPerSesi?.toLocaleString("id-ID") || "0"}
									</span>
								</div>

								{/* Biaya Paket (jika ada) */}
								{paket && (
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm">
											Biaya Paket ({paket.nama})
										</span>
										<span className="font-semibold text-gray-900">
											Rp {paket.harga_dasar?.toLocaleString("id-ID") || "0"}
										</span>
									</div>
								)}

								{/* Diskon (jika ada) */}
								{paket && paket.diskon > 0 && (
									<div className="flex justify-between items-center">
										<span className="text-gray-600 text-sm">Diskon Paket</span>
										<span className="font-semibold text-green-600">
											- Rp {paket.diskon?.toLocaleString("id-ID") || "0"}
										</span>
									</div>
								)}

								{/* Total dengan border atas */}
								<div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center">
									<span className="font-bold text-gray-900">
										Total Pembayaran
									</span>
									<span className="text-2xl font-bold text-green-600">
										Rp {transaksi.jumlah?.toLocaleString("id-ID") || "0"}
									</span>
								</div>
							</div>

							{/* Payment Details */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-500 mb-1">
										Metode Pembayaran
									</p>
									<p className="font-semibold text-gray-900">
										{transaksi.metodePembayaran || "-"}
									</p>
								</div>

								<div>
									<p className="text-sm text-gray-500 mb-1">
										Tanggal Pembayaran
									</p>
									<p className="font-semibold text-gray-900">
										{transaksi.tanggalPembayaran
											? new Date(
													transaksi.tanggalPembayaran
											  ).toLocaleDateString("id-ID", {
													day: "numeric",
													month: "long",
													year: "numeric",
											  })
											: "-"}
									</p>
								</div>

								{/* <div className="md:col-span-2">
									<p className="text-sm text-gray-500 mb-1">
										Status Pembayaran
									</p>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
											transaksi.statusPembayaran === "accepted"
												? "bg-green-100 text-green-800"
												: transaksi.statusPembayaran === "menunggu_verifikasi"
												? "bg-yellow-100 text-yellow-800"
												: "bg-red-100 text-red-800"
										}`}>
										{transaksi.statusPembayaran === "accepted"
											? "Disetujui"
											: transaksi.statusPembayaran === "menunggu_verifikasi"
											? "Menunggu Verifikasi"
											: transaksi.statusPembayaran || "Pending"}
									</span>
								</div> */}
							</div>
						</div>
					)}
				</div>

				{/* Right Column - Additional Info */}
				<div className="space-y-6">
					{/* Package Card */}
					{paket && (
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
									<Package className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-lg font-bold text-gray-900">Paket</h3>
							</div>

							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-600 mb-1">Nama Paket</p>
									<p className="font-bold text-gray-900 ">{paket.nama}</p>
								</div>

								{paket.deskripsi && (
									<div>
										<p className="text-sm text-gray-600 mb-1">Deskripsi</p>
										<p className="text-gray-700 text-sm">{paket.deskripsi}</p>
									</div>
								)}

								{/* <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                                    <div>
                                        <p className="text-sm text-gray-600">Harga Dasar</p>
                                        <p className="font-bold text-gray-900">
                                            Rp {paket.harga_dasar?.toLocaleString("id-ID") || "0"}
                                        </p>
                                    </div>
                                    {paket.diskon > 0 && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Diskon</p>
                                            <p className="font-bold text-green-600">{paket.diskon}%</p>
                                        </div>
                                    )}
                                </div> */}

								{/* Package Items */}
								{paket.items && paket.items.length > 0 && (
									<div className="pt-3 border-t border-blue-200">
										<p className="text-sm text-gray-600 mb-2">
											Layanan Tambahan
										</p>
										<div className="space-y-2">
											{paket.items.map((item, idx) => (
												<div
													key={idx}
													className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
													<span className="text-xs font-medium text-gray-900">
														{item.nama}
													</span>
													{/* <span className="text-xs text-gray-500">
                                                        Rp {item.harga?.toLocaleString("id-ID") || "0"}
                                                    </span> */}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Testimoni Card */}
					{testimoni && (
						<div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-yellow-100">
							<div className="flex items-center space-x-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
									<Star className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-lg font-bold text-gray-900">
									Testimoni Anda
								</h3>
							</div>

							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-600 mb-1">Rating</p>
									<div className="flex items-center space-x-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={`w-5 h-5 ${
													star <= (testimoni.rating || 0)
														? "text-yellow-500 fill-yellow-500"
														: "text-gray-300"
												}`}
											/>
										))}
										<span className="ml-2 font-bold text-gray-900">
											{testimoni.rating || 0}/5
										</span>
									</div>
								</div>

								{testimoni.komentar && (
									<div>
										<p className="text-sm text-gray-600 mb-1">Komentar</p>
										<p className="text-gray-700 italic">
											"{testimoni.komentar}"
										</p>
									</div>
								)}

								{testimoni.created_at && (
									<div className="pt-3 border-t border-yellow-200">
										<p className="text-xs text-gray-500">
											Diberikan pada{" "}
											{new Date(testimoni.created_at).toLocaleDateString(
												"id-ID",
												{
													day: "numeric",
													month: "long",
													year: "numeric",
												}
											)}
										</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Session Info Summary */}
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<h3 className="text-lg font-bold text-gray-900 mb-4">
							Informasi Tambahan
						</h3>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between items-center">
								<span className="text-gray-600">Nomor Sesi</span>
								<span className="font-bold text-chill-blue bg-blue-50 px-3 py-1 rounded-lg font-mono tracking-wider">
									{formatSessionId(session.id)}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Dibuat Pada</span>
								<span className="font-semibold text-gray-900">
									{session.created_at
										? new Date(session.created_at).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
										  })
										: "-"}
								</span>
							</div>
							{session.updated_at && (
								<div className="flex justify-between">
									<span className="text-gray-600">Terakhir Diupdate</span>
									<span className="font-semibold text-gray-900">
										{new Date(session.updated_at).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
