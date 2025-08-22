export function UpdateLoadingSpinner() {
	return (
		<div className="flex items-center justify-center py-2 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg">
			<div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-2"></div>
			<span className="text-yellow-700 text-sm">Memperbarui data...</span>
		</div>
	);
}

export default UpdateLoadingSpinner;
