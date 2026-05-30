/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dhl-red': '#d40511',
        'dhl-yellow': '#ffcc00',
        'dhl-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
