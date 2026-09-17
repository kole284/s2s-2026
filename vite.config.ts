import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-igrica',
      configureServer(server) {
        server.middlewares.use('/igrica/', (req, res, next) => {
          if (req.url === '/' || req.url === '') {
            const filePath = path.resolve(__dirname, 'public/igrica/index.html');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'text/html');
            res.end(fileContent);
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/mediaqueries" as *;
        `,
      },
    },
  },
});
