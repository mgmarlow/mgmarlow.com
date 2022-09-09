---
title: Emacs from scratch
date: 2022-05-08
---

Like any self-respecting programmer, I often find myself struggling with text editor envy. This time, like the three previous times, the source of that envy is [Emacs](https://www.gnu.org/software/emacs/). All it takes is a stray link to [emacsrocks](https://emacsrocks.com/) and I'm back in that vicious cycle.

Unlike those previous flings, however, I have managed to stick to Emacs with a new level of tenacity. I have even found myself _enjoying_ it.

What has changed is my fundamental approach to learning Emacs. Rather than reaching for a prebuilt distribution, like [doomemacs](https://github.com/doomemacs/doomemacs) or [spacemacs](https://www.spacemacs.org/), I decided to build my own configuration from scratch.

This effort, previously believed insurmountable, was easy and educational. With just a few packages, I managed to match the functionality of my primary text editor. Most importantly, I found myself reaching for Emacs's built-in help system instead of scouring the web, reinforcing my familiarity with the tool and accelerating my proficiency.

Prebuilt distributions are an awesome demonstration of what is possible with Emacs, but I don't think they're a good introduction to the editor. Instead, I think the best way to get started with Emacs is with a minimum-viable configuration. Just enough stuff to bring Emacs up-to-par with a modern editor and nothing else.

Follow along with the rest of this article and you'll have your own, very capable Emacs ready for experimentation.

## First steps

After [downloading Emacs](https://www.gnu.org/software/emacs/), I recommend running through the built-in tutorial ([also available on the web](https://www.gnu.org/software/emacs/tour/)). Some basic knowledge of Emacs keybindings will help make the rest of this guide easier to follow.

If looking at the default Emacs theme is too much to bear, swap to one of the dark-mode themes:

```
M-x load-theme RET deeper-blue RET
```

> Remember: `C-<chr>` means hold the Control key while typing the character `<chr>`. `M-<chr>` means hold the Meta key (Alt on Windows) and pressing `<chr>`. (Emacs tutorial)

## Rebind caps lock to control

One thing you'll quickly notice from the tutorial, if you weren't already aware of [Emacs pinky](https://en.wikipedia.org/wiki/Emacs#Emacs_pinky), is that pressing Control all of the time can get pretty taxing on your wrist. RSI is no joke! Take care of those wrists.

Rebind your Caps Lock key to Control and never look back.

Instructions: [MacOS](https://stackoverflow.com/questions/15435253/how-to-remap-the-caps-lock-key-to-control-in-os-x-10-8), [Windows 10](https://gist.github.com/joshschmelzle/5e88dabc71014d7427ff01bca3fed33d)

## Start your configuration

All of your Emacs files will go into `.emacs.d`, so go ahead and create a new directory:

```
# Cool stuff goes in here
mkdir ~/.emacs.d/
```

Back in Emacs, make a new file with `M-x find-file`, or the following keybinding:

```
C-x C-f ~/.emacs.d/init.el RET`
```

This will create a new Emacs Lisp file `init.el` in your Emacs configuration directory. Emacs will automatically load this file on startup.

From here, you can go ahead and start making some changes to your editor theme:

```
;; Load a dark mode theme
(load-theme 'deeper-blue t)

;; Disable menu bar, scroll bar, and tool bar for a
;; nice, minimalist UI. Totally optional.
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)
```

I recommend keeping around the startup screen for now, since it has a nice and accessible link to the tutorial.

After saving, you can apply the changes from your configuration file by closing Emacs and re-opening it. Alternatively, you can apply the changes immediately in Emacs by using the command `M-x eval-buffer`.

## Get ready for packages

As demonstrated through the tutorial, Emacs ships with a bunch of useful editing features. That said, there are a few third-party tools that greatly improve the overall experience, especially when getting started. These tools are available in the form of Emacs Lisp packages.

By default, Emacs comes with a curated package registry in the form of [GNU Elpa](http://elpa.gnu.org/). You'll want to extend this default list of packages with those from a larger, also curated list called [MELPA](https://melpa.org/).

Add the following lines to your `~/.emacs.d/init.el`:

```
;; You'll be installing your packages with the
;; built-in package.el script
(require 'package)

;; Add MELPA to your list of package archives
(add-to-list 'package-archives
	         '("melpa" . "https://melpa.org/packages/"))

(package-initialize)

;; Go ahead and refresh your package list to
;; make sure everything is up-to-date
(unless package-archive-contents
  (package-refresh-contents))
```

## Install your first package

With MELPA ready to go, it's time to install your first package. Add the following to your `~/.emacs.d/init.el`.

```
(unless (package-installed-p 'use-package)
  (package-install 'use-package))
```

[`use-package`](https://github.com/jwiegley/use-package) is a very deliberate first install, as you'll use it instead of `package-install` to install all of your other packages.

Why not just keep installing packages with `(package-install)`? The reason has to do with the configuration that you'll add to the packages after you install them.

Although you could manage your key bindings, mappings, custom variables, and hooks on your own, `use-package` bundles all of those configuration settings into a convenient and well-organized API. Overall, it will make it easier to install new packages and keep your `init.el` file organized.

## Time for the good stuff

With some basic configuration out of the way and `use-package` ready to go, it's time to start extending Emacs.

I've narrowed down the list of mandatory packages to just two:

- [Ivy](https://github.com/abo-abo/swiper): text completion that's way better than the Emacs default
- [Projectile](https://projectile.mx/): project directory management and navigation

Add these two packages to your `~/.emacs.d/init.el`:

```
(use-package ivy
  :ensure t
  :config
  (ivy-mode 1))

(use-package projectile
  :ensure t
  :init
  (projectile-mode +1)
  :bind (:map projectile-mode-map
              ("s-p" . projectile-command-map)))
```

### Ivy

As mentioned previously, Emacs comes packed with useful features. However, finding and remembering these features can be a massive undertaking in its own regard.

Ivy helps alleviate this issue by fundamentally changing the way that Emacs text completion works. When text completion activates, e.g. when executing a command with `M-x`, Ivy shows you all possible matches immediately in a mini-buffer.

For example, searching for "find file" commands:

```
74 M-x find file
projectile-find-file-other-window
projectile--find-file
dired-find-file-other-window
...
```

Rather than needing to remember exact function names or struggle with tab-based completion, Ivy gives immediate feedback as you search through your available Emacs commands.

I can't help but underscore how valuable this package is for learning Emacs. Before Ivy, I was constantly referencing an Emacs cheatsheet to remember basic operations. After Ivy, I realized that you only need to remember two things:

1. Execute any Emacs command with `M-x <command>`
2. Discover a keybinding with `M-x where-is RET <command> RET`

As long as you're familiar with basic Emacs terminology (e.g. buffers, windows, and frames) every Emacs command is available to you with a quick search.

### Projectile

> **Edit**: Since writing this article, I have swapped over to [project.el](https://github.com/emacs-mirror/emacs/blob/master/lisp/progmodes/project.el) instead of Projectile since it ships with Emacs 26+ and covers all of my needs. If you need something more featureful, Projectile is still a great option. Otherwise, learn how to use project.el with `C-x p C-h` or the [manual](https://www.gnu.org/software/emacs/manual/html_node/emacs/Projects.html).

Even with Ivy, navigating between files in a project can be a bit cumbersome if you're only using `M-x find-file`. Projectile solves this problem by giving you a ton of new tools built around a project directory.

A project in projectile parlance is basically just a directory that is version controlled. Once you open up a project with `S-p p <project path>`, projectile provides you with a bunch of commands to help navigate that project.

I find myself using the following commands most often:

- `S-p f`: find file in project
- `S-p s g`: search for a given term in every file in your project

## Honorable mentions

I hope this minimal configuration helps kickstart your Emacs journey like it did mine.

By design I've left off a ton of useful packages and settings that you may eventually want to add to your own configuration. Among these are some honorable mentions that serve as great next steps:

- [Magit](https://magit.vc/): fully-featured git interface
- [lsp-mode](https://emacs-lsp.github.io/lsp-mode/): LSP for Emacs
- [company-mode](https://company-mode.github.io/): code completion framework

Check out my full configuration here: [dotfiles/init.el](https://github.com/mgmarlow/dotfiles/blob/master/.emacs.d/init.el).
