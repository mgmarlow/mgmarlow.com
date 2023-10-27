---
title: Things I've Learned Since Building My First Emacs Library
date: 2023-10-15
---

I spent some time cleaning up my first Emacs library, git-share, this
weekend and was surprised at how many different techniques I've
learned for building libraries since I've started.

## Embrace M-x auto-insert

## Use package-vc-install

## if-let is awesome

## Organize with cl-defstruct

## Don't test implementation details

This one is certainly a given in normal software engineering, but in
practice is a bit difficult in Emacs Lisp since there are so many
mutations and dynamic variables to worry about when writing anything
useful.
