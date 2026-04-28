import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUpstream = env.BACKEND_UPSTREAM || env.VITE_BACKEND_UPSTREAM || 'http://host.docker.internal:8000';

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      watch: {
        usePolling: env.CHOKIDAR_USEPOLLING === 'true',
        interval: Number(env.CHOKIDAR_INTERVAL || '300'),
      },
      proxy: {
        '/api': {
          target: backendUpstream,
          changeOrigin: true,
        },
        '/auth': {
          target: backendUpstream,
          changeOrigin: true,
        },
      },
    },
  };
});
