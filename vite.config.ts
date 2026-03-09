import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
    ],
    build: {
        // Optimize chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react-router'],
                    'ui-vendor': ['lucide-react', 'recharts', 'sonner'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                },
            },
        },
        // Enable source map for debugging
        sourcemap: false,
        // Optimize chunk size warnings
        chunkSizeWarningLimit: 800,
    },
    // Optimize dev server
    server: {
        warmup: {
            clientFiles: [
                './src/app/pages/LandingPage.tsx',
                './src/app/pages/LoginPage.tsx',
                './src/app/pages/Dashboard.tsx',
            ],
        },
    },
})
