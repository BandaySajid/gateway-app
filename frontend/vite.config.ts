import path from 'path';
import react from '@vitejs/plugin-react';
import { loadEnv, defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		define: {
			'process.env.API_HOST': JSON.stringify(env.API_HOST),
			'process.env.ENV': JSON.stringify(env.ENV),
			'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID),
		},
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			cors: {
				origin: '*',
				methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
				preflightContinue: false,
				optionsSuccessStatus: 204,
				allowedHeaders: [
					'Content-Type',
					'Authorization',
					'X-Requested-With',
				],
			},
		},
	};
});
