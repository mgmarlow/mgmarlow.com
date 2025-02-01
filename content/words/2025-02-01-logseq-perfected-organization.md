---
title: Logseq Has Perfected Note Organization
date: 2025-02-01
description: |
  Fear of losing all of my Apple Notes to iCloud nonsense has
  lead me to Logseq, the best note-taking app of them all.
---

A little while ago Apple Notes left me with quite the scare. I booted up the app
to jot down an idea and found my entire collection of notes erased. I re-synced
iCloud, nothing. Just the blank welcome screen.

Luckily my notes were still backed up to iCloud, even though they weren't
displaying in the app (I checked via the web interface). After 40 minutes of
debugging and toggling a series of obtuse settings, my notes were back on my
phone. Yet the burn remained.

Since then I've been looking at alternatives for my long-term document/note
storage. Apple Notes was never meant to be a formal archive of my written work,
it just came out that way due to laziness in moving my notes somewhere
permanent. I investigated the usual suspects: Notion, Obsidian, Bear, Org mode,
good ol' git and markdown. Nothing stuck. Then I found
[Logseq](https://logseq.com/) and was immediately smitten.

The truth is, I don't actually use Logseq. I use Obsidian. You see, Logseq is a
_outliner_. Every piece of text is attached to some kind of bulleted list,
whether you're writing a code sample or attaching an image. Bulleted lists are
great for notes, but not so great for blog posts or longform writing. I need a
tool that can easily handle standard markdown for this blog, for example.

But despite not actually using Logseq, I've structured my Obsidian identically
to Logseq. The Logseq method of organization is just so good. Everything boils
down to three folders:

- `journal/`: the place for daily notes.
- `pages/`: high-level concepts that link between other pages or entries from
  the journal.
- `assets/`: storage for images pasted from clipboard.

That's it! Just three folders, each containing a ton of flat files. All of my
actual writing happens in journal pages, titled with the current day in
`YYYY-MM-DD` format. I never need to think about file organization, nor do I
struggle to find information.

Looking at a long list of `YYYY-MM-DD` files sounds difficult to navigate, but
the key is that they're tagged with links to relevant pages (like
`[[disco-elysium]]`) that attach the journal entry to a concept. When I want to
view my notes on a concept, I navigate to the concept page (`disco-elysium`) and
read through the linked mentions. I don't need to worry about placing a
particular thought in a particular place because the link doesn't care.

I got hooked on this workflow because Logseq is incredible at linked mentions.
Just take a look at this example page:

![Logseq linked mentions example](/img/logseq-demo.png)

All of the linked mentions (journal entries containing the tag
`[[disco-elysium]]`) are directly embedded into the concept page. Logseq will
even embed images, code samples, to-do items, you name it. It works incredibly
well.

The Obsidian equivalent isn't quite as nice, but it gets the job done. Obsidian
mentions are briefer, lack context, and stripped of formatting:

![Obsidian linked mentions example](/img/obsidian-demo.png)

The flip-side is that I don't need to write notes in an outline form and can
more easily handle moving my Obsidian notes into plain markdown files for my
blog.

If you're like me and you want to use Logseq-style features in Obsidian there
are a few configuration settings that are worth knowing about:

- In your Core plugins/Daily notes settings, set the New file location to
  `journal/` and turn on "Open daily note on startup".
- In Core plugins/Backlinks, toggle "Show backlinks at the bottom of notes".
- In Files and links, set the "Default location for new attachments" path to
  `assets/`.

These three settings changes will get you most of the way there. That said,
before messing with those settings I encourage you to give
[Logseq](https://logseq.com/) a try. It's free and open source, it's built in
Clojure, and it has an excellent [community forum](https://discuss.logseq.com/).
Although I don't use it for my longform/personal writing, I use it at work where
outlining fits my workflow better.
