export function UpdateLoadingSpinner() {
	return (
		<div className="flex items-center justify-center py-2 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
			<span className="text-blue-700 text-sm">Memperbarui data...</span>
		</div>
	);
}

export default UpdateLoadingSpinner;
