import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const devProxyTarget = process.env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:4000'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  server: {
    host: '0.0.0.0',
    port: 5175,
    proxy: {
      // Live feed sources hit the external APIs directly in dev (no server.cjs needed).
      '/api/feed/cashinstyle': {
        target: 'https://cashinstyle.com',
        changeOrigin: true,
        rewrite: () => '/api/activity-ticker.json',
      },
      '/api/feed/sharkearnings': {
        target: 'https://sharkearnings.com',
        changeOrigin: true,
        rewrite: () => '/api/activity.json',
      },
      '/api': {
        target: devProxyTarget,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5175,
    allowedHosts: ['gpt-sites.com'],
  },
  plugins: [
    react(),
  ]
});