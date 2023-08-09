import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
	return {
		base: `http://${process.env.VITE_HOST}:${process.env.VITE_HOST_PORT}`,
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@shared": path.resolve(__dirname, "../laststand-shared"),
			},
		},
		preview: {
			host: true,
			strictPort: true,
			port: +process.env.VITE_HOST_PORT,
		},
		server: {
			watch: {
				usePolling: true,
			},
			host: true,
			strictPort: true,
			port: +process.env.VITE_HOST_PORT,
		},
	};
});
