---
title: Markdown Rendering with Awk
date: 2024-03-23
---

I can't believe I'm writing
[another post about Awk](/words/2024-02-27-awk-is-cool/) but I'm just having too
much fun throwing together tiny Awk scripts. This time around that tiny Awk
script is a markdown renderer, converting markdown to good ol' HTML.

Markdown is interesting because 80% of the language is rather easy to implement
by walking through a file and applying a regular expression to each line. Most
implementations seem to start this way. However, once that final 20% is hit some
aspects of the language start to show their warts, exposing the not-so-happy
path that eventually leads to lexical analysis.

To list a few examples,

- there are many elements that can span more than one line, like paragraph
  emphasis, links, or bolded text

- elements can encompass sub-elements like a russian doll, e.g. headers that
  include emphasized text that itself is bolded

- elements can defy existing behavior, like code blocks that can themselves
  contain unrendered markdown

Each of these conditions complicates the simple line-based approach.

The renderer that I'm building doesn't aim to be comprehensive, so most of these
edge cases are not handled. For my toy renderer, I'm assuming that the markdown
is written in accordance to a general style guide with friendly linebreaks
between paragraphs.

I am also being careful to call this project an markdown "renderer" and not a
"parser" because it's not _really_ parsing the markdown file. Instead, we're
immediately replacing markdown with HTML. The difference may seem nitpicky but
implies that there's no intermediate format between the markdown and the HTML
output, a nuance that makes this implementation less powerful but also much
simpler.

Let's get cracking.

## Initial approach

Headers are a natural first step. The solution emphasizes Awk's strengths when
it comes to handing line-based input:

```awk
/^# / { print "<h1>" substr($0, 3) "</h1>" }
```

This reads, "On every line, match `#` followed by a space. Replace that line
with header tags and the text of that line beginning at index 3 (one-based
indexing)." Since we're piping `awk` into another file, `print` statements are
effectively writing our rendered HTML.

Line replacements are the name of the game in Awk, where the simplicity of the
syntax really shines. The call to `substr` is less elegant than the usual
space-delimited Awk fields (`$1`, `$2`, etc.), but it's necessary since we want
to preserve the entire line sans the first two characters (the leading header
hashtag).

The remaining headers follow the same pattern:

```awk
/^# /   { print "<h1>" substr($0, 3) "</h1>" }
/^## /  { print "<h2>" substr($0, 4) "</h2>" }
/^### / { print "<h3>" substr($0, 5) "</h3>" }
# ...
```

For something a little trickier, let's move on to block quotes. Block quotes in
Markdown look like the following, leading each line with a caret:

```md
> Deep in the human unconscious is a pervasive need for a logical universe that
> makes sense. But the real universe is always one step beyond logic. - Frank
> Herbert
```

Finding block quote lines is easy, we just use the same approach as our headers:

```awk
/^> / { print "<blockquote>"; print substr($0, 3); print "</blockquote>"}
```

But as you have probably guessed, this simplification isn't quite what we want.
Instead of wrapping each line with a block quote tag, we want to wrap the entire
block (three lines in this case) with one set of tags. This will require us to
keep track of some intermediate state between line-reads:

```awk
/^> / { if (!inquote) print "<blockquote>"; inquote = 1; print substr($0, 3) "}
```

If we match a blockquote character and we're not yet `inquote`, we write the
opening tag and set `inquote`. Otherwise, we simply write the content of the
line. We need an extra rule to write the closing tag:

```awk
inquote && !/^> / { print "</blockquote>"; inquote = 0 }
```

If our program state says we're in a quote but we reach a line that doesn't lead
with a block quote character, it's time to close the block. This matches against
paragraph breaks which are normally used to separate paragraphs in Markdown
documents.

This same strategy can be applied to the other block-style markdown elements:
code blocks and lists. Each requires its own variable to keep track of the block
content, but the approach is the same.

## Paragraphs are tricky

It is very tempting to implement inline paragraph elements in the same way as
we've handled other, single-line markdown syntax. However, paragraphs are
special in that they often span more than a single line, especially so if you
use hard-wrapping in your text editor at some column. For example, it's very
common for links to span multiple lines:

