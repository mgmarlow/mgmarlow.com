module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Inter', '-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif'],
      serif: ['Libre Baskerville', 'serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
