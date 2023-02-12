import { Application } from '@hotwired/stimulus'
import DarkModeController from './controllers/dark_mode_controller'

window.Stimulus = Application.start()
Stimulus.register('dark-mode', DarkModeController)
