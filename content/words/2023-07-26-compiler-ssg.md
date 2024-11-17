---
title: Building a Compiler for My Static Site Generator
date: 2023-07-26
tags: emacs
---

My side project has exploded in scope. My original goal was to build a static
site generator to learn how they work, not to support lots of features. Yet here
I am building a compiler for my own template language.

Before the compiler, I had a very simple model for handling templates focused
around variable replacement. That is, given some
[mustache expression](https://mustache.github.io/), replace the requested
variable with one from the parent environment.

{% raw %}

```elisp
;; An example from Orgify's test suite
(assert-compile-to-string
  :input    "Hello, {{ name }}!"
  :expected "Hello, world!"
  :env      '((name . "world"))
```

{% endraw %}

Originally I had implemented these substitutions via search and replace,
something Emacs is adept at. It looked something like this:

{% raw %}

```elisp
(defun parse-handlebars (handlebars)
  (string-trim (substring handlebars 2 (- (length handlebars) 2))))

(defun search-and-replace-handlebars (env)
  (while (re-search-forward "{{[ ]*[a-z]*[ ]*}}" nil t)
    (let ((expr (save-match-data
                  (and (match-string 0)
                       (parse-handlebars (match-string 0))))))
      (unless (alist-get expr env)
        (error (concat "Unrecognized variable: " (match-string 0))))
      (replace-match (alist-get expr env)))))
```

{% endraw %}

I was happy with this solution because it solved variable replacement in a super
simple, Emacs-y way. I soon learned, however, that this method is very difficult
to extend. It expects too many assumptions:

- The code operates within the context of a single buffer
- Expressions are not multi-line
- Expressions are always immediately replaced
- The content of an expression is always a value from an alist (association
  list)

With this in mind, I ditched the prior code in favor of a more traditional,
compiler-driven approach. The new Orgify template language goes through the
usual tokenize, parse, and generate cycle. The result resembles
[Handlebars](https://handlebarsjs.com/), but with the added ability to execute
Emacs Lisp expressions.

{% raw %}

```elisp
;; You can include any Emacs Lisp code in mustache templates:
(assert-compile-to-string
  :input "{{ (+ 1 41) }}"
  :expected "42")
```

{% endraw %}

The rest of this post describes how the new compiler works.

## Building the compiler

Orgify's compiler has three phases: tokenization, parsing, and code generation
(although the last two steps are actually performed at the same time).

### Tokenization

The goal of tokenization is to make the text easier to parse by breaking it down
into smaller tokens that pick out language symbols. This step is surprisingly
crucial. The difference in a program's ability to understand a list of tokens
vs. raw text is night and day.

My template language only cares about a few tokens:

- `obrace`: opening handlebars expression
- `cbrace`: closing handlebars expression
- `oeach`: opening loop expression
- `ceach`: closing loop expression
- `text`: everything else, e.g. HTML or Emacs Lisp

The scope of each token is intentionally small. It's very easy to accidentally
blur the line between the job of the tokenizer and the job of the parser by
trying to capture tokens that contain too much information. This path leads only
to headaches.

Finding these tokens in the original text still relies on regular expressions,
though the implementation is quite a bit different from the original approach.
Rather than using `re-search-forward`, which operates on a buffer, I use
`string-match`, which operates on a string. Additionally, I use an incrementing
index to ensure the regular expression is always matching against the beginning
of the current position in the string (important due to some quirks in Emacs
Lisp regular expression language).

Altogether, tokenization looks like this:

{% raw %}

```elisp
(defun tokenize (input)
  (let ((tokens '()) (cur-text "") (idx 0))
    ;; A helper function to append text tokens
    (cl-flet ((purge-text ()
                (when (> (length cur-text) 0)
                  (push (list 'text cur-text) tokens)
                  (setq cur-text ""))))
      ;; Looping over the input string, one character at a time
      (while (< idx (length input))
        ;; Need to use (eq ... idx) to ensure regex is matching from
        ;; idx onwards (e.g. start of string only).
        (cond ((eq (string-match "{{" input idx) idx)
               (purge-text)
               (push `(obrace ,(match-string 0 input)) tokens)
               (setq idx (1- (match-end 0))))
              ((eq (string-match "}}" input idx) idx)
               (purge-text)
               (push `(cbrace ,(match-string 0 input)) tokens)
               (setq idx (1- (match-end 0))))
              ;; ...snip

              ;; For everything else, just append the character
              ;; to cur-text.
              (t
               (setq cur-text (concat
                                cur-text
                                (char-to-string (aref input idx))))))
        (cl-incf idx))
      (purge-text))
    (reverse tokens)))

```

{% endraw %}

For every index in the string, decide whether the string starting at that index
matches one of the language tokens via regular expression. If it does, purge any
text that might be hanging around from previous iterations and push a new token
to the list. If it doesn't, append the current character to the growing string
of characters for the next text purge.

It might be easier to visualize by looking at an example template:

{% raw %}

```elisp
;; Template:
;; <p>Hello {{ name }}!</p>
;;   <ul>
;;     #each page in pages
;;       <li>{{ page }}</li>
;;     /each
;; </ul>

;; Tokens:
'((text "<p>Hello ")
  (obrace "{{")
  (text "name")
  (cbrace "}}")
  (text "!</p>\n\n<ul>\n  ")
  (text "\n  <li>\n    ")
  (oeach "#each page in pages")
  (obrace "{{")
  (text "page")
  (cbrace "}}")
  (text "\n  </li>\n  ")
  (ceach "/each")
  (text "\n</ul>"))
```

{% endraw %}

### Parsing and code generation

The next step in compilation feeds these tokens to the parser. The parser runs
through the list of tokens and gives them structure, appending them as leaves
and branches to an abstract syntax tree (AST).

```elisp
(defun parse (tokens)
  (let ((expressions '()) (cur 0))
    (while (< cur (length tokens))
      (let ((token (nth cur tokens)))
        (cond ((eq 'text (car token))
               ;; Handle text...)
              ((eq 'obrace (car token))
               ;; Handle opening braces...)
              ((eq 'cbrace (car token))
               ;; Handle closing braces...)))
      (setq cur (1+ cur)))
    (reverse expressions)))

```

The call to `reverse` here might be unexpected, but it's a common Lisp-ism since
`push` prepends items to the front of the list. Reversing `expressions` ensures
the order of the tree matches the order of the original tokens.

I commented out the implementation of each token branch because there are some
important prerequisite topics to cover: quoting and eval. These two tools are
crucial for this compiler, so it's worth explaining them with some extra detail.

#### Quoting

There's a very interesting consequence of building an AST for this compiler in
Lisp. Because Lisp code is naturally structured as lists, the parser able to
directly generate a tree of Emacs Lisp code, rather than a tree of generic nodes
that need another layer of translation. This is accomplished through quoting, a
Lisp special form that returns an object without evaluating it.

```elisp
(+ 1 2)
;; => 3

'(+ 1 2)
;; => (+ 1 2)
```

The ability to pend evaluation by quoting is incredibly useful for a compiler
that generates instructions. Every node in the AST generated by the parser is a
quoted Emacs expression. It satisfies not only the AST data structure, a tree
representing the program shape, but also the code that need be generated from
the source tokens.

This aspect of code-as-data in Lisp is referred to as
[homoiconicity](https://en.wikipedia.org/wiki/Homoiconicity).

Taking it one step further, the backtick character enables mixing quoting and
evaluation. This is how macros are generally written in Lisp.

```elisp
(setq value 42)

`(+ 5 value)
;; => (+ 5 value)

`(+ 5 ,value)
;; => (+ 5 42)
```

Anywhere a comma falls is an expression that is evaluated. By mixing quoted
forms and evaluation, it's easy to construct complex snippets of code for the
compiler.

#### Evaluating Emacs Lisp expressions

Given that the parser generates quoted Emacs Lisp code, how does the compiler
actually evaluate it? With `eval`.

```elisp
(eval '(+ 1 2))
;; => 3
```

One problem remains, however. My original approach relied on `alist-get` to
insert values from the parent environment into the source template when
replacing regular expressions. This assumed that all text inside mustache braces
was represented by a key-value pair in an association list.

```elisp
;; Recall, replacing a variable in a template
(assert-compile-to-string
  :input    "Hello, {{ name }}!"
  :expected "Hello, world!"
  :env      '((name . "world"))
```

How does `eval` similarly replace variables from the parent environment? The key
is the third argument of `eval`:

```txt
Signature
(eval FORM &optional LEXICAL)

Documentation
Evaluate FORM and return its value.

If LEXICAL is t, evaluate using lexical scoping.
LEXICAL can also be an actual lexical environment, in the form of an
alist mapping symbols to their value.
```

If an alist is passed into `eval` it uses it as the lexical environment with
which variables are evaluated. This approach solves the problem of variable
substitution without hard-coding the use of `alist-get`.

```elisp
(eval 'name '((name . "world")))
;; "world"
```

When quoted symbols are evaluated, Emacs Lisp knows to look up that symbol from
the `ENV` alist for its value. Cool.

Requiring a quoted symbol for the variable actually poses a bit of a problem for
this compiler. When a layout is tokenized, that layout is input as a string. All
of the generated tokens reference string values. Since `eval` requires a symbol,
those strings need to be converted.

Luckily this problem is easily solvable with the function `read-from-string`:

```elisp
(read-from-string "name")
;; '(name . 4)

(eval (car (read-from-string "name")) '((name . "world")))
;; "world"
```

#### Parsing

With quoting and eval out of the way, it's time to fill in the parser. For each
conditional branch against a token, the parser pushes a tree of Emacs Lisp
expressions into the AST. When mustaches are detected (e.g. `obrace`) a call to
`eval-string` is to pend the execution of that text as an Emacs Lisp expression.
Regular text is inserted as-is.

```elisp
(defun lastcar (l)
  "Extract the last element from list L."
  (car (cdr l)))

(defun eval-string (string env)
  (eval (car (read-from-string string)) env))

(defun parse (tokens)
  (let ((expressions '()) (cur 0))
    (while (< cur (length tokens))
      (let ((token (nth cur tokens)))
        (cond ((eq 'text (car token))
               (push `(insert ,(lastcar token)) expressions))
              ((eq 'obrace (car token))
               ;; Assume that the only token between an obrace
               ;; and a cbrace is text.
               (push `(insert (eval-string
                               ,(lastcar (nth (1+ cur) tokens))
                               env))
                     expressions)
               (setq cur (+ cur 2)))
              ((eq 'cbrace (car token))
               (error "Unexpected closing brace"))))
      (setq cur (1+ cur)))
      ;; ,@ means spill the contents, kind of like
      ;; the ... operator in JS or Rust.
    `(lambda (env) ,@(reverse expressions))))

;; How the generated code is actually executed.
(defun compile-and-exec (input env)
  (funcall (parse (tokenize input)) env))
```

It's probably a little easier to look at the generated code:

{% raw %}

```elisp
;; Hello {{ name }}

(lambda (env)
  (insert "Hello, ")
  (insert (eval-string "name" env)))
```

{% endraw %}

The root of the tree is a lambda expression, taking the env as a single
argument. The lexical environment containing the page variables and other
metadata are assembled earlier in the static site generator and passed down as
an alist.

Everything else boils down to insert statements, writing a string into the
current buffer. What's great about the generated code is the deferred evaluation
of `env`. The parser builds quoted forms to avoid working with `env` until the
very last minute, that is, when the lambda expression is evaluated. This keeps
the parser decoupled from anything that may happen in the lexical environment.

`compile-and-exec` is meant for use with a fresh buffer, since the insert
statements will mutate that buffer with their string arguments. Something like
`with-temp-file`, which will write the buffer contents to a new file:

```elisp
(with-temp-file destination-file
  (compile-and-exec template-string env))
```

That about wraps it up. [Orgify](https://orgify.pages.dev) supports some
additional syntax not mentioned in this article, but hopefully it's clear how
the components from the parser can be altered to add loops and conditionals.
