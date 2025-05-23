import React from "react";

class ErrorBoundary extends React.Component {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center h-[60vh] text-red-500">
					<div className="text-center">
						<h2 className="text-xl font-bold mb-2">Something went wrong</h2>
						<p className="mb-4">
							{this.state.error?.message || "An unexpected error occurred"}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
