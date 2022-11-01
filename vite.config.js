import { defineConfig } from 'vite'
import { createRequire } from 'module'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
const require = createRequire(import.meta.url);
const manifest = require('./manifest.json')
// import manifest from './manifest.json' // Node 14 & 16

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  build: {
    rollupOptions: {
      input: 'src/manifest.json'
    }
  }
})
