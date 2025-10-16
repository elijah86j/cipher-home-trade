import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    global: 'globalThis', // Critical: solve FHE SDK global undefined issue
  },
  optimizeDeps: {
    include: ['@zama-fhe/relayer-sdk/bundle'] // Pre-build FHE SDK
  }
})
