/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9e7a46',
          dark: '#7e6136',
          light: '#bca06e',
        },
        studio: {
          black: '#121212',
          dark: '#1c1c1c',
          gray: '#282828',
          lightgray: '#3a3a3a',
          gold: '#c5a880',
          champagne: '#e6d5b8',
        }
      },
      fontFamily: {
        bangla: ['"Bangla Sangam MN"', 'serif'],
        modernline: ['"Modernline"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
