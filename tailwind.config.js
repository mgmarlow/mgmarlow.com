const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  plugins: [require('@tailwindcss/typography')],
}
