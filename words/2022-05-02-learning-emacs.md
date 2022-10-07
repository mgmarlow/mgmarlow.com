---
title: Emacs from scratch
date: 2022-05-08
updated_at: 2022-09-19
---

**Edit**

Four months after writing this article and I'm still using Emacs full-time with my own, custom configuration. I continue to find great pleasure in extending my setup with small snippets I stumble upon from Emacs hackers far wiser than myself. Those tweaks aside, my [current configuration](https://github.com/mgmarlow/dotfiles/blob/master/.emacs.d/init.el) is mostly stable.

I maintain the opinion that creating your own Emacs configuration is not nearly as daunting as is often presented. With a few tweaks to the base defaults (technomancy's [better-defaults](https://git.sr.ht/~technomancy/better-defaults) is a great place to start) you can be up-and-running with an editor that looks and feels far closer to modern alternatives. A few packages later and you're well on your way to Emacs nirvana.

For those of you who have decided to build your own configuration from scratch: enjoy the process! The greatest thing about Emacs is the satisfaction of building a tool to suit your preferences. I hope this article helps you on that journey.

**Original article**

Like any self-respecting programmer, I often find myself struggling with text editor envy. This time, like the three previous times, the source of that envy is [Emacs](https://www.gnu.org/software/emacs/). All it takes is a stray link to [emacsrocks](https://emacsrocks.com/) and I'm back in that vicious cycle.

Unlike those previous flings, however, I have managed to stick to Emacs with a new level of tenacity. I have even found myself _enjoying_ it.

What has changed is my fundamental approach to learning Emacs. Rather than reaching for a prebuilt distribution, like [doomemacs](https://github.com/doomemacs/doomemacs) or [spacemacs](https://www.spacemacs.org/), I decided to build my own configuration from scratch.

This effort, previously believed insurmountable, was easy and educational. With just a few packages, I managed to match the functionality of my primary text editor. Most importantly, I found myself reaching for Emacs's built-in help system instead of scouring the web, reinforcing my familiarity with the tool and accelerating my proficiency.

Prebuilt distributions are an awesome demonstration of what is possible with Emacs, but I don't think they're a good introduction to the editor. Instead, I think the best way to get started with Emacs is with a minimum-viable configuration. Just enough stuff to bring Emacs up to par with a modern editor and nothing else.

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
C-x C-f ~/.emacs.d/init.el RET
```

This will create a new Emacs Lisp file, `init.el`, in your Emacs configuration directory. Emacs will automatically load this file on startup.

From here, you can go ahead and start making some changes to your editor theme:

```
;; Load a dark mode theme
(load-theme 'deeper-blue t)
```

Although many guides will recommend removing the ugly menu/tool bars at the top of your editor, I think it's a good idea to keep them around until you're more comfortable. They may offend your sensibilities, but they also may prevent burnout caused by forgetting basic editor functions.

That said, if you want to remove them you can do so with the following code:

```
;; Disable menu bar, scroll bar, and tool bar
(menu-bar-mode -1)
(scroll-bar-mode -1)
(tool-bar-mode -1)
```

After saving, you can apply the changes from your configuration file by closing Emacs and re-opening it. Alternatively, you can apply the changes immediately in Emacs by using the command `M-x eval-buffer`.

## Sensible defaults

After you theme Emacs to your liking, there are a few settings that I think offer a substantial improvement over their defaults.

These settings are either sourced from [better-defaults](https://git.sr.ht/~technomancy/better-defaults) and [crafted-emacs](https://github.com/SystemCrafters/crafted-emacs), two great reference configurations, or from tweaking the performance of some compute-heavy packages like [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/performance/).

First up are some performance threshold tweaks that put Emacs more inline with modern editors:

```
(setq gc-cons-threshold 100000000) ; 100 mb
(setq read-process-output-max (* 1024 1024)) ; 1mb
```

The remaining recommendations are more personal in nature. I'd urge you to read about each of these options and decide for yourself whether you'd like to include them. In particular, you may find yourself enjoying the customization user interface that ships with Emacs more than me: [`M-x customize`](https://www.gnu.org/software/emacs/manual/html_node/emacs/Easy-Customization.html).

```
;; Auto-refresh buffers when files on disk change
(global-auto-revert-mode t)

;; Unique buffer names for matching files
(require 'uniquify)
(setq uniquify-buffer-name-style 'forward)

;; Place backups in a separate folder
(setq backup-directory-alist `(("." . "~/.saves")))
(setq auto-save-file-name-transforms `((".*" "~/.saves/" t)))

;;; Emacs customize-option
;; Store automatic customization options in a gitignored file.
(setq custom-file (locate-user-emacs-file "custom.el"))
(when (file-exists-p custom-file)
  (load custom-file))
```

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

There are only two packages that I consider mandatory for a fresh Emacs install and we've already prepared one of them (`use-package`). The other one is [Ivy](https://github.com/abo-abo/swiper), a text completion framework that I find much more usable than the Emacs default.

Add Ivy to your `~/.emacs.d/init.el`:

```
(use-package ivy
  :ensure t     ; Install the package if it isn't already
  :config       ; Execute code after a package is loaded
  (ivy-mode 1)) ; Activate ivy-mode
```

### Ivy

As mentioned previously, Emacs comes packed with useful features. However, finding and remembering these features can be a massive undertaking on its own.

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

I can't help but emphasize how valuable this package is for learning Emacs. Before Ivy, I was constantly referencing an Emacs cheatsheet to remember basic operations. After Ivy, I realized that you only need to remember two things:

1. Execute any Emacs command with `M-x <command>`
2. Discover a keybinding with `M-x where-is RET <command> RET`

As long as you're familiar with basic Emacs terminology (e.g. buffers, windows, and frames) every Emacs command is available to you with a quick search.

### Project.el

> **Edit**: This used to be a section about [Projectile](https://github.com/bbatsov/projectile), a package that provides project navigation utilities to Emacs. Since writing this article, I've actually found the default Emacs package `project.el` to be a completely viable alternative, no extra package needed. YMMV, so definitely check out Projectile if you need more than is provided by `project.el`.

Navigating files with `C-x C-f` is incredibly cumbersome, particularly for large projects. Far better is the Emacs Project framework, [project.el](https://www.gnu.org/software/emacs/manual/html_node/emacs/Projects.html). As long as you have a project that is initialized with `git`, you can easily traverse its files with Ivy and search its contents with grep.

First, open up a project by browsing to a version-controlled file with `C-x C-f`. You'll now be able to use the `project.el` commands to navigate this project:

- `C-x p f`: Visit a file in the current project.
- `C-x p g`: Find matches for a regexp in all files in the current project.

As soon as you've opened a project one time, it'll be available in the project cache. You can browse any previously-visited projects on your system with `C-x p p`.

## Next steps

With `use-package`, `Ivy`, and the basics of `project.el` under your fingertips, you're ready to explore the rest that Emacs has to offer. Here are a few branching points that I would suggest based on your goals.

- If you want your Emacs experience to have IDE-like code-completion, look into [company-mode](https://company-mode.github.io/) and [lsp-mode](https://emacs-lsp.github.io/lsp-mode/).
- If you want to be amazed by one of the best git interfaces in the world of text editors, dive into [Magit](https://magit.vc/).
- If you're interested in [org-mode](https://orgmode.org/) and follow the Zettelkasten hype train, read all about [org-roam](https://www.orgroam.com/).

Outside of new packages, I also recommend reading open source Emacs configurations out in the wild. Here are a few projects to take inspiration from:

- Technomancy's [Better defaults](https://git.sr.ht/~technomancy/better-defaults)
- System Crafter's [Crafted Emacs](https://github.com/SystemCrafters/crafted-emacs/)

Welcome to your new Emacs journey. I hope that like me you find Emacs to be both an incredible tool and an incredible joy to extend.
