---
title: Building a Flymake Backend for Clippy
date: 2023-06-19
tags: emacs
---

Last weekend I had a great time building my own Flymake backend for Clippy (the Rust linter): [`flymake-clippy`](https://github.com/mgmarlow/flymake-clippy/). If you haven't heard of Flymake, it's old-school Emacs tech for showing squiggly-lines in your editor. You can build your own Flymake extensions by creating a function, referred to as a backend, that collects diagnostics and reports them to Flymake. Register that backend in your Emacs config and you've got squiggles whenever you open up a Rust file. Pretty cool!

`flymake-clippy` is an extension of the [annotated example](https://www.gnu.org/software/emacs/manual/html_mono/flymake.html#An-annotated-example-backend) found in the Emacs Manual. While the example serves as a great starting point, I found that in practice it leaves too many details unexplained. Most of my development time was spent looking through the Emacs documentation, learning about regular expression match groups, external processes, and buffer searching. There were also some surprises when trying to integrate `flymake-clippy` with Eglot, the LSP package that now ships with Emacs.

## How does it work?

With Flymake mode active, each backend function included in the variable `flymake-diagnostic-functions` is called on the current Emacs buffer. When the `flymake-clippy` backend is invoked, the following things happen in sequence:

1. `cargo clippy` is called and its output is thrown into a temporary buffer (`*flymake-clippy*`)
2. A [process sentinel](https://www.gnu.org/software/emacs/manual/html_node/elisp/Sentinels.html) is triggered, invoking a callback that parses the contents of that temporary buffer and collects diagnostic information into a list
3. That list of diagnostics is sent to Flymake via another callback function
4. The temporary buffer and process are cleaned up

These steps are repeated many times throughout the lifecycle of a single buffer, creating and destroying squiggles as problems are introduced or addressed.

## Code walkthrough

In a bit more detail, the first step is to create a process:

```elisp
(make-process
 :name "flymake-clippy" :noquery t :connection-type 'pipe
 :buffer (generate-new-buffer "*flymake-clippy*")
 :command '("cargo" "clippy")
 :sentinel
 (lambda (proc _event)
   (when (memq (process-status proc) '(exit signal))
     ...)))
```

This process runs the command `cargo clippy`, our linter, and pipes its output into the buffer `*flymake-clippy*` (named via the call to `generate-new-buffer`). While that process is active, several events are sent to the sentinel, invoking its respective lambda. `flymake-clippy` only cares about the `exit` or `signal` events, which are checked via `process-status`. All other events are ignored.

The core of `flymake-clippy` lives in the rest of that lambda function:

```elisp
(lambda (proc _event)
  ;; ... snip ...
  (with-current-buffer (process-buffer proc)
    (goto-char (point-min))
    (cl-loop
     while (search-forward-regexp
            (flymake-clippy--build-regexp)
            nil t)
     for msg = (match-string 1)
     for sourcefile = (match-string 2)
     for (beg . end) = (flymake-diag-region
                        source
                        (string-to-number (match-string 3)))
     for type = (if (string-match "^warning" msg)
                     :warning
                   :error)
     when (and sourcefile (string-match-p sourcefile filename))
     collect (flymake-make-diagnostic source beg end type msg)
     into diags
     finally (funcall report-fn diags)))
  (kill-buffer (process-buffer proc)))
```

This code is pretty dense but most of it is facilitating a loop through the `*flymake-clippy*` buffer and parsing the Clippy output into variables. `cl-loop` is a powerhouse looping macro that actually comes from [Common Lisp](https://gigamonkeys.com/book/loop-for-black-belts.html). It's accessible in Emacs through the library `cl-lib`, a compatibility library that brings a bunch of Common Lisp functions/macros into Emacs Lisp.

The `while` keyword has this code searching via a regular expression, looking for matches that are transformed into Flymake diagnostic output.

The regular expression for `flymake-clippy` looks something like this:

```elisp
"^\\(warning:.*\\)\n.*--> \\(.*\\):\\([0-9]+\\):\\([0-9]+\\)$"
```

Matching text like:

```txt
warning: using `clone` on type `Status` which implements the `Copy` trait
  --> src/foo.rs:31:29
```

At the core of the regexp are four match groups:

1. The message, prefixed with "warning:"
2. The file, prefixed with "-->"
3. The line number
4. The column number

Each one of these match groups is assigned to a variable in `cl-loop` via the `match-string` function, grabbing match data from the most recent regular expression. Most of these variables are handed off to Flymake as-is, with the exception of line number. Clippy's line number needs a little translation (via `flymake-diag-region`) so it's useful in a buffer context.

Since Clippy runs against the entire Cargo project and not just a single file, I also include a `when` expression to compare the open buffer filename against the filename match group. Otherwise, messages from other files will show up in the diagnostics.

With the `collect` keyword, `cl-loop` collects the diagnostic variables into a list of Flymake data structures. These data structures are handed off to Flymake via the callback: `(funcall report-fn diags)`.

## Testing regular expressions

I found it much easier to iterate on a regular expression by writing tests rather than manually executing Emacs commands, so I used [ERT](https://www.gnu.org/software/emacs/manual/html_mono/ert.html) to run the regular expression against a temporary buffer of Clippy output:

```elisp
(require 'flymake-clippy)
(require 'ert)

(defun run-regexp ()
  ;; Reset regexp match data
  (set-match-data nil)
  (search-forward-regexp (flymake-clippy--build-regexp) nil t)
  (list (match-string 1)
        (match-string 2)
        (match-string 3)))

(ert-deftest clippy-test-regexp ()
  "Tests regexp matches diagnostic information."
  (should
   (equal
    ;; Open a temp buffer with the contents of a test
    ;; fixture that contains Clippy output
    (with-temp-buffer
      (insert-file-contents "./test/fixture.txt")
      (run-regexp))
    '("warning: unused variable: `user`" "src/database/foo.rs" "42"))))
```

This file is also a good demonstration of the regular expression match groups that are passed into `flymake-make-diagnostic`.

## Working with Eglot

I ran into a few surprises setting up `flymake-clippy` and Eglot in my configuration. It turns out that Eglot hijacks Flymake, suppressing all other Flymake backends while Eglot is running. This isn't an issue with Eglot per se, but a design decision (see [eglot#268](https://github.com/joaotavora/eglot/issues/268)); Eglot uses Flymake to demonstrate LSP diagnostics and suppresses other backends to avoid duplicate messages.

There is a workaround that I use in my configuration that allows Clippy and Eglot to coexist:

```elisp
(use-package flymake-clippy
  :vc (:fetcher sourcehut :repo mgmarlow/flymake-clippy)
  :hook (rust-mode . flymake-clippy-setup-backend))

(defun manually-activate-flymake ()
  (add-hook 'flymake-diagnostic-functions #'eglot-flymake-backend nil t)
  (flymake-mode 1))

(use-package eglot
  :ensure t
  :hook ((rust-mode . eglot-ensure)
         (eglot--managed-mode . manually-activate-flymake))
  :config
  (add-to-list 'eglot-stay-out-of 'flymake))
```

`eglot-stay-out-of` disables Eglot's control over Flymake. This opens up the possibility of running other Flymake backends in a buffer with Eglot, but also removes Eglot's backend from the `flymake-diagnostic-functions` list. It's important to add `eglot-flymake-backend` back to that list, as well as manually activate it during `eglot--managed-mode`.

## Flymake vs. Flycheck

Those in the know may be wondering why I built a Flymake backend instead of one for [Flycheck](https://www.flycheck.org/en/latest/index.html). The two libraries are now very similar, though in past Emacs releases they deviated substantially.

Flymake is the older of the two (since Emacs 22) and is included in Emacs as a built-in package. There was a period of time between Emacs 22 and 27 where Flymake was not receiving much love and attention, languishing with some long-standing issues. Flycheck rose during this time as a drop-in replacement.

Nowadays, thanks to the efforts of Eglot author João Távora, Flymake and Flycheck are on mostly equal footing. I chose Flymake simply because it's built into Emacs and I didn't want to introduce a new dependency. That said, [Flycheck vs. Flymake](https://www.flycheck.org/en/latest/user/flycheck-versus-flymake.html) discusses the pros and cons in more detail.

## flymake-clippy

If you want to see Clippy warnings in your Rust buffers, check out [flymake-clippy](https://github.com/mgmarlow/flymake-clippy/). Refer to the [README](https://github.com/mgmarlow/flymake-clippy/tree/main/item/README.md) for setup instructions.
