import { defineConfig } from 'vite'
import preact from "@preact/preset-vite"
import { createRequire } from 'module'
import analyze from "rollup-plugin-analyzer";
// import htmlPlugin from '@dchicchon/vite-plugin-html-config'
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
        outDir: 'dist',
        rollupOptions: {
          plugins: [analyze(
            { summaryOnly: true }
          )]
        }
      },

      plugins: [
        preact(),
        // htmlPlugin({
        //   files: {
        //     'index.html': {
        //       title: 'Test - Polus'
        //     },
        //     'options.html': {
        //       title: 'Test - Options'
        //     },
        //     'popup.html': {
        //       title: 'Test - Options'
        //     }
        //   }
        // }),
        // vue(),
        crx({ manifest: manifestDev }),
      ],
    })
  }
  else {
    return defineConfig({
      mode: 'production',
      build: {
        outDir: 'prod',
        rollupOptions: {
          plugins: [analyze(
            { summaryOnly: true }
          )]
        }
      },
      esbuild: {
        drop: ['console', 'debugger']
      },
      plugins: [
        preact(),
        // vue(),
        // htmlPlugin({ title: 'Polus' }),
        crx({ manifest: manifestProd })
      ],
    })

  }

}

const config = getConfig();

export default config;