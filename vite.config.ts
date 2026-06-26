import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 生产构建走 GitHub Pages 子路径；本地 dev 用根路径，避免黑屏/404
  base: mode === 'production' ? '/bong-portfolio/' : '/',
}))
