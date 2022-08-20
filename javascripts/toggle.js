const isDark = () => document.documentElement.classList.contains('dark')

const prefersDark = () =>
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)

const toggleLight = () => {
  localStorage.setItem('theme', 'light')
  document.documentElement.classList.remove('dark')
}

const toggleDark = () => {
  localStorage.setItem('theme', 'dark')
  document.documentElement.classList.add('dark')
}

// Run this out of load event to prevent FOUC
if (prefersDark()) {
  toggleDark()
} else {
  toggleLight()
}

window.addEventListener('load', () => {
  const toggleEl = document.getElementById('dark-mode-toggle')

  toggleEl.addEventListener('click', () => {
    if (isDark()) {
      toggleLight()
    } else {
      toggleDark()
    }
  })
})
