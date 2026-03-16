import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'content-primary': '#121D31',
        'content-secondary': '#667085',
        'surface-page': '#F6F7F8',
        'surface-hover': '#EEF1F3',
        'border-medium': '#D4DAE1',
        'value-text': '#3E4C63',
        slate: {
          950: '#0b1220'
        }
      },
      boxShadow: {
        page: '0 0 0 1px rgba(18,29,49,0.03), 0 10px 28px rgba(18,29,49,0.05)',
        card: '0 1px 2px rgba(18,29,49,0.04)'
      }
    }
  },
  plugins: []
} satisfies Config;
