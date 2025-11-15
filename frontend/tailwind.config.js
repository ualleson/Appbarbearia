/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#D4AF37',
        'dark-gold': '#B8941F',
        'premium-black': '#0A0A0A',
        'premium-gray': '#1A1A1A',
      },
      fontFamily: {
        'elegant': ['Playfair Display', 'serif'],
        'modern': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

