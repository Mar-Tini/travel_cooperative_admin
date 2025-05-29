import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Définir l'URL cible commune
const BACKEND_URL = "http://192.168.88.242:8000";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8081,
    proxy: {
      "/api/reservations": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/api/vehicules": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/api/cooperatives": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/api/routes": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
      "/api/trajets": {
        target: BACKEND_URL,
        changeOrigin: true,
        // rewrite: (path) => path,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      },
  }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
