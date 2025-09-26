/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        icywhite: "#f8fbfd",
        oceanblue: "#3b82f6",
        deepblack: "#111111",
      },
    },
  },
  plugins: [],
}