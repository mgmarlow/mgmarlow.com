---
title: Async IO in Emacs
date: 2025-02-16
---

Stumbled on the [emacs-aio](https://github.com/skeeto/emacs-aio) library today
and it's [introduction post](https://nullprogram.com/blog/2019/03/10/). What a
great exploration into how async/await works under the hood! I'm not sure I
totally grok the details, but I'm excited to dive more into Emacs generators and
different concurrent programming techniques.

The article brings to mind Wiegley's
[async](https://github.com/jwiegley/emacs-async) library, which is probably the
more canonical library for handling async in Emacs. From a brief look at the
README, `async` looks like it actually spawns independent processes, whereas
`emacs-aio` is really just a construct for handling non-blocking I/O more
conveniently.

[Karthink on reddit](https://www.reddit.com/r/emacs/comments/128mphh/adhoc_async_in_emacslisp_via_generators/)
comments on the usability of generators in Emacs:

> I've written small-medium sized packages -- 400 to 2400 lines of elisp -- that
> use generators and emacs-aio (async/await library built on generator.el) for
> their async capabilities. I've regretted it each time: generators in their
> current form in elisp are obfuscated, opaque and not introspectable -- you
> can't debug/edebug generator calls. Backtraces are impossible to read because
> of the continuation-passing macro code. Their memory overhead is large
> compared to using simple callbacks. I'm not sure about the CPU overhead.

That said, the simplicity of `emacs-aio` promises is very appealing:

```elisp
(defun aio-promise ()
  "Create a new promise object."
  (record 'aio-promise nil ()))

(defsubst aio-promise-p (object)
  (and (eq 'aio-promise (type-of object))
       (= 3 (length object))))

(defsubst aio-result (promise)
  (aref promise 1))
```