```md
A link that spans [multiple lines](https://definitely-a-valid-link-here.com)
```

This breaks the nice, single-line worldview that we've been operating under,
requiring some special handling that will end up leaking into other aspects of
our rendering engine.

My approach is to collect multiple paragraph lines into a single string,
rendering it altogether on paragraph breaks. This allows me to search the entire
string for inline elements (links, bold, italics), effectively matching against
multiple lines of input.

```awk
/./  { for (i=1; i<=NF; i++) collect($i) }
/^$/ { flushp() }

# Concatenate our multi-line string
function collect(v) {
  line = line sep v
  sep = " "
}

# Flush the string, rendering any inline HTML elements
function flushp() {
  if (line) {
    print "<p>" render(line) "</p>"
    line = sep = ""
  }
}
```

Each line of text is collected into a variable, `line`, that is persisted
between line-reads. When a paragraph break is hit (a line that contains no text,
`/^$/`) we render that line, wrapping it in paragraph tags and replacing any
inline elements with their respective HTML tags.

I'll point out that the technique of collecting fields into a string or array is
a very common pattern in Awk, hence the utility variable `NF` for "number of
fields". The [Awk book](https://awk.dev) uses this pattern in quite a few
places.

For completeness, here's what that render function looks like:

```awk
function render(line) {
    if (match(line, /_(.*)_/)) {
        gsub(/_(.*)_/, sprintf("<em>%s</em>", substr(line, RSTART+1, RLENGTH-2)), line)
    }

    if (match(line, /\*(.*)\*/)) {
        gsub(/\*(.*)\*/, sprintf("<strong>%s</strong>", substr(line, RSTART+1, RLENGTH-2)), line)
    }

    if (match(line, /\[.+\]\(.+\)/)) {
        inner = substr(line, RSTART+1, RLENGTH-2)
        split(inner, spl, /\]\(/)
        gsub(/\[.+\]\(.+\)/, sprintf("<a href=\"%s\">%s</a>", spl[2], spl[1]), line)
    }

    return line
}
```

This code is noticeably less clean than our earlier HTML rendering, an
unfortunate consequence of handling multi-line paragraphs. I won't go into too
much detail here since there's a lot of Awk-specific regular expression matching
stuff going on, but the gist is a standard regexp-replace of the paragraph text
with HTML tags for matching elements.

Another problem that we run into when collecting multiple lines into the `line`
variable is accidentally collecting text from previous match rules. Awk's
expression syntax is like a switch statement that lacks a break: a line will
match as many expressions as it can before moving onto the next. That means that
all of our previous rules for headers, blockquotes, and so on are now also
included in our paragraph text. That's no good!

```awk
# I match a header here:
/^# /  { print "<h1>" substr($0, 3) "</h1>" }

# But I also match "any text" here, so I'm collected:
/./  { for (i=1; i<=NF; i++) collect($i) }
```

Each of our previous matchers now has to include a call to `next` to immediately
stop processing and move on to the next line. This prevents them from being
included in paragraph collection.

```awk
/^# /  { print "<h1>" substr($0, 3) "</h1>"; next }
/^## / { print "<h2>" substr($0, 4) "</h2>"; next }
# ...
```

## Styling for HTML exports

The last piece of this Markdown renderer is adding the boilerplate HTML that
wraps our document:

```awk
BEGIN {
    print "<!doctype html><html>"
    print "<head>"
    print "  <meta charset=\"utf-8\">"
    print "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
    if (head) print head
    print "</head>"
    print "<body>"
}

# ... all of our rules go here

END {
    print "</body>"
    print "</html>"
}
```

Unlike other Awk matchers, the special `BEGIN` and `END` keywords are only
executed once.

As a nice bonus, we can add an optional `head` variable to inject a stylesheet
into our rendered markdown, which can be added via the Awk CLI. The following
adds the [Simple CSS](https://simplecss.org/) stylesheet to our rendered output:

```text
awk -v head='  &lt;link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css"&gt;' \
    -f awkdown.awk README.md > docs/index.html
```

The full source code is available here: <https://github.com/mgmarlow/awkdown>.
