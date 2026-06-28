/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfaf6',
          100: '#d3f4ea',
          200: '#aae8d5',
          300: '#72d5b9',
          400: '#38bb99',
          500: '#17a07f',
          600: '#0d8267',
          700: '#0c6854',
          800: '#0d5244',
          900: '#0d4439',
          950: '#052720',
        },
        dark: {
          900: '#0b1120',
          800: '#111827',
          700: '#1a2535',
          600: '#243040',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
