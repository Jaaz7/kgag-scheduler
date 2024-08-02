import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 3000,
  },
  define: {
    'process.env': {
      VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL),
      VITE_SUPABASE_KEY: JSON.stringify(process.env.VITE_SUPABASE_KEY),
      VITE_DEBUG: JSON.stringify(process.env.VITE_DEBUG),
      VITE_ENV: JSON.stringify (process.env.VITE_ENV),
    },
  },
});