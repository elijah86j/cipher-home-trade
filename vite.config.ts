import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Required headers for FHE SDK threads support
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
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
    exclude: ['valtio/vanilla', 'valtio'],
    include: ['@zama-fhe/relayer-sdk/bundle'] // Pre-build FHE SDK
  },
  build: {
    rollupOptions: {
      external: ['valtio/vanilla', 'valtio']
    }
  }
})
