/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#4361EE',
        secondary: '#F8F9FA',
        dark: '#1A1A2E',
        success: '#06D6A0',
        warning: '#FFD166',
        danger: '#EF476F',
      },
    },
  },
  plugins: [],
}
