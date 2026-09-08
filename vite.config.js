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
    // Absolute, because the service pages live on real nested paths. With a
    // relative base the bundle is requested from /services/assets/ and a direct
    // visit to /services/<slug> loads a blank page.
    base: '/',
    server: proxy ? { proxy } : undefined,
  };
});
