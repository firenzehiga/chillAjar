import { toast } from "react-hot-toast";
import {
	CheckCircle,
	XCircle,
	AlertTriangle,
	Info,
	Lightbulb,
} from "lucide-react";

/**
 * Custom Toast Component untuk notifikasi yang lebih fleksibel
 * @param {Object} options - Konfigurasi toast
 * @param {string} options.type - Tipe toast: 'error', 'success', 'warning', 'info'
 * @param {string} options.title - Judul utama toast
 * @param {string} options.message - Pesan deskripsi
 * @param {string|React.Component} options.icon - Custom emoji icon atau Lucide React component (opsional)
 * @param {string} options.tipText - Text untuk bagian tip/saran (opsional)
 * @param {string|React.Component} options.tipIcon - Icon untuk tip, bisa emoji atau Lucide component (default: Lightbulb)
 * @param {boolean} options.showTip - Tampilkan bagian tip atau tidak (default: true)
 * @param {boolean} options.useLucideIcons - Gunakan Lucide icons instead of emoji (default: true)
 * @param {string} options.id - ID unik untuk toast (opsional)
 * @param {number} options.duration - Durasi toast dalam ms (default: 3000)
 * @param {string} options.position - Posisi toast (default: 'top-center')
 */

const customToast = ({
	type = "info",
	title,
	message,
	icon,
	tipText,
	tipIcon,
	showTip = true,
	useLucideIcons = true,
	id,
	duration = 3000,
	position = "top-center",
}) => {
	// Konfigurasi berdasarkan type
	const toastConfig = {
		error: {
			bgColor: "from-red-400 to-red-500",
			borderColor: "#FF3131",
			tipBg: "bg-red-50",
			tipTextColor: "text-red-800",
			tipIconColor: "text-red-600",
			defaultIcon: "❌",
			lucideIcon: XCircle,
		},
		success: {
			bgColor: "from-green-400 to-green-500",
			borderColor: "#22c55e",
			tipBg: "bg-green-50",
			tipTextColor: "text-green-800",
			tipIconColor: "text-green-600",
			defaultIcon: "✅",
			lucideIcon: CheckCircle,
		},
		warning: {
			bgColor: "from-orange-400 to-orange-500",
			borderColor: "#f59e0b",
			tipBg: "bg-orange-50",
			tipTextColor: "text-orange-800",
			tipIconColor: "text-orange-600",
			defaultIcon: "⚠️",
			lucideIcon: AlertTriangle,
		},
		info: {
			bgColor: "from-blue-400 to-blue-500",
			borderColor: "#3b82f6",
			tipBg: "bg-blue-50",
			tipTextColor: "text-blue-800",
			tipIconColor: "text-blue-600",
			defaultIcon: "ℹ️",
			lucideIcon: Info,
		},
	};

	const config = toastConfig[type] || toastConfig.info;

	// Tentukan icon yang akan digunakan
	let finalIcon;
	if (icon) {
		finalIcon = icon;
	} else if (useLucideIcons) {
		const LucideIcon = config.lucideIcon;
		finalIcon = <LucideIcon size={20} className="text-white" />;
	} else {
		finalIcon = config.defaultIcon;
	}

	// Tentukan tip icon
	let finalTipIcon;
	if (tipIcon) {
		finalTipIcon = tipIcon;
	} else if (useLucideIcons) {
		finalTipIcon = <Lightbulb size={14} className={config.tipIconColor} />;
	} else {
		finalTipIcon = "💡";
	}

	const ToastComponent = (
		<div className="flex items-start space-x-3">
			{/* Icon */}
			<div className="flex-shrink-0">
				<div
					className={`w-10 h-10 bg-gradient-to-br ${config.bgColor} rounded-full flex items-center justify-center`}>
					{typeof finalIcon === "string" ? (
						<span className="text-white text-lg">{finalIcon}</span>
					) : (
						finalIcon
					)}
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 space-y-2">
				<div>
					<h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
					{message && <p className="text-xs text-gray-600">{message}</p>}
				</div>

				{/* Tip Section */}
				{showTip && tipText && (
					<div className={`${config.tipBg} rounded-lg p-2`}>
						<div className="flex items-center space-x-2">
							{typeof finalTipIcon === "string" ? (
								<span className={config.tipIconColor}>{finalTipIcon}</span>
							) : (
								finalTipIcon
							)}
							<span className={`text-xs ${config.tipTextColor}`}>
								{tipText}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);

	return toast(ToastComponent, {
		id: id || `${type}-toast-${Date.now()}`,
		duration,
		position,
		style: {
			background: "white",
			border: `3px solid ${config.borderColor}`,
			padding: "14px",
			borderRadius: "16px",
			minWidth: "250px",
			boxShadow:
				"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
		},
	});
};

// Helper functions untuk kemudahan penggunaan
export const toastError = (title, message, options = {}) =>
	customToast({
		type: "error",
		title,
		message,
		...options,
	});

export const toastSuccess = (title, message, options = {}) =>
	customToast({
		type: "success",
		title,
		message,
		...options,
	});

export const toastWarning = (title, message, options = {}) =>
	customToast({
		type: "warning",
		title,
		message,
		...options,
	});

export const toastInfo = (title, message, options = {}) =>
	customToast({
		type: "info",
		title,
		message,
		...options,
	});

// Export function untuk kemudahan penggunaan di App.jsx
export const showToast = customToast;

export default customToast;
