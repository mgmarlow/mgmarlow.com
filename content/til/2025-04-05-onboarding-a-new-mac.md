---
title: Onboarding a new Mac
date: 2025-04-05
---

My process for onboarding a new Mac:

1. Remove all of the apps from the default dock. Move the dock to the righthand side and
   set to minimize automatically.
2. Rebind Caps Lock as Control via Settings->Keyboard->Modifier Keys.
3. Install the usual software:
   - [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
   - [Alacritty](https://alacritty.org) (terminal emulator)
   - [Rectangle](https://rectangleapp.com) (windowing solution)
   - [Hack](https://sourcefoundry.org/hack/) (monospace font of choice)
   - [1Password](https://1password.com)
   - [Homebrew](https://brew.sh)
4. Install git by opening Alacritty, attempting to call `git`, and accepting the
   `xcode-select` tool installation.
5. Install must-have brew formulae:
   - `brew install helix tmux ripgrep npm rbenv`
6. [Configure a Github SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
7. Bring over [dotfiles](https://github.com/mgmarlow/dotfiles) for Alacritty,
   Helix, tmux, git, etc. I don't have a good workflow for this yet but I'm
   investigating [GNU Stow](https://www.gnu.org/software/stow/).

I probably forgot a thing or two, but this list accounts for some 90% of the tools
I use in the day-to-day.
