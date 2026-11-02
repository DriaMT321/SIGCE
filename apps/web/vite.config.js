import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    envDir: path.resolve(__dirname, '../..'),
    build: {
        commonjsOptions: {
            include: [/node_modules/, /packages[\\/]shared-types[\\/]dist[\\/].*\.js$/],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        host: true,
    },
});
