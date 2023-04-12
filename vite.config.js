import { defineConfig } from 'vite'
import { createRequire } from 'module'
import vue from '@vitejs/plugin-vue'
import htmlPlugin from '@dchicchon/vite-plugin-html-config'
import { crx } from '@crxjs/vite-plugin'
const require = createRequire(import.meta.url);
const manifestProd = require('./manifest-prod.json')
const manifestDev = require('./manifest-dev.json')

const mode = process.env.APP_ENV;

// https://vitejs.dev/config/

const getConfig = () => {
  if (mode === 'development') {
    return defineConfig({
      mode: 'development',
      build: {
        minify: false,
        outDir: 'dist'
      },
      plugins: [
        htmlPlugin({
          files: {
            'index.html': {
              title: 'Test - Polus'
            },
            'options.html': {
              title: 'Test - Options'
            },
            'popup.html': {
              title: 'Test - Options'
            }
          }
        }),
        vue(),
        crx({ manifest: manifestDev }),
      ],
    })
  }
  else {
    return defineConfig({
      mode: 'production',
      build: {
        outDir: 'prod'
      },
      esbuild: {
        drop: ['console', 'debugger']
      },
      plugins: [
        vue(),
        htmlPlugin({ title: 'Polus' }),
        crx({ manifest: manifestProd })
      ],
    })

  }

}

const config = getConfig();

export default config;