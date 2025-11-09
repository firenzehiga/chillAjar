import { Loader2 } from "lucide-react";
export function LoadingSpinner({
	message = "Loading data...",
	size = "w-8 h-8",
	height = "h-64",
	spinnerColor = "text-blue-500",
}) {
	return (
		<div className={`flex items-center justify-center ${height} text-gray-600`}>
			<Loader2 className={`${size} ${spinnerColor} animate-spin`} />
			<p className="ml-3">{message}</p>
		</div>
	);
}

export default LoadingSpinner;
