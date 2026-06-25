import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 项目站：https://<用户名>.github.io/bong-portfolio/
  base: '/bong-portfolio/',
})
