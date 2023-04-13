// vite.config.js
import { defineConfig } from "file:///C:/Users/danie/Code/Polus/node_modules/vite/dist/node/index.js";
import preact from "file:///C:/Users/danie/Code/Polus/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import { createRequire } from "module";
import analyze from "file:///C:/Users/danie/Code/Polus/node_modules/rollup-plugin-analyzer/index.js";
import { crx } from "file:///C:/Users/danie/Code/Polus/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/danie/Code/Polus/vite.config.js";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var manifestProd = require2("./manifest-prod.json");
var manifestDev = require2("./manifest-dev.json");
var mode = process.env.APP_ENV;
var getConfig = () => {
  if (mode === "development") {
    return defineConfig({
      mode: "development",
      build: {
        minify: false,
        outDir: "dist",
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
        crx({ manifest: manifestDev })
      ]
    });
  } else {
    return defineConfig({
      mode: "production",
      build: {
        outDir: "prod",
        rollupOptions: {
          plugins: [analyze(
            { summaryOnly: true }
          )]
        }
      },
      esbuild: {
        drop: ["console", "debugger"]
      },
      plugins: [
        preact(),
        // htmlPlugin({ title: 'Polus' }),
        crx({ manifest: manifestProd })
      ]
    });
  }
};
var config = getConfig();
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYW5pZVxcXFxDb2RlXFxcXFBvbHVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkYW5pZVxcXFxDb2RlXFxcXFBvbHVzXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kYW5pZS9Db2RlL1BvbHVzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHByZWFjdCBmcm9tIFwiQHByZWFjdC9wcmVzZXQtdml0ZVwiXHJcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnXHJcbmltcG9ydCBhbmFseXplIGZyb20gXCJyb2xsdXAtcGx1Z2luLWFuYWx5emVyXCI7XHJcbi8vIGltcG9ydCBodG1sUGx1Z2luIGZyb20gJ0BkY2hpY2Nob24vdml0ZS1wbHVnaW4taHRtbC1jb25maWcnXHJcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcclxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcclxuY29uc3QgbWFuaWZlc3RQcm9kID0gcmVxdWlyZSgnLi9tYW5pZmVzdC1wcm9kLmpzb24nKVxyXG5jb25zdCBtYW5pZmVzdERldiA9IHJlcXVpcmUoJy4vbWFuaWZlc3QtZGV2Lmpzb24nKVxyXG5cclxuY29uc3QgbW9kZSA9IHByb2Nlc3MuZW52LkFQUF9FTlY7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5cclxuY29uc3QgZ2V0Q29uZmlnID0gKCkgPT4ge1xyXG4gIGlmIChtb2RlID09PSAnZGV2ZWxvcG1lbnQnKSB7XHJcbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcclxuICAgICAgbW9kZTogJ2RldmVsb3BtZW50JyxcclxuICAgICAgYnVpbGQ6IHtcclxuICAgICAgICBtaW5pZnk6IGZhbHNlLFxyXG4gICAgICAgIG91dERpcjogJ2Rpc3QnLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgIHBsdWdpbnM6IFthbmFseXplKFxyXG4gICAgICAgICAgICB7IHN1bW1hcnlPbmx5OiB0cnVlIH1cclxuICAgICAgICAgICldXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHByZWFjdCgpLFxyXG4gICAgICAgIC8vIGh0bWxQbHVnaW4oe1xyXG4gICAgICAgIC8vICAgZmlsZXM6IHtcclxuICAgICAgICAvLyAgICAgJ2luZGV4Lmh0bWwnOiB7XHJcbiAgICAgICAgLy8gICAgICAgdGl0bGU6ICdUZXN0IC0gUG9sdXMnXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgICdvcHRpb25zLmh0bWwnOiB7XHJcbiAgICAgICAgLy8gICAgICAgdGl0bGU6ICdUZXN0IC0gT3B0aW9ucydcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAgJ3BvcHVwLmh0bWwnOiB7XHJcbiAgICAgICAgLy8gICAgICAgdGl0bGU6ICdUZXN0IC0gT3B0aW9ucydcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH0pLFxyXG4gICAgICAgIGNyeCh7IG1hbmlmZXN0OiBtYW5pZmVzdERldiB9KSxcclxuICAgICAgXSxcclxuICAgIH0pXHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XHJcbiAgICAgIG1vZGU6ICdwcm9kdWN0aW9uJyxcclxuICAgICAgYnVpbGQ6IHtcclxuICAgICAgICBvdXREaXI6ICdwcm9kJyxcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICBwbHVnaW5zOiBbYW5hbHl6ZShcclxuICAgICAgICAgICAgeyBzdW1tYXJ5T25seTogdHJ1ZSB9XHJcbiAgICAgICAgICApXVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZXNidWlsZDoge1xyXG4gICAgICAgIGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBwcmVhY3QoKSxcclxuICAgICAgICAvLyBodG1sUGx1Z2luKHsgdGl0bGU6ICdQb2x1cycgfSksXHJcbiAgICAgICAgY3J4KHsgbWFuaWZlc3Q6IG1hbmlmZXN0UHJvZCB9KVxyXG4gICAgICBdLFxyXG4gICAgfSlcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25maWc7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF1USxTQUFTLG9CQUFvQjtBQUNwUyxPQUFPLFlBQVk7QUFDbkIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxhQUFhO0FBRXBCLFNBQVMsV0FBVztBQUwrSSxJQUFNLDJDQUEyQztBQU1wTixJQUFNQSxXQUFVLGNBQWMsd0NBQWU7QUFDN0MsSUFBTSxlQUFlQSxTQUFRLHNCQUFzQjtBQUNuRCxJQUFNLGNBQWNBLFNBQVEscUJBQXFCO0FBRWpELElBQU0sT0FBTyxRQUFRLElBQUk7QUFJekIsSUFBTSxZQUFZLE1BQU07QUFDdEIsTUFBSSxTQUFTLGVBQWU7QUFDMUIsV0FBTyxhQUFhO0FBQUEsTUFDbEIsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQ1IsZUFBZTtBQUFBLFVBQ2IsU0FBUyxDQUFDO0FBQUEsWUFDUixFQUFFLGFBQWEsS0FBSztBQUFBLFVBQ3RCLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLE1BRUEsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFjUCxJQUFJLEVBQUUsVUFBVSxZQUFZLENBQUM7QUFBQSxNQUMvQjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsT0FDSztBQUNILFdBQU8sYUFBYTtBQUFBLE1BQ2xCLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLGVBQWU7QUFBQSxVQUNiLFNBQVMsQ0FBQztBQUFBLFlBQ1IsRUFBRSxhQUFhLEtBQUs7QUFBQSxVQUN0QixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxNQUM5QjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBO0FBQUEsUUFFUCxJQUFJLEVBQUUsVUFBVSxhQUFhLENBQUM7QUFBQSxNQUNoQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBRUg7QUFFRjtBQUVBLElBQU0sU0FBUyxVQUFVO0FBRXpCLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbInJlcXVpcmUiXQp9Cg==
