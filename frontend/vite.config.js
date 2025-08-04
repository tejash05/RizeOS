import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: ['rizeos-3dca.onrender.com'], // ✅ Add your Render domain here
  },
})
git add vite.config.js
git commit -m "fix: allow Render domain in vite preview"
git push
