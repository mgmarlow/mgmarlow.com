---
title: Hypermedia and Hyperbole
date: 2023-10-26
tags: emacs
---

My partner and I are slowly working our way through the Myst series
and have finally started Myst 3: Exile. We were both surprised by how
much of a departure this entry is to the previous Myst games. The
biggest change isn't so much the game itself as it is the
implementation of freelook: the ability to look around a scene like
it's a three-dimensional room. If this doesn't sound like a big
achievement believe me, it is. The first two games are glorified
powerpoint slides in comparison.

Original Myst (not talking about the remakes) was effectively a deck
of static images with some clickable areas on top. Clicking on one of
these areas could advance you to the next scene (i.e. movement) or
jiggle an object so as to trigger an animation and play some sound
effects. While the core gameplay and presentation is incredibly
simple, it doesn't detract too much from the compelling setting and
(mostly) interesting puzzles.

I was fascinated to learn that the control mechanisms for Myst 1 and 2
root back to early Cyan, before Myst was a thing. Rand and his brother
Robyn made [games for the Apple
Macintosh](https://store.steampowered.com/app/63620/Cosmic_Osmo_and_the_Worlds_Beyond_the_Mackerel/)
with a piece of software called
[HyperCard](https://en.wikipedia.org/wiki/HyperCard), an application
for building GUIs based on the principles of hypermedia.

All programs built in HyperCard consist of just two components: cards
that store data and links that navigate between those cards or execute
scripts. It's a simple system that offers a lot of flexibility; even
today I think it would make an awesome prototyping tool. It also seems
no coincidence that the scripting language is named HyperTalk, as the
whole environment reminds me of
[Smalltalk](https://en.wikipedia.org/wiki/Smalltalk).

All of the concepts of HyperCard (and the awesome late-80s nerd
aesthetic) are well-explained in this interview with the creator, Bill
Atkinson, and an enthusiast, Danny Goodman:

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/FquNpWdf9vg?si=nLlvTXjaWauEQCn2"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media;
  gyroscope; picture-in-picture; web-share"
  allowfullscreen></iframe>

If that video piqued your interest, [_The Complete HyperCard
Handbook_](https://archive.org/details/The_Complete_HyperCard_Handbook),
written by Danny Goodman in the video, is available to read online.

It always amazes me what creative people can create using simple
tools. HyperCard and the early days of Cyan are no exception; it seems
like the duo were able to find a lot of success by excelling within
the constraints of their software.

Hypermedia systems are super interesting to me, particularly with the
renewed interest in tools like [htmx](https://htmx.org/) that promise
to bring the [hypermedia ethos](https://hypermedia.systems/) back to
the web. That said, this post isn't going to talk about how htmx is
fighting against the SPA-explosion that the web industry has
experienced over the past decade. Instead, I'd like to take a look at
a far more esoteric hypermedia system: [GNU
Hyperbole](https://www.gnu.org/software/hyperbole/).

I stumbled on this Emacs package recently and I had this overwhelming
sense of deja vu due to its similarities to HyperCard. It was
originally created in the 90s and retains an identity true to that era
through some of its naming conventions (e.g. HyRolo, the rolodex
extension). But more than that it is a full hypermedia engine, just
like HyperCard, that is scriptable with Emacs Lisp.

The fact that Emacs contains an entire hypermedia system as an
external package is probably unsurprising given its reputation as an
operating system, but do people actually use it? The answer is yes,
and rather extensively given the amount of material about it on the
internet. There were no less than three talks about it during last
year's EmacsConf:

- [Linking personal info with Hyperbole implicit
  buttons](https://emacsconf.org/2022/talks/buttons/)
- [Build a Zettelkasten with the Hyperbole
  Rolodex](https://emacsconf.org/2022/talks/rolodex/)
- [Powerful productivity with Hyperbole and Org
  Mode](https://emacsconf.org/2022/talks/hyperorg/)

All there are interesting glimpses into some of the functionality of
Hyperbole, but I found that Ramin Honary's [Building a
Zettelkasten](https://emacsconf.org/2022/talks/rolodex/) did the best
job of answering the question of "why would anyone use this?"

As the title suggests, Ramin's talk demonstrates a Zettelkasten built
on Hyperbole, using its built-in rolodex to store entries with
scripted links between them. That's right, I said rolodex. Hyperbole
is from the 90s, remember?

That said, a rolodex is probably not the best way to think about
Hyperbole's record-keeping implementation (named HyRolo). It's not so
much about managing contacts as it is managing record-oriented
information. From that perspective it feels like a natural fit for a
Zettelkasten, which literally means "slip box" in German.

Linking to a zettel in Hyperbole might look something like this:
  
```txt
<hyrolo-fgrep "Immanuel Kant">
```

In this case, the link reveals its implementation. It's a call to an
Emacs Lisp function that greps over all HyRolo records for the string
matching "Immanuel Kant".

Of course, you don't actually need to have an ugly link like that in
your zettel text. Instead, you can create what's called an "explicit
button" that hides the actual linking function code in a separate
file. With an explicit button your zettel looks something like this:

```txt
<(Immanuel Kant)>
```

This link behaves in an identical fashion to the previous one, even
though it hides away the details of the Emacs Lisp function powering
the search. What's interesting is where it places those details. If
you check your Hyperbole user directory, you can see the source code
of the new button in a special file: `_hypb`:

```txt
("immanuel_kant" nil nil hyrolo-fgrep ("Immanuel Kant" nil) "me@my-pc" "20231025:04:20:37" nil nil)
```

It's just s-expressions all the way down!

Hyperbole is difficult to explain because it's such an abstract
concept. Sure we can link between things, but what's the use? I think
looking at the `_hypb` file and uncovering the Emacs Lisp engine
underneath helps illustrate its flexibility; it's more than a linking
engine because you can make your links any valid Emacs Lisp
expression. Pretty cool.

Now, I don't think anyone is likely to create an entire game with
Hyperbole, like Cyan did with HyperCard. Not because they couldn't per
se, but asking players to learn Emacs as a prerequisite feels a tad
much. But if there's anything to learn from the success of HyperCard,
it's that simple interfaces empower creative people to build
interesting things and I think Hyperbole exemplifies that same
characteristic.
