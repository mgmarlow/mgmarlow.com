const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      serif: ['Libre Baskerville', ...defaultTheme.fontFamily.serif],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
