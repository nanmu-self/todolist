import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }, // 配置代理，处理跨域
  server: {
    host: "::", // 配置项目可以局域网访问
    open: true, //启动后是否自动打开浏览器
    proxy: {
      "/api": {
        // 匹配所有以 /api 开头的请求路径
        target: "http://todoserve.n-m.ltd", // 目标服务器地址（需替换为你的后端真实地址）
        changeOrigin: true, // 允许修改请求头中的 origin
        rewrite: (path) => path.replace(/^\/api/, ""), // 移除请求路径中的 /api 前缀
        secure: false, // 如果目标服务器使用 HTTPS 则设为 true
      },
    },
  },
  plugins: [vue()],
});
