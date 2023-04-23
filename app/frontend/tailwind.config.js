/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        baklavaBlack: {
          1: '#151618',
          2: '#1F2022',
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('c', '& > *')
      addVariant('c-h', '& > *:hover')
      addVariant('c-a', '& > *:active')
      addVariant('c-f', '& > *:focus')
    },
  ],
}
