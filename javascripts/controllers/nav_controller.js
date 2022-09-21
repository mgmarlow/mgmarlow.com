import { Controller } from '@hotwired/stimulus'

class NavController extends Controller {
  static targets = ['menuOpen', 'menuClose', 'content', 'button']

  initialize() {
    this.open = false
  }

  toggle(_e) {
    this.open = !this.open

    if (this.open) {
      this.hide(this.menuOpenTarget)
      this.show(this.menuCloseTarget)
      this.show(this.contentTarget)
    } else {
      this.hide(this.menuCloseTarget)
      this.hide(this.contentTarget)
      this.show(this.menuOpenTarget)
    }

    this.buttonTarget.setAttribute('aria-expanded', this.open)
  }

  show(el) {
    el.classList.remove('hidden')
    el.classList.add('block')
  }

  hide(el) {
    el.classList.remove('block')
    el.classList.add('hidden')
  }
}

export default NavController
