---
title: Deno + Tree Sitter + Emacs
date: 2023-08-31
tags: emacs
---

I've been spending a bunch of time fiddling with Deno lately, mostly in the form
of small scripts and [Fresh projects](https://fresh.deno.dev/). One thing that
hasn't impressed me doesn't have anything to do with Deno itself but rather the
tooling around it: setting up Deno with Emacs is a little cumbersome. The
problem roots to Deno and TypeScript sharing a file extension (`.ts`). While
this doesn't cause issue for syntax highlighting (since it's the same for both
languages), it does cause issue when picking an appropriate language server.
Since Emacs generally uses file extensions to associate languages and
functionality it's a bit awkward to have Emacs pick the right LSP program.

For individual projects you can use
[Directory Variables](https://www.gnu.org/software/emacs/manual/html_node/emacs/Directory-Variables.html)
to override Eglot settings just for that directory, telling Eglot that it
belongs to a Deno project and not a regular TypeScript project. This approach
gets old fast, I don't want to have to create a `dir-locals.el` file just to get
my Deno tooling working.

This lead me to hacking together some Deno project detection into my Emacs
configuration. Basically, if Emacs is in a project (that is, a
version-controlled folder) and finds a `deno.json` file, Eglot will select the
Deno language server instead of the TypeScript language server. In all other
cases, it defaults to TypeScript.

```elisp
(defun deno-ts-project-p ()
  (when-let* ((project (project-current))
              (p-root (project-root project)))
    (file-exists-p (concat p-root "deno.json"))))

(defun ts-server-program (&rest _)
  (cond ((deno-project-p) '("deno" "lsp" :initializationOptions
                                         (:enable t :lint t)))
         (t '("typescript-language-server" "--stdio"))))

(add-to-list 'eglot-server-programs '(web-mode . ts-server-program))
```

This technique works great, provided you always version control your Deno
projects. Emacs 29 introduces a new variable that we can use to improve project
detection for Deno, relying solely on the presence of a `deno.json` file:

```elisp
(add-to-list 'project-vc-extra-root-markers "deno.json")
```

These changes got me thinking, why not create a major mode for Deno? That way
all of these configuration options could be shipped with the major mode and
Emacs would inform the user in their mode-line whether they're working in a
TypeScript project or a Deno project. Moreover, since we're already using Emacs
29 features, what if that major mode was built on tree-sitter? It's a great
excuse for finally trying that library out. And so I set out to build
`deno-ts-mode`.

Setting up tree-sitter requires a few extra steps. Firstly, you need
[Emacs 29.1](https://www.gnu.org/software/emacs/download.html) (the most recent
release) installed. Secondly, you must compile
[parsers](https://tree-sitter.github.io/tree-sitter/using-parsers) for each
language you want to use. For Deno, that means a TypeScript parser and a TSX
parser.

Assuming `cc` is available on your system, you can install both parsers with
this script:

```elisp
(setq treesit-language-source-alist
      '((typescript "https://github.com/tree-sitter/tree-sitter-typescript" "master" "typescript/src")
        (tsx "https://github.com/tree-sitter/tree-sitter-typescript" "master" "tsx/src")))

(mapc #'treesit-install-language-grammar (mapcar #'car treesit-language-source-alist))
```

The parsers are installed to your Emacs user directory as DLLs. You can test
that everything installed correctly by trying out `typescript-ts-mode`.

With tree-sitter good to go, let's create a new major mode for Deno that's based
on the TypeScript tree-sitter mode:

```elisp
(define-derived-mode deno-ts-mode
  typescript-ts-mode "Deno"
  "Major mode for Deno."
  :group 'deno-ts-mode)
```

At this stage, `deno-ts-mode` is near identical to `typescript-ts-mode`. The
only difference is that Deno shows up in your mode-line when `deno-ts-mode` is
activated, all syntax highlighting is inherited from `typescript-ts-mode`.

The next step is to figure out whether a visited `.ts` file should use our new
Deno mode or the TypeScript mode. For this we can use our earlier function,
`deno-project-p`, and apply it to `auto-mode-alist`, the association list
mapping file extensions to major modes. Since `auto-mode-alist` accepts a
function, we can create a couple of wrappers around the two major modes in
question to resolve based on the result of `deno-project-p`:

```elisp
(defun deno-ts--ts-auto-mode ()
  (cond ((deno-ts-project-p) (deno-ts-mode))
        (t (typescript-ts-mode))))

(defun deno-ts--tsx-auto-mode ()
  (cond ((deno-ts-project-p) (deno-ts-mode))
        (t (tsx-ts-mode))))

(add-to-list 'auto-mode-alist '("\\.ts\\'" . deno-ts--ts-auto-mode))
(add-to-list 'auto-mode-alist '("\\.tsx\\'" . deno-ts--tsx-auto-mode))
```

When visiting a `.ts` or `.tsx` file, Emacs will smartly select either
`deno-ts-mode` or `typescript-ts-mode` (or TSX) based on the presence of a
`deno.json` file. Pretty great!

This simplifies our Eglot setup considerably, since there's no need to check
`deno-project-p`. The major mode has solved that already!

```elisp
(use-package eglot
  :ensure t
  :hook ((deno-ts-mode . eglot-ensure))
  :config
  (add-to-list 'eglot-server-programs
               '(deno-ts-mode . ("deno" "lsp" :initializationOptions
                                              (:enable t :lint t)))))
```

These features plus a few more (task automation, accepting `deno.json` and
`deno.jsonc`) are all available in my package
[deno-ts-mode](https://git.sr.ht/~mgmarlow/deno-ts-mode). Give it a try and let
me know what you think!
