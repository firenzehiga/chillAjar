import React, { Component } from "react";

class ErrorBoundary extends Component {
	state = { hasError: false, error: null };

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex items-center justify-center h-screen bg-error">
					<div className="text-center">
						<h2 className="text-4xl font-bold text-red-600">
							Something went wrong
						</h2>
						<p className="text-black mt-2 font-bold">
							Fix this error: {this.state.error.message}
						</p>
						<button
							onClick={() => window.location.reload()}
							className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
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
