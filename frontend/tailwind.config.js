/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // 👈 this line is important
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
