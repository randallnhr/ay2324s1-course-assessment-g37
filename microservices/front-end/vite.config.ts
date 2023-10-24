import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import Svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log('env '+ JSON.stringify(env));
  return {
    plugins: [react(), Svgr()],
    server: {
      proxy: {
        "/api": env.VITE_AUTH_SERVICE_URL ?? "http://localhost:8080",
      },
    },
  }
})