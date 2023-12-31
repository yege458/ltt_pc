import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ltt",
  plugins: [
    vue(),
    // gzip压缩 生产环境生成 .gz 文件
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "@/assets/style/main.less";'
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5238,
    open: true,
    https: false,
    proxy: {
      "/api": {
        target: "http://111.230.93.133:8081",
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, "")
      },
      "/question": {
        target: "http://111.230.93.133:8081",
        changeOrigin: true
      },
      "/sms": {
        target: "http://111.230.93.133:8081",
        changeOrigin: true
      },
      "/user": {
        target: "http://111.230.93.133:8081",
        changeOrigin: true
      },
      "/look": {
        target: "http://111.230.93.133:8081",
        changeOrigin: true
      }
    }
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
