const defaultTheme = require('tailwindcss/defaultTheme')

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`

module.exports = {
  darkMode: 'class',
  content: ['out/**/*.html'],
  safelist: [],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            fontSize: rem(18),
            pre: {
              fontSize: em(14, 18),
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
