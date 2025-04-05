---
title: Solving Puzzles by Making Puzzles
date: 2024-12-19
description: |
  Making your own puzzles is the best way to get better at solving
  others'.
tags:
  - gamedev
---

This year I've substantially buffed up my crosswording skills. Mon-Wed on the
NYT pose no threat, and I can even occasionally solve the Thu/Fri without
checking an answer. Saturday remains befuddling.

One reason for my skill improvement is repetition. The more puzzles I solve, the
more I recognize clue patterns and common words. Drill those puzzles frequently
enough and skill inevitably trickles in.

In reality, repetition only explains a small sliver of my improvement. The bulk
of my newfound skill doesn't come from training crossword puzzles out in the
wild, but from
[making my own](https://crosshare.org/crosswords/Y5Mj2up2SCMDKqeUTsUx/adventure-awaits).

Building a crossword puzzle requires activating a whole bunch of underused brain
wrinkles that remain latent when solving. Thinking of a theme and filling a
bunch of words into a grid is just one small part of the equation. How do I
measure difficulty so solvers don't get stuck? How do I compromise in a tradeoff
between word quality and theme? Why does the software keep suggesting I use
Australian birds?

The construction of quality reveals the heart of the puzzle. The very same
questions I ask myself when endeavoring to make a good puzzle help reveal the
construction of puzzles created by other people. For example, I now come
equipped with a backlog of words that appear frequently thanks to their helpful
vowels (`OPAL`, `EMU`, `ERODE`, ...). Difficult corners are made easier when I
consider that the uncommon words are probably grouped with more common words.
Themes are easier to spot now that I have thought of a few of my own.

This same skill applies to other puzzle genres, like the humble
[block-pushing puzzle game](https://mgmarlow.itch.io/kajam2024). Building
interesting levels is a tough job that requires the constructor to think deeply
about the constraints of their game. I don't know about other gamedevs, but I
start by fiddling around with a random level layout, paring things back again
and again until a single core concept is revealed to be interesting. I take that
concept and build three or four levels around it, tutorializing it, expanding
it, and remixing it.

This thought process has me thinking about other block-pushing puzzle games in a
completely different way. Now when I get stuck on
[Patrick's Parabox](https://store.steampowered.com/app/1260520/Patricks_Parabox/)
I take a step back and attempt to reverse engineer the mechanic at play. Why did
the constructor choose _this_ level layout? What mechanic are they trying to
showcase? What am I supposed to take away?

I suppose this same skill applies to programming, in the way of framework
design. As a user of React, I may get frustrated at the hook APIs and the design
of `useEffect`. But if I pare back the layers and think about what the framework
is fundamentally accomplishing (that is, virtual DOM rendering with a JSX
backend) the thought process of re-renders and `useEffect` dependencies starts
to reveal itself. Without going out and building my own virtual DOM framework
(something like [snabbdom](https://github.com/snabbdom/snabbdom) is a great
start) it's hard to recognize the tradeoffs.

Will constructing crossword puzzles make you a better developer? Almost
certainly not. But it's a ton of fun regardless.
