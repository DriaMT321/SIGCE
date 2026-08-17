/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#F8C311',
          orange: '#F37022',
          red: '#B91329',
          darkred: '#961021',
          50: '#fff9e5',
          100: '#fff0b8',
          200: '#ffe27a',
          300: '#fbd34d',
          400: '#F8C311',
          500: '#F37022',
          600: '#B91329',
          700: '#961021',
          800: '#6f0c19',
          900: '#450810',
          950: '#260408',
        },
      },
    },
  },
  plugins: [],
}

