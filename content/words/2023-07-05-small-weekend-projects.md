---
title: Small Weekend Projects
date: 2023-07-05
---

I love small weekend projects. A project completed in two days is either smartly
scoped or hacked together; the core of a great idea that's been sitting in the
back of your mind or a feat of engineering spontaneity that is given just enough
space to flourish into reality. Either way it's a great way to learn new things.

I was compelled this weekend to build my own
[static site generator](https://orgify.pages.dev), not because I found existing
ones lacking, but because I wanted one to call my own. The basics are easy to
get right but the details expand into a surprisingly interesting problem space.
I guess that's one reason for why so many already exist.

I started by settling on [Org](https://orgmode.org) as my generator's primary
markup format. It's supported OOTB in Emacs and already supports HTML exports
(via `ox-html`) so I didn't need to spend my weekend writing an exporter.
Instead, I focused on the basics. Copy some static files, convert the contents
of Org files to HTML, and substitute that content into HTML layouts.

Where things start getting interesting is with layouts and templates. There's a
whole host of template expressions that you might want to support in a
generator, from basic substitutions to loops and conditionals. I learned that
Emacs Lisp has an incredibly elegant solution for handlebars-like template
substitutions:

{% raw %}

```elisp
(while (re-search-forward "{{[ ]*[a-z]*[ ]*}}" nil t)
  (if (gethash (match-string 0) template-content)
      (replace-match (gethash (match-string 0) template-content))
    (error "expression not recognized: %s" (match-string 0))))
```

This code searches the current buffer for a regular expression matching
handlebars, like `{{ foobar }}`. As long as a match is found, lookup the match
in a hash-table containing the original file's frontmatter (`template-content`).
Then, swap out the template expression in-place with its matching value via
`replace-match`. Super easy!

{% endraw %}

The final product looks something like this:

1. Loop over the directory of Org files.
2. Use `ox-html` to parse an Org file, storing the HTML content and frontmatter
   keywords separately.
3. Insert the Org file's associated layout into a new buffer.
4. Search for handlebar expressions in the current buffer and substitute them
   with the HTML from step 2.
5. Write the current buffer to a new HTML file in the user's output directory.

I'm super happy with where the project ended up as an MVP, though there's still
a few features I need to implement before it can actually be used for a blog
(namely: template loops and collections).

You can check out the documentation (built in Orgify!) here:
<https://orgify.pages.dev>. Or, read the source code:
<https://git.sr.ht/~mgmarlow/orgify>.
