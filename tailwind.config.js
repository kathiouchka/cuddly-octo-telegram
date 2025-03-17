/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      colors: {
        'brick-red': '#A52A2A',
        'olive-green': '#556B2F',
        'warm-sand': '#E1C699',
        'terracotta': '#E2725B',
      },
    },
  },
  plugins: [],
} 