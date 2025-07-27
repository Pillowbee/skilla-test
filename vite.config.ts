import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from 'path'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    modules: {
      generateScopedName: '[name]_[local]_[hash:base64:5]'
    }
  }
})
