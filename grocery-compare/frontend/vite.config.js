import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Only apply the base path if we are building for production
  base: command === 'build' ? '/UNIHACK2026-goats-of-unihack/' : '/',
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
}))