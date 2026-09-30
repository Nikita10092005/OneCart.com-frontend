import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const localBackendProxy = {
  '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true },
  '/uploads': { target: 'http://127.0.0.1:5000', changeOrigin: true },
  '/socket.io': { target: 'http://127.0.0.1:5000', changeOrigin: true, ws: true },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: localBackendProxy,
  },
  preview: { proxy: localBackendProxy },
})
