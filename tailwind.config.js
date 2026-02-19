/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff6b3d',
          600: '#ff8f6b',
          700: '#ea580c',
        },
        brown: {
          100: '#f4ede8',
          500: '#8b6f5c',
          700: '#4a3428',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#48c479',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
