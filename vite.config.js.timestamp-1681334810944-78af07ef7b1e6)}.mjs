// vite.config.js
import { defineConfig } from "file:///Users/danielchicchon/Code/Polus/node_modules/vite/dist/node/index.js";
import preact from "file:///Users/danielchicchon/Code/Polus/node_modules/@preact/preset-vite/dist/esm/index.mjs";
import { createRequire } from "module";
import { crx } from "file:///Users/danielchicchon/Code/Polus/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/danielchicchon/Code/Polus/vite.config.js";
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
        outDir: "dist"
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
        crx({ manifest: manifestDev })
      ]
    });
  } else {
    return defineConfig({
      mode: "production",
      build: {
        outDir: "prod"
      },
      esbuild: {
        drop: ["console", "debugger"]
      },
      plugins: [
        preact(),
        // vue(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGFuaWVsY2hpY2Nob24vQ29kZS9Qb2x1c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RhbmllbGNoaWNjaG9uL0NvZGUvUG9sdXMvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RhbmllbGNoaWNjaG9uL0NvZGUvUG9sdXMvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHByZWFjdCBmcm9tIFwiQHByZWFjdC9wcmVzZXQtdml0ZVwiXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJ1xuLy8gaW1wb3J0IGh0bWxQbHVnaW4gZnJvbSAnQGRjaGljY2hvbi92aXRlLXBsdWdpbi1odG1sLWNvbmZpZydcbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBtYW5pZmVzdFByb2QgPSByZXF1aXJlKCcuL21hbmlmZXN0LXByb2QuanNvbicpXG5jb25zdCBtYW5pZmVzdERldiA9IHJlcXVpcmUoJy4vbWFuaWZlc3QtZGV2Lmpzb24nKVxuXG5jb25zdCBtb2RlID0gcHJvY2Vzcy5lbnYuQVBQX0VOVjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cblxuY29uc3QgZ2V0Q29uZmlnID0gKCkgPT4ge1xuICBpZiAobW9kZSA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgICAgbW9kZTogJ2RldmVsb3BtZW50JyxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIG1pbmlmeTogZmFsc2UsXG4gICAgICAgIG91dERpcjogJ2Rpc3QnXG4gICAgICB9LFxuICAgICAgcGx1Z2luczogW1xuICAgICAgICBwcmVhY3QoKSxcbiAgICAgICAgLy8gaHRtbFBsdWdpbih7XG4gICAgICAgIC8vICAgZmlsZXM6IHtcbiAgICAgICAgLy8gICAgICdpbmRleC5odG1sJzoge1xuICAgICAgICAvLyAgICAgICB0aXRsZTogJ1Rlc3QgLSBQb2x1cydcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICAnb3B0aW9ucy5odG1sJzoge1xuICAgICAgICAvLyAgICAgICB0aXRsZTogJ1Rlc3QgLSBPcHRpb25zJ1xuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgICdwb3B1cC5odG1sJzoge1xuICAgICAgICAvLyAgICAgICB0aXRsZTogJ1Rlc3QgLSBPcHRpb25zJ1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfSksXG4gICAgICAgIC8vIHZ1ZSgpLFxuICAgICAgICBjcngoeyBtYW5pZmVzdDogbWFuaWZlc3REZXYgfSksXG4gICAgICBdLFxuICAgIH0pXG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgICBtb2RlOiAncHJvZHVjdGlvbicsXG4gICAgICBidWlsZDoge1xuICAgICAgICBvdXREaXI6ICdwcm9kJ1xuICAgICAgfSxcbiAgICAgIGVzYnVpbGQ6IHtcbiAgICAgICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ11cbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHByZWFjdCgpLFxuICAgICAgICAvLyB2dWUoKSxcbiAgICAgICAgLy8gaHRtbFBsdWdpbih7IHRpdGxlOiAnUG9sdXMnIH0pLFxuICAgICAgICBjcngoeyBtYW5pZmVzdDogbWFuaWZlc3RQcm9kIH0pXG4gICAgICBdLFxuICAgIH0pXG5cbiAgfVxuXG59XG5cbmNvbnN0IGNvbmZpZyA9IGdldENvbmZpZygpO1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjtBQUMvUyxPQUFPLFlBQVk7QUFDbkIsU0FBUyxxQkFBcUI7QUFFOUIsU0FBUyxXQUFXO0FBSm9KLElBQU0sMkNBQTJDO0FBS3pOLElBQU1BLFdBQVUsY0FBYyx3Q0FBZTtBQUM3QyxJQUFNLGVBQWVBLFNBQVEsc0JBQXNCO0FBQ25ELElBQU0sY0FBY0EsU0FBUSxxQkFBcUI7QUFFakQsSUFBTSxPQUFPLFFBQVEsSUFBSTtBQUl6QixJQUFNLFlBQVksTUFBTTtBQUN0QixNQUFJLFNBQVMsZUFBZTtBQUMxQixXQUFPLGFBQWE7QUFBQSxNQUNsQixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQWVQLElBQUksRUFBRSxVQUFVLFlBQVksQ0FBQztBQUFBLE1BQy9CO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxPQUNLO0FBQ0gsV0FBTyxhQUFhO0FBQUEsTUFDbEIsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxNQUM5QjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsT0FBTztBQUFBO0FBQUE7QUFBQSxRQUdQLElBQUksRUFBRSxVQUFVLGFBQWEsQ0FBQztBQUFBLE1BQ2hDO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFFSDtBQUVGO0FBRUEsSUFBTSxTQUFTLFVBQVU7QUFFekIsSUFBTyxzQkFBUTsiLAogICJuYW1lcyI6IFsicmVxdWlyZSJdCn0K
