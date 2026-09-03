/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // <--- Ensure this line is present
  theme: {
    extend: {},
  },
  plugins: [],
}