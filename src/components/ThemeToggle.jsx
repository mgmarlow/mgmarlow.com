import React from 'react'

// https://github.com/snowpackjs/astro/blob/main/docs/src/components/ThemeToggle.tsx
const ThemeToggle = () => {
  const [theme, setTheme] = React.useState(() => {
    if (typeof localStorage === 'undefined') {
      return 'system'
    }

    return localStorage.getItem('theme') || 'system'
  })

  React.useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      localStorage.removeItem('theme')

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('theme-dark')
      } else {
        root.classList.remove('theme-dark')
      }
    } else {
      localStorage.setItem('theme', theme)
      if (theme === 'light') {
        root.classList.remove('theme-dark')
      } else {
        root.classList.add('theme-dark')
      }
    }
  }, [theme])

  return null
}

export default ThemeToggle
