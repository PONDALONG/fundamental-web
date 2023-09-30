/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#352F44',
        secondary: '#5C5470'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  important: true,
}

