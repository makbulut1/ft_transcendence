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
          50: '#282a2d',
          100: '#1F2022',
          200: '#151618',
          300: '#0C0C0D',
          400: '#030303',
        },
      },
      boxShadow: {
        '3xl': '0 40px 60px 8px rgba(0, 0, 0, 0.9)',
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
