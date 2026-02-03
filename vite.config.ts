import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const resolveShim = (relativePath: string) =>
  new URL(relativePath, import.meta.url).pathname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': resolveShim('./src/shims/lucide-react.tsx'),
      'react-router-dom': resolveShim('./src/shims/react-router-dom.tsx')
    }
  }
});
