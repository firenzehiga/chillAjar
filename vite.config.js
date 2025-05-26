import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	server: {
		proxy: {
			"/storage": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
			},
		},
		host: true,
		port: 5173,
	},
});
