module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Libre Baskerville', 'serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
