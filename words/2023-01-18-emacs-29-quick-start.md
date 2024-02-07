---
title: Emacs 29 Quick Start
date: 2023-01-18
updated_at: 2024-02-06
tags: emacs
---

> Update: I created [Emacs Starter Kit](https://emacs-config-generator.fly.dev) as an even quicker way to get up and running with Emacs. It uses the settings from this guide and throws in some extras for various programming languages. [Check it out](https://emacs-config-generator.fly.dev)!

The no-nonsense guide to getting started with Emacs.

By the end of this guide you'll have Emacs 29 configured with better default settings, IDE features like code-completion and LSP support, and much improved minibuffer completion. Everything listed here is available out of the box or downloaded from the default Emacs package server, [GNU Elpa](http://elpa.gnu.org/).

## Installation

Begin by installing Emacs 29 for your OS:

- Mac OS: [emacs-plus](https://github.com/d12frosted/homebrew-emacs-plus) via Homebrew
- Linux: [Build from source](https://git.savannah.gnu.org/cgit/emacs.git) (see [INSTALL](https://git.savannah.gnu.org/cgit/emacs.git/tree/INSTALL))
- Windows: Download an [alpha.gnu.org snapshot](https://alpha.gnu.org/gnu/emacs/pretest/windows/emacs-29/?C=M;O=D)

It's important to use Emacs 29+ and not a prior version. Emacs 29
ships with two important libraries
([eglot](https://github.com/joaotavora/eglot) and
[use-package](https://github.com/jwiegley/use-package)) that are used
extensively in this guide.

## Run through the tutorial

Go ahead and launch Emacs. You're greeted with the startup screen which presents a bunch of useful information and a dated logo. Of particular note is the Emacs tutorial, which you should click on before continuing with the rest of this guide.

You can also launch the tutorial via `C-h t`. ([What is `C-h`](https://www.gnu.org/software/emacs/tour/)?)

## Settings

You've installed Emacs and you know some basic commands. It's time to edit your emacs configuration file:

```txt
C-x C-f ~/.emacs.d/init.el
```

Drop in the following [Emacs Lisp](https://www.gnu.org/software/emacs/manual/html_node/eintr/index.html) code:

```elisp
;; Hide UI
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)

;; Better default modes
(electric-pair-mode t)
(show-paren-mode 1)
(setq-default indent-tabs-mode nil)
(save-place-mode t)
(savehist-mode t)
(recentf-mode t)
(global-auto-revert-mode t)

;; Better default settings
(require 'uniquify)
(setq uniquify-buffer-name-style 'forward
      window-resize-pixelwise t
      frame-resize-pixelwise t
      load-prefer-newer t
      backup-by-copying t
      custom-file (expand-file-name "custom.el" user-emacs-directory))
(add-hook 'prog-mode-hook 'display-line-numbers-mode)

;; Refresh package archives (GNU Elpa)
(require 'package)
(unless package-archive-contents
  (package-refresh-contents))
```

I'm not going to walk through each line of code here, you can do that yourself with the built-in Emacs help system. Use `M-x describe-function` or `M-x describe-variable`:

```txt
M-x describe-function menu-bar-mode

M-x describe-variable window-resize-pixelwise
```

Or equivalently,

```txt
C-h f menu-bar-mode

C-h v window-resize-pixelwise
```

It's best to get acquainted with the [Emacs help system](https://www.gnu.org/software/emacs/manual/html_node/emacs/Help.html) and learn how to find help within Emacs itself. Later on you'll install [vertico](https://github.com/minad/vertico) and [marginalia](https://github.com/minad/marginalia), two packages that make navigating the minibuffer for commands (like `M-x`) much more enjoyable.

## Packages

With those settings out of the way, we're going to install some packages. All of these packages are available on the default Emacs package server, [GNU Elpa](http://elpa.gnu.org/). If you'd like to configure alternatives, like MELPA, consult [the docs](https://melpa.org/#/getting-started).

```elisp
;; Great looking theme
(use-package modus-themes
  :ensure t
  :init
  (modus-themes-load-themes)
  :config
  (modus-themes-load-vivendi))

;; Code completion at point
(use-package company
  :ensure t
  :hook (after-init . global-company-mode)
  :custom
  (company-idle-delay 0))

;; Better minibuffer completion
(use-package vertico
  :ensure t
  :custom
  (vertico-cycle t)
  (read-buffer-completion-ignore-case t)
  (read-file-name-completion-ignore-case t)
  (completion-styles '(basic substring partial-completion flex))
  :init
  (vertico-mode))

;; Save minibuffer results
(use-package savehist
  :init
  (savehist-mode))

;; Show lots of useful stuff in the minibuffer
(use-package marginalia
  :after vertico
  :ensure t
  :init
  (marginalia-mode))
```

## Next steps

Save your configuration file, close and re-open Emacs. Time to experiment!

If you have an LSP server already installed, e.g. solargraph for Ruby, browse to a source file and activate [eglot](https://joaotavora.github.io/eglot/) with `M-x eglot`. You can ensure this happens automatically by adding an `eglot-ensure` hook to your Emacs configuration:

```elisp
(use-package eglot
  :ensure t
  :hook (ruby-mode . eglot-ensure))
```

From here, it's really up to you to explore and learn on your own. Here are some suggestions to help you along:

- Read about [Basic Editing Commands](https://www.gnu.org/software/emacs/manual/html_node/emacs/Basic.html)
- Read about [Working with Projects](https://www.gnu.org/software/emacs/manual/html_node/emacs/Projects.html)
- Read about [Dired, the Directory Editor](https://www.gnu.org/software/emacs/manual/html_node/emacs/Dired.html)
- Browse my other [Emacs posts](https://www.mgmarlow.com/tags/emacs/)
- Check out Mickey Peterson's [Mastering Emacs](https://www.masteringemacs.org/)
