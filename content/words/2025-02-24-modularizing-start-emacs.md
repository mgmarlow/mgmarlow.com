---
title: Modularizing Start Emacs
date: 2025-02-24
description: |
  How to modularize your Emacs Init File with Start Emacs.
tags: emacs
---

Some folks don't want their entire Emacs configuration to live in a single,
thousand-line file. Instead, they break their config into separate modules that
each describe a small slice of functionality. Here's how you can achieve this
with [Start Emacs](https://github.com/mgmarlow/start-emacs).

## Step one: load your custom lisp directory

Emacs searches for Emacs Lisp code in the
[Emacs load path](https://www.gnu.org/software/emacs/manual/html_node/emacs/Lisp-Libraries.html#Lisp-Libraries).
By default, Emacs only looks in two places:

- `/path/to/emacs/<version>/lisp/`, which contains the standard modules that
  ship with Emacs
- `~/.emacs.d/elpa/`, which contains packages installed via `package-install`

Neither of these places are suitable for your custom lisp code.

I prefer to have my custom lisp code live within `~/.emacs.d/`, since I version
control my entire Emacs configuration as a single repository. Start Emacs adds
`~/.emacs.d/lisp/` to the load path with this line in `init.el` (the
[Init File](https://www.gnu.org/software/emacs/manual/html_node/emacs/Init-File.html)):

```elisp
(add-to-list 'load-path (expand-file-name "lisp" user-emacs-directory))
```

Where `user-emacs-directory` points to `~/.emacs.d/`, or wherever it may live on
your machine.

The rest of this guide assumes your load path accepts `~/.emacs.d/lisp/`, but
feel free to swap out this path for your preferred location.

## Step two: write your module

Next we'll create a module file that adds
[evil-mode](https://github.com/emacs-evil/evil) with a few configurations and
extensions.

Create the file `evil-module.el` in your `~/.emacs.d/lisp/` directory. Open it
up in Emacs and use `M-x auto-insert` to fill a bunch of boilerplate Emacs Lisp
content. You can either quickly `RET` through the prompts or fill them out.
Note: to end the "Keywords" prompt you need to use `M-RET` instead to signal the
end of a multiple-selection.

Your `evil-module.el` file should now look something like this:

```elisp
;;; evil-module.el ---      -*- lexical-binding: t; -*-

;; Copyright (C) 2025

;; Author:
;; Keywords:

;; This program is free software; you can redistribute it and/or modify
;; it under the terms of the GNU General Public License as published by
;; the Free Software Foundation, either version 3 of the License, or
;; (at your option) any later version.

;; This program is distributed in the hope that it will be useful,
;; but WITHOUT ANY WARRANTY; without even the implied warranty of
;; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;; GNU General Public License for more details.

;; You should have received a copy of the GNU General Public License
;; along with this program.  If not, see <https://www.gnu.org/licenses/>.

;;; Commentary:

;;

;;; Code:

(provide 'evil-module)
;;; evil-module.el ends here
```

Most of these comments aren't relevant for your custom lisp module but they're
good to have in case you ever want to share your code as an Emacs Lisp package.
The single line of Emacs Lisp code, `(provide 'evil-module)`, is the most
important part of the template. It denotes `'evil-module` as a
[named feature](https://www.gnu.org/software/emacs/manual/html_node/elisp/Named-Features.html),
allowing us to import it into our Init File.

Since we're building an evil-mode module, I'll add my preferred Evil defaults to
the file:

```elisp
;;; Commentary:

;; Extensions for evil-mode

;;; Code:

(use-package evil
  :ensure t
  :init
  (setq evil-want-integration t)
  (setq evil-want-keybinding nil)
  :config
  (evil-mode))

(use-package evil-collection
  :ensure t
  :after evil
  :config
  (evil-collection-init))

(use-package evil-escape
  :ensure t
  :after evil
  :config
  (setq evil-escape-key-sequence "jj")
  (setq evil-escape-delay 0.2)
  ;; Prevent "jj" from escaping any mode other than insert-mode.
  (setq evil-escape-inhibit-functions
        (list (lambda () (not (evil-insert-state-p)))))
  (evil-escape-mode))

(provide 'evil-module)
;;; evil-module.el ends here
```

## Step three: require your module

Back in our Init File, we need to signal for Emacs to load our new module
automatically. After the spot where we amended the Emacs load path, go ahead and
require `'evil-module`:

```elisp
;; init.el
;; ...
(add-to-list 'load-path (expand-file-name "lisp" user-emacs-directory))

(require 'evil-module)
```

Reboot Emacs and your module is ready to go!
