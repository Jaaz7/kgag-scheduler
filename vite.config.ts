import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load .env file based on mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    build: {
      outDir: "dist",
      minify: "esbuild",
    },
    server: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT) || 3000,
    },
    define: {
      "process.env": {
        VITE_SUPABASE_URL: JSON.stringify(env.VITE_SUPABASE_URL),
        VITE_SUPABASE_KEY: JSON.stringify(env.VITE_SUPABASE_KEY),
      },
    },
  };
});
