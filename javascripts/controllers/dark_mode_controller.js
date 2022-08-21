import { Controller } from '@hotwired/stimulus'

class DarkModeController extends Controller {
  initialize() {
    if (this.prefersDark) {
      this.toggleDark()
    } else {
      this.toggleLight()
    }
  }

  toggle(_e) {
    if (this.darkModeEnabled) {
      this.toggleLight()
    } else {
      this.toggleDark()
    }
  }

  get darkModeEnabled() {
    return document.documentElement.classList.contains('dark')
  }

  get prefersDark() {
    return (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }

  toggleLight() {
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
  }

  toggleDark() {
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
  }
}

export default DarkModeController
