import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      external: (id) => {
        // Handle the motion-utils globalThis-config.mjs issue
        if (id.includes('globalThis-config.mjs')) {
          return false;
        }
        return false;
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['lucide-react', 'framer-motion'],
          lottie: ['lottie-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    exclude: ['motion-utils'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
