import { defineConfig } from 'vite'
import { createRequire } from 'module'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
const require = createRequire(import.meta.url);
const manifest = require('./manifest.json')

const mode = process.env.APP_ENV;

// https://vitejs.dev/config/

const getConfig = () => {
  if (mode === 'development') {
    return defineConfig({
      build: {
        minify: false,
      },
      plugins: [
        vue(),
        crx({ manifest })
      ],
    })
  }
  else {
    return defineConfig({
      esbuild: {
        drop: ['console', 'debugger']
      },
      plugins: [
        vue(),
        crx({ manifest })
      ],
    })

  }

}

const config = getConfig();

export default config;