import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/Fallback/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

// Prevent browser from restoring scroll position on page reload
if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

// Reset scroll position immediately when the app starts
window.scrollTo(0, 0);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<App />
				<Toaster
					position="top-center"
					toastOptions={{
						duration: 3000,
					}}
				/>
			</ErrorBoundary>
		</QueryClientProvider>
	</StrictMode>
);
