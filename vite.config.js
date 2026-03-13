import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiOrigin = (env.VITE_API_ORIGIN || '').replace(/\/$/, '');
  const proxy = apiOrigin
    ? { '/api': { target: apiOrigin, changeOrigin: true } }
    : undefined;

  return {
    plugins: [react()],
    base: './',
    server: proxy ? { proxy } : undefined,
  };
});
