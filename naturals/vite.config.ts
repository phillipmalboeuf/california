import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: '../assets/',
    rollupOptions: {
      output: {
        entryFileNames: `naturals-[name].js`,
        chunkFileNames: `naturals-[name].js`,
        assetFileNames: `naturals-[name].[ext]`
      }
    }
  }
})
