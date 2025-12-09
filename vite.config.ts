import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Tailwind is handled via PostCSS (see `postcss.config.cjs`)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
