module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
