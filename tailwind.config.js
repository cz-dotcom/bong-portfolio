/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'Noto Sans SC', 'sans-serif'],
      },
      colors: {
        dark: '#0C0C0C',
        mist: '#D7E2EA',
      },
    },
  },
  plugins: [],
}
