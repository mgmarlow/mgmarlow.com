---
title: Advent of Code with Common Lisp
date: 2022-12-19
tags: lisp
---

One observation I've had working through [Advent of Code](https://adventofcode.com/) with Common Lisp is that the `LOOP` macro is an absolute powerhouse.

When first learning Common Lisp, it's common to hear that the language is actually comprised of three separate languages: Common Lisp, `FORMAT`, and `LOOP`. Common Lisp itself is made up of the parenthetical soup that is easily recognizable. `FORMAT` and `LOOP`, on the other hand, each have their own bespoke syntax that looks next to nothing like Lisp.

Although the unique syntax of `FORMAT` and `LOOP` brings a learning curve on top of Common Lisp itself, both tools bring an incredible amount of power to the language. `LOOP` in particular has been fantastically useful in this year's Advent of Code.

Most Advent of Code exercises involve (a) reading lines of data from a file and (b) accumulating or counting some result from the data. This sort of operation is handled very gracefully by `LOOP`.

Here's a simple example from Day 2, summing scores from a file:

```lisp
(defun score (line) ...)

(with-open-file (in "day02.txt")
  (loop for line = (read-line in nil)
        while line
        summing (score line) into total
        finally (return total)))
```

Within the `LOOP` macro, I'm reading one line from the input file at a time, storing it into the variable, `LINE`. After checking that the `LINE` is non-empty or EOF, I pass it into the `SCORE` function. The result of that function call is accumulated into a variable, `TOTAL`, which is incremented on each iteration of the loop. Finally, once the entire file is processed (and `LINE` is `NIL`) I return `TOTAL`.

Not very "Lispy", but very expressive and readable.

Day 12 has a more complex example. The following loops over all possible starting positions for a graph (the input) and determines the path to the given endpoint via a breadth-first search. While collecting these paths, the macro saves the shortest path into a variable, `MIN`, then returns it as the result. This variable is compared against all iterations, only changing value if the iteration is less than the stored result.

```lisp
(defun bfs (start end) ...)

(loop for start in *starting-positions*
      for path = (bfs start #\E)
      when (not (null path))
      minimizing (length path) into min
      finally (return (1- min))
```

Note that you can assign as many iterators as you want by adding additional `for VAR = EXPRESSION`. You can similarly accumulate iterators from an automatically incremented value, like an index: `for VAR from 0`.

Another cool feature is the ability to loop over successive `CDR`s of a list. This feature was super handy for Day 13, when I needed to zip together pairs from a list of inputs:

```lisp
(loop for el on '(a b c d e f)
      if (and (>= (length el) 2)
              (= (mod (length el) 2) 0))
        collect (subseq el 0 2))

;; Result: ((A B) (C D) (E F))
```

When looping via `on`, the value bound into `EL` is the `CDR` of that list, similar to calling `NTHCDR` with the index of that iteration:

```lisp
(nthcdr 0 '(a b c d))
;; '(a b c d)

(nthcdr 1 '(a b c d))
;; '(b c d)

(nthcdr 2 '(a b c d))
;; '(c d)
```

By collecting `SUBSEQ`, I'm only collecting a slice of the list from the starting index to the end, forming pairs of two.

```lisp
(subseq '(a b c d) 0 2)
;; '(a b)
```

Combine these two things, and protect against out-of-index errors, and pairs are achieved. A two-length slice is collected on each iteration from consecutive `CDR`s of the list.

The `LOOP` rabbit hole goes far deeper than what's shown in this post. A chapter of Peter Seibel's _Practical Common Lisp_ has an entire chapter dedicated to the macro, the aptly named [LOOP for Black Belts](https://gigamonkeys.com/book/loop-for-black-belts.html).
