/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Main palette focused on red / black / white
        background: '#ffffff',
        surface: '#ffffff',
        muted: '#111111',
        primary: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffbcc6',
          300: '#ff8a9e',
          400: '#ff5671',
          500: '#e61d42',
          600: '#c3002f',
          700: '#980024',
          800: '#6d0019',
          900: '#3f000f',
        },
        charcoal: {
          50: '#ffffff',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#cfcfcf',
          400: '#9b9b9b',
          500: '#6b6b6b',
          600: '#444444',
          700: '#2b2b2b',
          800: '#111111',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(227, 0, 47, 0.25)',
      },
    },
  },
  plugins: [],
}
