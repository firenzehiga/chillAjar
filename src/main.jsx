import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

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
