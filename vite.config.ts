import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['valtio/vanilla', 'valtio'],
    include: ['@zama-fhe/relayer-sdk/bundle']
  },
  build: {
    rollupOptions: {
      external: ['valtio/vanilla', 'valtio']
    }
  }
})
