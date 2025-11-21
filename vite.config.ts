import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use repository-relative base so GitHub Pages serves assets correctly
  base: '/EmailAI/',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
