import { useState, useEffect } from "react";
import {
	BookOpen,
	Loader2,
	AlertCircle,
	Plus,
	X,
	Package,
	Lightbulb,
	ChevronDown,
	ChevronUp,
	Copy,
	Calendar,
	Clock,
	MapPin,
	Monitor,
	FileText,
	CheckCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import showToast from "@/components/User/customToast";
import Swal from "sweetalert2";
import { AsyncImage } from "loadable-image";

import api from "@/api";
import { getImageUrl } from "@/utils/getImageUrl";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { FormSkeletonCard } from "@/components/Skeleton/FormSkeletonCard";

// ================== INTERNAL COMPONENTS ==================

const TabNavigation = ({ tabs, activeTab, onTabChange, getTabStatus }) => (
	<div className="mb-6">
		<div className="border-b border-gray-200">
			<nav className="-mb-px flex space-x-8">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const status = getTabStatus(tab.id);

					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange(tab.id)}
							className={`focus:outline-none py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
								activeTab === tab.id
									? "border-yellow-500 text-yellow-600"
									: status === "completed"
									? "border-green-300 text-green-600 hover:border-green-400"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							<Icon className="w-4 h-4" />
							{tab.label}
							{status === "completed" && (
								<span className="w-2 h-2 bg-green-500 rounded-full" />
							)}
						</button>
					);
				})}
			</nav>
		</div>
	</div>
);

const CourseBasicInfo = ({
	formData,
	onChange,
	fotoPreview,
	onFileChange,
	showMentorSelection = false,
	mentors = [],
	disabled = false,
}) => (
	<div className="space-y-6">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label
					htmlFor="namaKursus"
					className="block text-sm font-medium text-gray-700 mb-2">
					Nama Kursus *
				</label>
				<input
					type="text"
					id="namaKursus"
					name="namaKursus"
					value={formData.namaKursus}
					onChange={onChange}
					disabled={disabled}
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
					placeholder="Enter course name"
					required
				/>
			</div>

			{showMentorSelection && (
				<div>
					<label
						htmlFor="mentorId"
						className="block text-sm font-medium text-gray-700 mb-2">
						Pilih Mentor *
					</label>
					<select
						id="mentorId"
						name="mentorId"
						value={formData.mentorId}
						onChange={onChange}
						disabled={disabled}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
						required>
						<option value="" disabled>
							Pilih mentor...
						</option>
						{mentors.map((mentor) => (
							<option key={mentor.id} value={mentor.id}>
								{mentor.user?.nama}
							</option>
						))}
					</select>
				</div>
			)}

			<div className={showMentorSelection ? "col-span-2" : ""}>
				<label
					htmlFor="fotoKursus"
					className="block text-sm font-medium text-gray-700 mb-2">
					Gambar
					<span
						className="ml-2 inline-block text-xs text-yellow-500 cursor-help"
						title="Jika gambar yang tampil adalah placeholder abu-abu, berarti path terisi di database, namun tidak ditemukan dalam storage. Silakan unggah ulang gambar kursus.">
						<Lightbulb className="inline-block w-3 h-3 mb-1" />
					</span>
				</label>
				<div
					className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer"
					onDragOver={(e) => {
						e.preventDefault();
						e.currentTarget.classList.add("border-yellow-500");
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.currentTarget.classList.remove("border-yellow-500");
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.currentTarget.classList.remove("border-yellow-500");
						const file = e.dataTransfer.files[0];
						if (file) onFileChange({ target: { files: [file] } });
					}}>
					<input
						type="file"
						id="fotoKursus"
						name="fotoKursus"
						accept="image/*"
						onChange={onFileChange}
						disabled={disabled}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
					/>
					{fotoPreview ? (
						<AsyncImage
							style={{ width: 200, height: 150 }}
							src={fotoPreview}
							alt="Preview"
							className="mx-auto h-32 w-auto object-cover rounded-lg mb-2"
						/>
					) : (
						<div className="text-gray-500">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M7 16l-4-4m0 0l4-4m-4 4h18"
								/>
							</svg>
							<p className="mt-1 text-sm">
								Klik atau seret file ke sini untuk mengunggah
							</p>
							<p className="mt-1 text-xs text-gray-500">
								Format: JPG, PNG, GIF. Maksimal 3MB.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>

		<div>
			<label
				htmlFor="deskripsi"
				className="block text-sm font-medium text-gray-700 mb-2">
				Deskripsi *
			</label>
			<textarea
				id="deskripsi"
				name="deskripsi"
				value={formData.deskripsi}
				onChange={onChange}
				disabled={disabled}
				className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
				placeholder="Enter course description"
				rows="4"
				required
			/>
		</div>
	</div>
);

const ScheduleManager = ({
	schedules,
	onScheduleChange,
	onAddSchedule,
	onRemoveSchedule,
	onToggleCollapse,
	onDuplicateSchedule,
	collapsedSchedules,
	initialSchedulesLength = 0,
	mentorName = "",
	disabled = false,
}) => (
	<div className="space-y-6">
		<div className="flex items-center justify-between">
			<h3 className="text-lg font-medium text-gray-900">Jadwal Kursus</h3>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					onAddSchedule();
				}}
				disabled={disabled}
				className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
				<Plus className="w-4 h-4 mr-2" />
				Tambah Jadwal
			</button>
		</div>

		{schedules.map((schedule, index) => {
			const isCollapsed = collapsedSchedules[index];
			const isFromDatabase = index < initialSchedulesLength;

			return (
				<div
					key={index}
					className="border border-gray-200 rounded-lg overflow-hidden">
					<div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									onToggleCollapse(index);
								}}
								disabled={disabled}
								className="p-1 hover:bg-gray-200 rounded disabled:cursor-not-allowed">
								{isCollapsed ? (
									<ChevronDown className="w-4 h-4" />
								) : (
									<ChevronUp className="w-4 h-4" />
								)}
							</button>
							<h4 className="font-medium text-gray-900">
								Jadwal {index + 1}
								{isFromDatabase && (
									<span className="ml-2 text-xs bg-blue-100 text-green-800 px-2 py-1 rounded">
										Tersimpan
									</span>
								)}
							</h4>
							{schedule.tanggal && schedule.waktu && (
								<div className="flex items-center text-sm text-gray-600">
									<Calendar className="w-4 h-4 mr-1" />
									{formatDate(schedule.tanggal)}
									<Clock className="w-4 h-4 ml-3 mr-1" />
									{formatTime(schedule.waktu, true)}
								</div>
							)}
						</div>

						<div className="flex items-center space-x-2">
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									onDuplicateSchedule(index);
								}}
								disabled={disabled}
								className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded disabled:cursor-not-allowed"
								title="Duplicate schedule">
								<Copy className="w-4 h-4" />
							</button>
							{!isFromDatabase && (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										onRemoveSchedule(index);
									}}
									disabled={disabled}
									className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded disabled:cursor-not-allowed"
									title="Remove schedule">
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
					</div>

					{!isCollapsed && (
						<div className="p-4 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								<div>
									<label
										htmlFor={`tanggal-${index}`}
										className="block text-xs font-medium text-gray-700 mb-2">
										Tanggal *
									</label>
									<input
										type="date"
										id={`tanggal-${index}`}
										name="tanggal"
										value={schedule.tanggal}
										onChange={(e) => onScheduleChange(index, e)}
										disabled={disabled}
										className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
										required
									/>
								</div>
								<div>
									<label
										htmlFor={`waktu-${index}`}
										className="block text-xs font-medium text-gray-700 mb-2">
										Waktu *
									</label>
									<input
										type="time"
										id={`waktu-${index}`}
										name="waktu"
										value={schedule.waktu}
										onChange={(e) => onScheduleChange(index, e)}
										disabled={disabled}
										className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
										required
									/>
								</div>
								<div>
									<label
										htmlFor={`gayaMengajar-${index}`}
										className="block text-xs font-medium text-gray-700 mb-2">
										<Monitor className="w-4 h-4 inline mr-1" />
										Gaya Mengajar *
									</label>
									<select
										id={`gayaMengajar-${index}`}
										name="gayaMengajar"
										value={schedule.gayaMengajar}
										onChange={(e) => onScheduleChange(index, e)}
										disabled={disabled}
										className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
										required>
										<option value="online">Online</option>
										<option value="offline">Offline</option>
									</select>
								</div>
							</div>

							{/* Keterangan field - show for mentor only */}
							{mentorName && (
								<div>
									<label
										htmlFor={`keterangan-${index}`}
										className="block text-xs font-medium text-gray-700 mb-2">
										Keterangan
									</label>
									<input
										type="text"
										id={`keterangan-${index}`}
										name="keterangan"
										value={schedule.keterangan || `Kursus dengan ${mentorName}`}
										onChange={(e) => onScheduleChange(index, e)}
										disabled={disabled}
										className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
										placeholder={`Kursus dengan ${mentorName}`}
									/>
								</div>
							)}

							{schedule.gayaMengajar === "offline" && (
								<div className="mt-3">
									<div>
										<label
											htmlFor={`tempat-${index}`}
											className="block text-xs font-medium text-gray-700 mb-2">
											<MapPin className="w-4 h-4 inline mr-1" />
											Tempat
										</label>
										<input
											type="text"
											id={`tempat-${index}`}
											name="tempat"
											value={schedule.tempat}
											onChange={(e) => onScheduleChange(index, e)}
											disabled={disabled}
											className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none focus:outline-none disabled:bg-gray-100"
											placeholder="Enter location (optional)"
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			);
		})}

		{schedules.length === 0 && (
			<div className="text-center py-8 text-gray-500">
				<Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
				<p>No schedules yet. Add your first schedule above.</p>
			</div>
		)}
	</div>
);

const PackageSelector = ({
	packages,
	selectedPackages,
	onPackageToggle,
	disabled = false,
}) => {
	// Helper function to check if package is active
	const isPackageActive = (packageId) => {
		const found = selectedPackages.find((p) => p.package_id === packageId);
		return found ? found.is_active : false;
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-medium text-gray-900">
					Paket untuk Kursus
				</h3>
				<Package className="w-5 h-5 text-gray-400" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{packages.map((pkg) => {
					const isActive = isPackageActive(pkg.id);

					return (
						<div
							key={pkg.id}
							className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
								isActive
									? "border-yellow-500 bg-yellow-50"
									: "border-gray-200 hover:border-gray-300"
							} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
							onClick={() => !disabled && onPackageToggle(pkg.id)}>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h4 className="font-medium text-gray-900">{pkg.name}</h4>
									<p className="text-sm text-gray-600 mt-1">
										{pkg.description}
									</p>
								</div>
								<div
									className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
										isActive
											? "bg-yellow-500 border-yellow-500"
											: "border-gray-300"
									}`}>
									{isActive && (
										<svg
											className="w-3 h-3 text-white"
											fill="currentColor"
											viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									)}
								</div>
							</div>

							<div className="mt-3 space-y-1">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Harga Dasar:</span>
									<span className="font-medium">
										Rp {(pkg.price || 0).toLocaleString("id-ID")}
									</span>
								</div>
								{pkg.diskon > 0 && (
									<div className="flex justify-between text-sm">
										<span className="text-gray-600">Diskon:</span>
										<span className="text-red-600">
											-Rp {pkg.diskon.toLocaleString("id-ID")}
										</span>
									</div>
								)}
								<div className="flex justify-between text-sm font-medium border-t pt-1">
									<span>Total Harga:</span>
									<span className="text-green-600">
										Rp {(pkg.totalPrice || 0).toLocaleString("id-ID")}
									</span>
								</div>
							</div>

							{pkg.items && pkg.items.length > 0 && (
								<div className="mt-3 border-t pt-3">
									<p className="text-xs text-gray-600 mb-2">Items:</p>
									<div className="space-y-1">
										{pkg.items.slice(0, 3).map((item, idx) => (
											<div
												key={idx}
												className="flex justify-between text-xs text-gray-600">
												<span>{item.name}</span>
												<span>
													Rp {(item.price || 0).toLocaleString("id-ID")}
												</span>
											</div>
										))}
										{pkg.items.length > 3 && (
											<p className="text-xs text-gray-500">
												+{pkg.items.length - 3} more items...
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>

			{packages.length === 0 && (
				<div className="text-center py-8 text-gray-500">
					<Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
					<p>No packages available. Please create packages first.</p>
				</div>
			)}
		</div>
	);
};

const CourseReview = ({
	formData,
	schedules,
	fotoPreview,
	selectedPackages = [],
	packages = [],
	error,
	isFormValid,
	showPackages = false,
	mentorName = "",
}) => {
	// Helper function to get package details
	const getPackageDetails = (packageId) => {
		return packages.find((pkg) => pkg.id === packageId);
	};

	// Get active packages
	const activePackages = selectedPackages
		.filter((p) => p.is_active)
		.map((p) => getPackageDetails(p.package_id))
		.filter(Boolean);

	return (
		<div className="space-y-6">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Review Your Course
			</h3>

			{/* Course Info Summary */}
			<div className="bg-gray-50 rounded-lg p-4">
				<h4 className="font-medium text-gray-900 mb-3">Course Information</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<span className="text-sm text-gray-600">Nama Kursus:</span>
						<p className="font-medium">
							{formData.namaKursus || "Not specified"}
						</p>
					</div>
					<div>
						<span className="text-sm text-gray-600">Deskripsi:</span>
						<p className="font-medium">
							{formData.deskripsi || "Not specified"}
						</p>
					</div>
					{mentorName && (
						<div>
							<span className="text-sm text-gray-600">Mentor:</span>
							<p className="font-medium">{mentorName}</p>
						</div>
					)}
				</div>
				{fotoPreview && (
					<div className="mt-4">
						<span className="text-sm text-gray-600">Gambar:</span>
						<AsyncImage
							style={{ width: 150, height: 100 }}
							src={fotoPreview}
							alt="Course preview"
							className="mt-2 h-24 w-auto object-cover rounded-lg"
						/>
					</div>
				)}
			</div>

			{/* Schedule Summary */}
			<div className="bg-gray-50 p-4 rounded-lg">
				<h4 className="font-medium text-gray-900 mb-3">Jadwal Kursus</h4>
				{schedules.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{schedules
							.filter((s) => s.tanggal && s.waktu)
							.map((schedule, index) => (
								<div key={index} className="bg-white p-3 rounded border">
									<div className="flex items-center gap-2 text-sm text-gray-700">
										<Calendar className="w-4 h-4" />
										{formatDate(schedule.tanggal)}
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
										<Clock className="w-4 h-4" />
										{formatTime(schedule.waktu, true)}
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
										<Monitor className="w-4 h-4" />
										{schedule.gayaMengajar}
									</div>
									{schedule.tempat && (
										<div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
											<MapPin className="w-4 h-4" />
											{schedule.tempat}
										</div>
									)}
									{schedule.keterangan && (
										<div className="text-sm text-gray-600 mt-1">
											{schedule.keterangan}
										</div>
									)}
								</div>
							))}
					</div>
				) : (
					<p className="text-sm text-gray-500">Belum ada jadwal yang lengkap</p>
				)}
			</div>

			{/* Package Summary */}
			{showPackages && (
				<div className="bg-gray-50 p-4 rounded-lg">
					<h4 className="font-medium text-gray-900 mb-3">Paket Aktif</h4>
					{activePackages.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{activePackages.map((pkg) => (
								<div key={pkg.id} className="bg-white p-3 rounded border">
									<h5 className="font-medium text-gray-900">{pkg.name}</h5>
									<p className="text-sm text-gray-600 mt-1">
										{pkg.description}
									</p>
									<div className="mt-2 text-sm">
										<span className="text-green-600 font-medium">
											Rp {(pkg.totalPrice || 0).toLocaleString("id-ID")}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500">
							Belum ada paket yang dipilih
						</p>
					)}
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center text-red-600">
						<AlertCircle className="w-5 h-5 mr-2" />
						<span className="font-medium">Error</span>
					</div>
					<p className="mt-1 text-sm text-red-600">{error}</p>
				</div>
			)}

			{/* Form validation helper */}
			{!isFormValid() && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-center text-yellow-600">
						<AlertCircle className="w-5 h-5 mr-2" />
						<span className="font-medium">Lengkapi Data Berikut:</span>
					</div>
					<ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
						{!formData.namaKursus.trim() && <li>Nama kursus harus diisi</li>}
						{!formData.deskripsi.trim() && <li>Deskripsi harus diisi</li>}
						{!schedules.some((s) => s.tanggal && s.waktu && s.gayaMengajar) && (
							<li>Minimal 1 jadwal lengkap (tanggal, waktu, gaya mengajar)</li>
						)}
						{showPackages && activePackages.length === 0 && (
							<li>Minimal 1 paket harus dipilih</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

// ================== MAIN COMPONENT ==================

export function CourseForm({
	courseId,
	onNavigate,
	userRole = "mentor", // "admin" or "mentor"
	userData = {},
	backNavigationTarget = "mentor-manage-courses",
}) {
	const isEditMode = !!courseId;
	const queryClient = useQueryClient();

	// Configuration based on user role
	const isAdmin = userRole === "admin";
	const isMentor = userRole === "mentor";
	const mentorName = userData?.nama || "";

	// ======== STATES ========
	const [formData, setFormData] = useState({
		namaKursus: "",
		deskripsi: "",
		mentorId: "",
	});
	const [schedules, setSchedules] = useState([
		{
			tanggal: "",
			waktu: "",
			keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
			tempat: "",
			gayaMengajar: "online",
		},
	]);
	const [initialSchedules, setInitialSchedules] = useState([]);
	const [collapsedSchedules, setCollapsedSchedules] = useState({ 0: false });
	const [selectedPackages, setSelectedPackages] = useState([]);
	const [initialSelectedPackages, setInitialSelectedPackages] = useState([]);
	const [mentors, setMentors] = useState([]);
	const [packages, setPackages] = useState([]);
	const [activeTab, setActiveTab] = useState("info");
	const [fotoKursus, setFotoKursus] = useState(null);
	const [fotoPreview, setFotoPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Tab configuration
	const baseTabs = [
		{
			id: "info",
			label: "Info Dasar",
			icon: FileText,
		},
		{
			id: "jadwal",
			label: "Jadwal",
			icon: Calendar,
		},
	];

	const adminTabs = [
		...baseTabs,
		{
			id: "paket",
			label: "Paket",
			icon: Package,
		},
		{
			id: "review",
			label: "Review & Save",
			icon: CheckCircle,
		},
	];

	const mentorTabs = [
		...baseTabs,
		{
			id: "review",
			label: "Review & Save",
			icon: CheckCircle,
		},
	];

	const tabs = isAdmin ? adminTabs : mentorTabs;

	// ======== HANDLERS ========
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 3 * 1024 * 1024) {
				Swal.fire({
					icon: "error",
					title: "Ukuran file terlalu besar",
					text: "Ukuran file maksimal 3MB.",
				});
				return;
			}
			setFotoKursus(file);
			setFotoPreview(URL.createObjectURL(file));
		}
	};

	const handleScheduleChange = (index, e) => {
		const { name, value } = e.target;
		const newSchedules = [...schedules];
		newSchedules[index] = { ...newSchedules[index], [name]: value };
		setSchedules(newSchedules);
	};

	const addSchedule = () => {
		const newIndex = schedules.length;
		setSchedules([
			...schedules,
			{
				tanggal: "",
				waktu: "",
				keterangan: mentorName ? `Kursus dengan ${mentorName}` : "",
				tempat: "",
				gayaMengajar: "online",
			},
		]);
		setCollapsedSchedules((prev) => ({
			...prev,
			[newIndex]: false,
		}));
	};

	const removeSchedule = (index) => {
		if (index >= initialSchedules.length) {
			setSchedules(schedules.filter((_, i) => i !== index));
		}
	};

	const toggleScheduleCollapse = (index) => {
		setCollapsedSchedules((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const duplicateSchedule = (index) => {
		const scheduleToClone = { ...schedules[index] };
		scheduleToClone.tanggal = "";
		scheduleToClone.waktu = "";
		if (!scheduleToClone.keterangan && mentorName) {
			scheduleToClone.keterangan = `Kursus dengan ${mentorName}`;
		}
		delete scheduleToClone.id;

		const newSchedules = [...schedules];
		newSchedules.splice(index + 1, 0, scheduleToClone);
		setSchedules(newSchedules);

		const newCollapsedStates = {};
		Object.keys(collapsedSchedules).forEach((key) => {
			const idx = parseInt(key);
			if (idx > index) {
				newCollapsedStates[idx + 1] = collapsedSchedules[idx];
			} else {
				newCollapsedStates[idx] = collapsedSchedules[idx];
			}
		});
		newCollapsedStates[index + 1] = false;
		setCollapsedSchedules(newCollapsedStates);
	};

	const handlePackageToggle = (packageId) => {
		setSelectedPackages((prev) => {
			const existingIndex = prev.findIndex((p) => p.package_id === packageId);

			if (existingIndex >= 0) {
				const updated = prev.map((p) =>
					p.package_id === packageId ? { ...p, is_active: !p.is_active } : p
				);
				toast.dismiss();
				const activeCount = updated.filter((p) => p.is_active).length;
				if (activeCount === 0) {
					showToast({
						type: "warning",
						title: "Minimal 1 paket harus dipilih",
						message: "Anda harus memilih minimal 1 paket untuk kursus.",
						duration: 2000,
					});
					return prev;
				}

				return updated;
			} else {
				return [...prev, { package_id: packageId, is_active: true }];
			}
		});
	};

	// Tab navigation functions
	const handleTabChange = (tabId) => {
		setActiveTab(tabId);
	};

	const getTabStatus = (tabId) => {
		if (tabId === activeTab) return "active";

		if (tabId === "info") {
			return formData.namaKursus && formData.deskripsi
				? "completed"
				: "available";
		}
		if (tabId === "jadwal") {
			return schedules.some((s) => s.tanggal && s.waktu)
				? "completed"
				: "available";
		}
		if (tabId === "paket" && isAdmin) {
			return selectedPackages.some((p) => p.is_active)
				? "completed"
				: "available";
		}

		return "available";
	};

	// Form validation function
	const isFormValid = () => {
		if (!formData.namaKursus.trim() || !formData.deskripsi.trim()) {
			return false;
		}

		const hasValidSchedule = schedules.some(
			(schedule) => schedule.tanggal && schedule.waktu && schedule.gayaMengajar
		);

		if (!hasValidSchedule) return false;

		if (isAdmin) {
			const activePackages = selectedPackages.filter((p) => p.is_active);
			if (activePackages.length === 0) return false;
		}

		return true;
	};

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token");
			if (!token) return;

			try {
				setLoading(true);

				// Fetch mentors (admin only)
				if (isAdmin) {
					try {
						const mentorResponse = await api.get("/admin/mentor", {
							headers: { Authorization: `Bearer ${token}` },
						});
						setMentors(mentorResponse.data);
					} catch (err) {
						console.error("Failed to fetch mentors:", err);
					}

					// Fetch packages (admin only)
					try {
						const packageResponse = await api.get("/paket", {
							headers: { Authorization: `Bearer ${token}` },
						});
						const paketData = Array.isArray(packageResponse.data)
							? packageResponse.data.map((p) => ({
									id: p.id,
									name: p.nama,
									price: p.harga_dasar,
									totalPrice: Array.isArray(p.items)
										? Math.max(
												p.items.reduce(
													(sum, item) =>
														sum +
														Math.max((item.harga || 0) - (item.diskon || 0), 0),
													0
												) - (p.diskon || 0),
												0
										  )
										: Math.max((p.harga_dasar || 0) - (p.diskon || 0), 0),
									description: p.deskripsi,
									items: Array.isArray(p.items)
										? p.items.map((item) => ({
												name: item.nama,
												price: Math.max(
													(item.harga || 0) - (item.diskon || 0),
													0
												),
												description: item.deskripsi,
										  }))
										: [],
									diskon: p.diskon || 0,
							  }))
							: [];
						setPackages(paketData);

						if (!isEditMode && paketData.length > 0) {
							setSelectedPackages([
								{ package_id: paketData[0].id, is_active: true },
							]);
						}
					} catch (err) {
						console.error("Failed to fetch packages:", err);
					}
				}

				// Fetch course data if in edit mode
				if (isEditMode) {
					try {
						const response = await api.get(`/kursus/${courseId}`, {
							headers: { Authorization: `Bearer ${token}` },
						});

						setFormData({
							namaKursus: response.data.namaKursus,
							deskripsi: response.data.deskripsi,
							mentorId: response.data.mentor_id || "",
						});

						if (response.data.fotoKursus) {
							setFotoPreview(getImageUrl(response.data.fotoKursus));
						}

						// Set schedules
						if (response.data.jadwal_kursus) {
							const initial = response.data.jadwal_kursus.map((jadwal) => ({
								id: jadwal.id,
								tanggal: jadwal.tanggal || "",
								waktu: jadwal.waktu || "",
								keterangan:
									jadwal.keterangan ||
									(isMentor ? `Kursus dengan ${mentorName}` : ""),
								tempat: jadwal.tempat || "",
								gayaMengajar: jadwal.gayaMengajar || "online",
							}));
							setInitialSchedules(initial);
							setSchedules(initial);

							const initialCollapsedState = {};
							initial.forEach((_, index) => {
								initialCollapsedState[index] = true;
							});
							setCollapsedSchedules(initialCollapsedState);
						}

						// Set packages for admin
						if (isAdmin) {
							if (
								response.data.visibilitas_paket &&
								Array.isArray(response.data.visibilitas_paket)
							) {
								const mapped = response.data.visibilitas_paket.map((vp) => ({
									package_id: vp.paket_id,
									is_active: !!vp.visibilitas,
								}));
								setSelectedPackages(mapped);
								// simpan snapshot initial untuk perbandingan saat submit
								setInitialSelectedPackages(mapped);
							} else if (response.data.packages) {
								const mapped = response.data.packages.map((pkg) => ({
									package_id: pkg.id,
									is_active: true,
								}));
								setSelectedPackages(mapped);
								setInitialSelectedPackages(mapped);
							}
						}
					} catch (err) {
						setError("Gagal mengambil data kursus");
					}
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [courseId, isEditMode, isAdmin, mentorName]);

	// Submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");
			const payload = new FormData();
			payload.append("namaKursus", formData.namaKursus);
			payload.append("deskripsi", formData.deskripsi);
			if (fotoKursus) {
				payload.append("fotoKursus", fotoKursus);
			}

			if (isAdmin && formData.mentorId) {
				payload.append("mentor_id", formData.mentorId);
			}

			// Attach package visibility info into the same payload (admin only)
			if (isAdmin && Array.isArray(selectedPackages)) {
				if (!isEditMode) {
					// Create flow: kirim paket aktif dan visibilitas lengkap
					const activePackages = selectedPackages.filter((p) => p.is_active);
					activePackages.forEach((p, idx) => {
						payload.append(`paket_ids[${idx}]`, p.package_id);
					});

					selectedPackages.forEach((p, idx) => {
						payload.append(`visibilitas_paket[${idx}][paket_id]`, p.package_id);
						payload.append(
							`visibilitas_paket[${idx}][visibilitas]`,
							p.is_active ? 1 : 0
						);
					});
				} else {
					// Edit flow: kirim hanya paket yang berubah visibilitasnya
					const changedVisibilities = [];
					selectedPackages.forEach((p) => {
						const initial = initialSelectedPackages.find(
							(ip) => ip.package_id === p.package_id
						);
						if (!initial || initial.is_active !== p.is_active) {
							changedVisibilities.push(p);
						}
					});

					changedVisibilities.forEach((p, idx) => {
						payload.append(`visibilitas_paket[${idx}][paket_id]`, p.package_id);
						payload.append(
							`visibilitas_paket[${idx}][visibilitas]`,
							p.is_active ? 1 : 0
						);
					});
				}
			}

			let response;
			const apiPath = isAdmin ? "/kursus" : "/mentor/kursus";

			if (isEditMode) {
				payload.append("_method", "PUT");
				response = await api.post(`${apiPath}/${courseId}`, payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				response = await api.post(apiPath, payload, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				});
			}

			if (response.status === 200 || response.status === 201) {
				let newCourseId;
				if (isEditMode) {
					newCourseId = courseId;
				} else {
					newCourseId =
						response.data.kursus?.id ||
						response.data.id ||
						response.data.course_id ||
						response.data.data?.id;

					if (!newCourseId) {
						const fetchCourseResponse = await api.get(
							`/kursus?namaKursus=${formData.namaKursus}`,
							{
								headers: { Authorization: `Bearer ${token}` },
							}
						);
						const latestCourse = fetchCourseResponse.data
							.filter((course) => course.namaKursus === formData.namaKursus)
							.sort(
								(a, b) => new Date(b.created_at) - new Date(a.created_at)
							)[0];
						newCourseId = latestCourse?.id;

						if (!newCourseId) {
							throw new Error("Gagal mendapatkan ID kursus setelah pembuatan");
						}
					}
				}

				// Handle schedules - skip unchanged and run requests in parallel
				const scheduleRequests = [];
				const scheduleEndpoint = isAdmin
					? "jadwal-kursus"
					: "mentor/atur-jadwal";

				for (const schedule of schedules) {
					// validation: require fields
					if (!schedule.tanggal || !schedule.waktu || !schedule.gayaMengajar) {
						throw new Error(
							"Setiap jadwal wajib mengisi tanggal, waktu, dan gayaMengajar."
						);
					}

					// Jika jadwal sudah ada di DB dan tidak berubah dibanding initialSchedules -> skip
					if (schedule.id) {
						const initialSchedule = initialSchedules.find(
							(s) => s.id === schedule.id
						);
						const unchanged =
							initialSchedule &&
							initialSchedule.tanggal === schedule.tanggal &&
							initialSchedule.waktu === schedule.waktu &&
							initialSchedule.gayaMengajar === schedule.gayaMengajar &&
							(initialSchedule.tempat || "") === (schedule.tempat || "") &&
							(initialSchedule.keterangan || "") ===
								(schedule.keterangan || "");

						if (unchanged) continue;
					}

					const jadwalPayload = {
						kursus_id: newCourseId,
						id: schedule.id || undefined,
						tanggal: schedule.tanggal,
						waktu: schedule.waktu,
						keterangan: schedule.keterangan || "",
						tempat: schedule.tempat || "",
						gayaMengajar: schedule.gayaMengajar,
					};

					// push request promise, do not await here
					scheduleRequests.push(
						api.post(scheduleEndpoint, jadwalPayload, {
							headers: { Authorization: `Bearer ${token}` },
						})
					);
				}

				if (scheduleRequests.length > 0) {
					await Promise.all(scheduleRequests);
				}

				queryClient.invalidateQueries(["courses"]);
				queryClient.invalidateQueries(["mentorCourses"]);

				toast.success(
					`Kursus ${isEditMode ? "diperbarui" : "dibuat"} berhasil!`
				);
				onNavigate(backNavigationTarget);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Terjadi kesalahan saat menyimpan data.",
					confirmButtonColor: "#EF4444",
				});
			}
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				(isEditMode ? "Gagal memperbarui kursus" : "Gagal membuat kursus");
			setError(errorMessage);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: errorMessage,
				confirmButtonColor: "#EF4444",
			});
			console.error("Error details:", err.response ? err.response.data : err);
		} finally {
			setLoading(false);
		}
	};

	if (loading && isEditMode) {
		return <FormSkeletonCard />;
	}

	return (
		<div className="py-8">
			{/* Back Button */}
			<button
				onClick={() => onNavigate(backNavigationTarget)}
				className="px-4 py-2 mb-4 bg-gray-50 text-center w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group outline-none focus:outline-none"
				type="button">
				<div className="bg-yellow-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1024 1024"
						height="25px"
						width="25px">
						<path
							d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
							fill="#000000"
						/>
						<path
							d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
							fill="#000000"
						/>
					</svg>
				</div>
				<p className="translate-x-2">Cancel</p>
			</button>

			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
				<h2 className="text-2xl font-bold flex items-center text-gray-900 mb-6">
					<BookOpen className="w-6 h-6 mr-2 text-yellow-600" />
					{isEditMode ? "Edit Course" : "Add New Course"}
				</h2>

				{/* Tab Navigation */}
				<TabNavigation
					tabs={tabs}
					activeTab={activeTab}
					onTabChange={handleTabChange}
					getTabStatus={getTabStatus}
				/>

				<form onSubmit={handleSubmit}>
					<div className="space-y-6">
						{/* Basic Info Tab */}
						{activeTab === "info" && (
							<CourseBasicInfo
								formData={formData}
								onChange={handleChange}
								fotoPreview={fotoPreview}
								onFileChange={handleFileChange}
								showMentorSelection={isAdmin}
								mentors={mentors}
								disabled={loading}
							/>
						)}

						{/* Schedule Tab */}
						{activeTab === "jadwal" && (
							<ScheduleManager
								schedules={schedules}
								onScheduleChange={handleScheduleChange}
								onAddSchedule={addSchedule}
								onRemoveSchedule={removeSchedule}
								onToggleCollapse={toggleScheduleCollapse}
								onDuplicateSchedule={duplicateSchedule}
								collapsedSchedules={collapsedSchedules}
								initialSchedulesLength={initialSchedules.length}
								mentorName={isMentor ? mentorName : ""}
								disabled={loading}
							/>
						)}

						{/* Package Tab (Admin only) */}
						{activeTab === "paket" && isAdmin && (
							<PackageSelector
								packages={packages}
								selectedPackages={selectedPackages}
								onPackageToggle={handlePackageToggle}
								disabled={loading}
							/>
						)}

						{/* Review Tab */}
						{activeTab === "review" && (
							<CourseReview
								formData={formData}
								schedules={schedules}
								fotoPreview={fotoPreview}
								selectedPackages={selectedPackages}
								packages={packages}
								error={error}
								isFormValid={isFormValid}
								showPackages={isAdmin}
								mentorName={isMentor ? mentorName : ""}
							/>
						)}
					</div>

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();
								const currentIndex = tabs.findIndex(
									(tab) => tab.id === activeTab
								);
								if (currentIndex > 0) {
									handleTabChange(tabs[currentIndex - 1].id);
								}
							}}
							disabled={tabs.findIndex((tab) => tab.id === activeTab) === 0}
							className={`px-4 py-2 rounded-lg transition-colors ${
								tabs.findIndex((tab) => tab.id === activeTab) === 0
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}>
							← Previous
						</button>

						<div className="flex space-x-3">
							{activeTab !== "review" ? (
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										const currentIndex = tabs.findIndex(
											(tab) => tab.id === activeTab
										);
										if (currentIndex < tabs.length - 1) {
											handleTabChange(tabs[currentIndex + 1].id);
										}
									}}
									className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
									Next →
								</button>
							) : (
								<button
									type="submit"
									disabled={loading || !isFormValid()}
									className={`px-6 py-2 rounded-lg transition-colors ${
										loading || !isFormValid()
											? "bg-gray-300 text-gray-500 cursor-not-allowed"
											: "bg-yellow-600 text-white hover:bg-yellow-700"
									}`}>
									{loading ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
											Processing...
										</>
									) : isEditMode ? (
										"Simpan"
									) : (
										"Buat Kursus"
									)}
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CourseForm;
