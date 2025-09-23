import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			// contoh tambahan:
			// "@components": path.resolve(__dirname, "./src/components"),
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
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
