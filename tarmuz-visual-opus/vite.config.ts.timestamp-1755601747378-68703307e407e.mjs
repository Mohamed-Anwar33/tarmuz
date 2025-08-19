// vite.config.ts
import { defineConfig } from "file:///D:/%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20-%20Copy/tarmuz-visual-opus/node_modules/vite/dist/node/index.js";
import react from "file:///D:/%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20-%20Copy/tarmuz-visual-opus/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/%D9%85%D8%B4%D8%B1%D9%88%D8%B9%20%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20-%20Copy/tarmuz-visual-opus/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\\u0645\u0634\u0631\u0648\u0639 \u0639\u0642\u0627\u0631\u0627\u062A - Copy\\tarmuz-visual-opus";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    proxy: {
      // Proxy API calls to backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      },
      // Proxy uploads (images) to backend static server
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    global: "globalThis"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTA2NDVcdTA2MzRcdTA2MzFcdTA2NDhcdTA2MzkgXHUwNjM5XHUwNjQyXHUwNjI3XHUwNjMxXHUwNjI3XHUwNjJBIC0gQ29weVxcXFx0YXJtdXotdmlzdWFsLW9wdXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFx1MDY0NVx1MDYzNFx1MDYzMVx1MDY0OFx1MDYzOSBcdTA2MzlcdTA2NDJcdTA2MjdcdTA2MzFcdTA2MjdcdTA2MkEgLSBDb3B5XFxcXHRhcm11ei12aXN1YWwtb3B1c1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovJUQ5JTg1JUQ4JUI0JUQ4JUIxJUQ5JTg4JUQ4JUI5JTIwJUQ4JUI5JUQ5JTgyJUQ4JUE3JUQ4JUIxJUQ4JUE3JUQ4JUFBJTIwLSUyMENvcHkvdGFybXV6LXZpc3VhbC1vcHVzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIGNvcnM6IHRydWUsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBQcm94eSBBUEkgY2FsbHMgdG8gYmFja2VuZFxyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUwMDBcIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgLy8gUHJveHkgdXBsb2FkcyAoaW1hZ2VzKSB0byBiYWNrZW5kIHN0YXRpYyBzZXJ2ZXJcclxuICAgICAgXCIvdXBsb2Fkc1wiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxyXG4gIH0sXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnWCxTQUFTLG9CQUFvQjtBQUM3WSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBO0FBQUEsTUFFQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBLEVBQ2xCLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
