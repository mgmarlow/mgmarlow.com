---
title: 'New Emacs Package: store-git-link'
date: 2023-04-29
updated: 2024-03-07
tags: emacs
---

Today I released an open source Emacs package:
[git-share](https://github.com/mgmarlow/git-share/).

This is my first real attempt at a proper Emacs package, bringing together some
scattered elisp scripts I had in my config into a complete, unit-tested whole. I
use this command just about every working day to send code links to colleagues
across our different git repositories.

With Emacs 29 it's easy to install the package straight from the repository. Add
these lines to your Emacs config:

```elisp
(unless (package-installed-p 'git-share)
  (package-vc-install "https://github.com/mgmarlow/git-share"))
```

Invoke `M-x git-share` when your Emacs point is positioned on a line of code
you'd like to share and the link will be copied (killed) to your system's
clipboard.

## Tips and Tricks

Here are some tips I stumbled on when building this package:

1. You can generate the comment boilerplate for your Emacs package with
   `M-x auto-insert`. It prompts you for a description and some tags, then fills
   in the requisite copyright notice, author fields, and other structural
   comments for your package. More info:
   [Conventional Headers for Emacs Libraries](https://www.gnu.org/software/emacs/manual/html_node/elisp/Library-Headers.html).
2. Unit testing with
   [ERT](https://www.gnu.org/software/emacs/manual/html_mono/ert.html) is really
   straightforward. I use
   [this Makefile](https://github.com/mgmarlow/git-share/tree/main/item/Makefile)
   to run the test suite against the compiled (`.elc`) package.
3. When browsing for functions with `C-h f` it's easy to accidentally include
   ones that aren't shipped with Emacs, but are autoloaded by other packages
   (notably in my case, string helpers from
   [s.el](https://github.com/magnars/s.el)). Using ERT batch testing helped me
   find these problems since it works against the vanilla Emacs install.
4. Read the
   [Emacs Lisp Coding Conventions](https://www.gnu.org/software/emacs/manual/html_node/elisp/Coding-Conventions.html).
5. Even if you're not contributing to MELPA, their
   [contributing guidelines](https://github.com/melpa/melpa/blob/master/CONTRIBUTING.org)
   are a great source of tips.
