---
title: A Note-taking System for Work
date: 2023-04-04
tags: emacs
---

Keeping a code journal has been a gratifying way to measure my professional growth and keep track of esoteric information. Over the years I've experimented with [tons of different methods](/words/2023-03-21-burn-after-writing), but code notes are trickier than word notes and are constrained to a digital environment.

Daily entries are too sparse to be useful, spreading information in a way that is irrecoverable without a tagging nightmare. Zettelkasten-style is too nit-picky, exhausting too much of my time in organization and placement. I've settled on a nice middle ground: a weekly coding scratchpad with backlinks to longer-form reference material.

Emacs is a great tool for coding notes in particular, thanks to the [literate programming](https://en.wikipedia.org/wiki/Literate_programming) environment [org-mode babel](https://orgmode.org/worg/org-contrib/babel/intro.html). The same [org file](https://orgmode.org/) that contains my todos also serves as a dynamic code environment, turning code snippets into executable scripts. Linking between notes is also easily supported with a lightweight package like [denote](https://protesilaos.com/emacs/denote).

Together these tools are powerful but not overwhelming. Denote handles naming conventions for my files so I don't need to think about consistency or placement; org-mode handles markup, tagging, code execution, and todos.

It's also very easy to extend. Here's the Emacs command I use to generate my weekly scratchpad, along with its template:

```elisp
(require 'denote)

(defun my/denote--weekly-template ()
  (concat "* Friday"
          "\n\n"
          "- [ ] Retrospective\n"
          "\n"
          "* Thursday"
          "\n\n"
          "* Wednesday"
          "\n\n"
          "* Tuesday"
          "\n\n"
          "* Monday"
          "\n\n"
          "* Notes"))

(setq denote-templates `((weekly . ,(my/denote--weekly-template))))

(defun my/denote-weekly ()
  "Find or create a weekly journal entry."
  (interactive)
  (let* ((display-time (format-time-string "%G-%U" (current-time)))
         (title (concat "week-" display-time))
         (pattern (concat ".*--" title))
         (matches (denote-directory-files-matching-regexp pattern)))
    (if matches
        (find-file (car matches))
      (denote title '("journal" "weekly") 'org nil nil 'weekly))))
```

Calling the command `my/denote-weekly` in Emacs will either (a) create a new denote file with the title "week-YYYY-ww" and the appropriate tags, or (b) open the existing denote file if one was already created.

The org files themselves end up looking something like this:

```txt
#+title:      week-2023-01
#+date:       [2023-01-02 Mon 08:02]
#+filetags:   :journal:weekly:
#+identifier: 20230101T080211

* Friday...
* TODO Thursday

- [X] Already done!
- [ ] Cool coding stuff here

** Testing scripts for something

#+begin_src elisp
  (message "I was executed with org-babel-execute-src-block!")
#+end_src

#+RESULTS:
: I was executed with org-babel-execute-src-block!
```

Occasionally I'll need to convert from org to markdown to copy something from my notes into a work document or task. Calling `org-md-export-as-markdown` opens up a new buffer with the entire contents of my weekly note in markdown, ready for copy+paste.

Org itself is [rich with features](https://orgmode.org/features.html) but the real game-changer for me is the ability to paste code links from disc into an org file (via `org-store-link`). Clicking the link will open the source file in Emacs at the line of code where the link was stored. I used to rely on a similar workflow by linking to Github (via a custom [Emacs command](https://github.com/mgmarlow/.emacs.d/blob/master/lisp/store-code-link.el)), but linking to local files within Emacs is way better for browsing, editing, and note-taking.

As far as retrieval goes, denote timestamps notes on creation so they're neatly organized in a flat directory:

```txt
~/denote/
  20230102T080211--week-2023-01__journal_weekly.org
  20221228T091238--week-2022-52__journal_weekly.org
  20221221T083238--week-2022-51__journal_weekly.org
  20221223T113238--active-record-tips__rails.org
  ...
```

And since org files are plaintext, you can use org-mode, Emacs, or grep to search through their contents. Check out [Advanced searching](https://orgmode.org/worg/org-tutorials/advanced-searching.html) in the org-mode documentation to see what's possible.
