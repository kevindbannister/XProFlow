import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use root-relative base path so assets resolve correctly in all environments
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
});
