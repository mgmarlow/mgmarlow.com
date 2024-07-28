---
title: Introducing ReScript
date: 2022-01-10
updated: 2022-08-22
---

A few weeks ago I revisited [ReScript](https://rescript-lang.org/) and experimented with the ecosystem during Advent of Code. I was pleased to discover that the language is in a much better place than four years ago.

Although I don't think I'll be writing ReScript in production any time soon, I put together a presentation today to introduce it to my colleagues. Below is the transcript of that presentation.

## What is it?

A strongly-typed language that compiles to JavaScript.

- Powered by OCaml
- Functional feel
- More of a TypeScript competitor than alternatives like [Elm](https://elm-lang.org/), [PureScript](https://www.purescript.org/), or [ClojureScript](https://clojurescript.org/).

Why use it instead of TypeScript?

- Only cover a small, curated subset of JavaScript
- Types are sound (will not lie to you)
- Fast compilation
- Minimal type annotations
- Gradual adoption strategy
- Compiler optimizations

Emphasizes:

- [Functions](https://rescript-lang.org/docs/manual/latest/function#uncurried-function) over classes
- [Pattern matching](https://rescript-lang.org/docs/manual/latest/pattern-matching-destructuring) over conditionals or virtual dispatches
- [Data modeling](https://rescript-lang.org/docs/manual/latest/variant) (variants) over string abuse
- [First class support for React](https://rescript-lang.org/docs/react/latest/introduction)

## History

You may recognize this project under a different name, [Reason](https://reasonml.github.io/).

- Used by Facebook Messenger
- Promised strong types w/ safe inference derived from OCaml
- Reason was just a syntax layer, BuckleScript was doing the real work
- BuckleScript was a fork of the OCaml compiler that output JS
- BuckleScript and Reason were two separate teams

Last year, BuckleScript rebranded to **[ReScript](https://rescript-lang.org/)**.

- Directly integrated Reason into BuckleScript
- Combined both teams under the same umbrella

**Reason & BuckleScript are now united as ReScript**.

## Syntax comparison

### OCaml

```ocaml
type tree = Leaf of int | Node of tree * tree

let rec exists_leaf test tree =
  match tree with
  | Leaf v -> test v
  | Node (left, right) ->
      exists_leaf test left
      || exists_leaf test right

let has_even_leaf tree =
  exists_leaf (fun n -> n mod 2 = 0) tree
```

### Reason

```reason
type tree =
  | Leaf(int)
  | Node(tree, tree);

let rec exists_leaf = (test, tree) =>
  switch (tree) {
  | Leaf(v) => test(v)
  | Node(left, right) =>
	  exists_leaf(test, left) || exists_leaf(test, right)
  };

let has_even_leaf = tree =>
	exists_leaf(n => n mod 2 == 0, tree);
```

### ReScript

```reason
type rec tree =
  | Leaf(int)
  | Node(tree, tree)

let rec existsLeaf = (test, tree) =>
  switch tree {
  | Leaf(v) => test(v)
  | Node(left, right) =>
		existsLeaf(test, left) || existsLeaf(test, right)
  }

let hasEvenLeaf = tree =>
	existsLeaf(n => mod(n, 2) == 0, tree)
```

## Type soundness

The ReScript docs state that the ReScript type system is sounder than TypeScript’s. What does this mean in practice?

> Most type systems make a guess at the type of a value and show you a type in your editor that's sometime incorrect. We don't do that.

Quick points:

- No `undefined` or `null`. There’s interop available, but they don’t exist in idiomatic ReScript
- Types are compiler-only constructs, they won’t affect your runtime performance
- Type checking is way faster than `tsc`
- Almost no need for annotations

### Why is TypeScript unsound?

TypeScript doesn’t prioritize _soundness_, it prioritizes _completeness_ (which is totally fine!).

```tsx
const nums: number[] = []
const n = nums[0]

const adder = (a: number, b: number) => a + b

// What does this output?
console.log(adder(n, 2))
```

[_playground link_](https://www.typescriptlang.org/play?#code/MYewdgzgLgBGCuBbCAuOSBGBTATgbQF0YBeGQgKFEljBPWTwAYDzLxoYBDAE29zoAUnNAkTYcAGhgYRmXAEoSAPnIwuMANTTWAeh0wA6gAtOsbiCwQYUIwEsrIeFAAOTgPxtIIADZYAdN4gAOZCvLgCYFIATPLy5EA)

Meanwhile, ReScript will actually throw a compiler error when indexing an array, since there may not be an item at that index.

```reason
open Belt

// Note: no annotations needed
let nums = []
let n = nums[0]

let adder = (a, b) => a + b

adder(n, 2)
// Compiler error!
// [E] Line 7, column 6:
//
// This has type: option<'a>
//   Somewhere wanted: int
```

We can fix the compiler error by wrapping the array access with a `switch` statement, defaulting the value to `0`.

```reason
open Belt

let nums = []
let n = switch nums[0] {
| Some(v) => v
| None => 0
}

let adder = (a: int, b: int) => a + b

adder(n, 2)
```

This is just one of many examples of TypeScript’s unsoundness. Here’s another:

```tsx
const a: Record<string, string> = {
  id: 'd4346fda-7480-4e47-a51a-786a431b3272',
}

const fn = (t: { id?: number }) => {
  // Runtime type is `string`
  // Type is `number | undefined` ❌
  console.log(t.id)
}

// Expected error here but got none
fn(a)
```

_[playground link](https://www.typescriptlang.org/play?#code/MYewdgzgLgBAhgLhgJQKagE4BMA80MCWYA5gDQz5HEB8MAvDAN4BQMMBWSA5FgCwDMvAGwAzLHAC0Adl4AOAAwTeqXlIlwArAEZJU2ULgCtAI34AmKWa7MAvgG5mzUJFgiw9GAAooSRuywA-EhgAK4AtsaoGDA2AJT0tCxsbAD0KSghYFAEYagwUACeAA55BBAwAAaUJBWsyWkwACrFpeUVoRFRMAA+MJlYqCJEqFgVMIAy5HVszhAgADaoAHRzIMTeixyxDvaODQCiAB4lwFAjMFEYINEAFlF5xiGwxCCwYOCozG6ecFvMQA)_

The ReScript version outputs a compiler error:

```reason
let a = Js.Dict.empty()
Js.Dict.set(a, "id", "d4346fda-7480-4e47-a51a-786a431b3272")

let fn = (t: Js.Dict.t<option<int>>) => {
  Js.log(Js.Dict.get(t, "id"))
}

// This has type: Js.Dict.t<string> (defined as Js_dict.t<string>)
//  Somewhere wanted:
//    Js.Dict.t<option<int>> (defined as Js_dict.t<option<int>>)
//
//  The incompatible parts:
//  string vs option<int>
fn(a)
```

### Variant and Option

TypeScript tackles variants with string literals:

```tsx
type Animal = 'cat' | 'dog'

const fn = (animal: Animal) => {
  switch (animal) {
    case 'cat':
      console.log("I'm a cat")
      break
    case 'dog':
      console.log("I'm a dog")
      break
  }
}
```

Compare this to ReScript’s approach, where variants have dedicated constructors:

```reason
type animal = Dog | Cat

let fn = animal => {
  switch animal {
  | Dog => Js.log("I'm a dog")
  | Cat => Js.log("I'm a cat")
  }
}
```

This gives ReScript variants a lot more flexibility because the constructors can take arguments:

```reason
type account =
  | None
  | Instagram(string)
  | Facebook(string, int)

let myAccount = Facebook("Josh", 26)
let friendAccount = Instagram("Jenny")

let process = acc => switch acc {
| Instagram(name) => ...
| Facebook(name, age) => ...
| None => ...
}

process(myAccount)
```

### Option

An Option is just a special type of Variant.

- Recall: `undefined` and `null` don’t exist in ReScript
- Potentially nonexistent values are still useful

Example:

```reason
// Annotation for demonstration only
let licenseNumber: option<int> =
  if personHasACar {
    Some(5)
  } else {
    None
  }
```

Use pattern matching to handle both cases:

```reason
switch licenseNumber {
| None =>
  Js.log("The person doesn't have a car")
| Some(number) =>
  Js.log("The person's license number is " ++ Js.Int.toString(number))
}
```

## Belt

The ReScript [standard library](https://rescript-lang.org/docs/manual/latest/api/belt).

- Immutable data structures
- Safety by default (e.g. [array access runtime safety](https://rescript-lang.org/docs/manual/latest/api/belt#array-access-runtime-safety), Belt functions never throw exceptions)
- Tree-shakable, good performance (citation needed)

```reason
let someNumbers = [1, 1, 4, 2, 3, 6, 3, 4, 2]

let greaterThan2UniqueAndSorted =
  someNumbers
  ->Belt.Array.keep(x => x > 2)
  // convert to and from set to make values unique
  ->Belt.Set.Int.fromArray
  ->Belt.Set.Int.toArray // output is already sorted

Js.log2("result", greaterThan2UniqueAndSorted)
```

When should I use Belt?

- You need an API that isn’t available in regular JS
- You want no compromises on type safety

When should I not use Belt?

- You want zero-cost abstractions
- You want semantics similar to JS

Personally, I like to replace the JS standard library with Belt entirely using this `bsconfig` setting:

```reason
"bsc-flags": ["-open Belt"]
```

## Fibonacci demo

Setup:

```
git clone https://github.com/rescript-lang/rescript-project-template fib-demo
cd fib-demo
yarn
```

Problem: `f0 = 0, f1 = 1, fn = f{n-1} + f{n-2} for n > 1`

### Recursive process solution

ReScript code:

```reason
let rec fib = n => {
  if n <= 2 {
    1
  } else {
    fib(n - 1) + fib(n - 2)
  }
}
```

JavaScript output:

```jsx
function fib(n) {
  if (n <= 2) {
    return 1
  } else {
    return (fib((n - 1) | 0) + fib((n - 2) | 0)) | 0
  }
}
```

### Iterative process (still using recursion!) solution

ReScript code:

```reason
let fib = n => {
  let rec iter = (a, b, counter) => {
    if counter == 0 {
      b
    } else {
      iter(a + b, a, counter - 1)
    }
  }

  iter(1, 0, n)
}
```

JavaScript output:

```jsx
function fib(n) {
  var _a = 1
  var _b = 0
  var _counter = n
  while (true) {
    var counter = _counter
    var b = _b
    var a = _a
    if (counter === 0) {
      return b
    }
    _counter = (counter - 1) | 0
    _b = a
    _a = (a + b) | 0
    continue
  }
}
```

Note that the iterative solution introduces tail call optimization!

## React demo

Setup:

```
npx create-react-app a-todo-list
```

Then follow the rescript-react [installation instructions](https://rescript-lang.org/docs/react/latest/installation)

Full project: [https://github.com/mgmarlow/rescript-cra](https://github.com/mgmarlow/rescript-cra)

## Should I use ReScript?

Yes if...

- Your code doesn’t rely too heavily on third-party JS packages
- You want total type correctness
- You want compiler-defined performance optimizations
- You’re using React

## References

- [BuckleScript & Reason Rebranding](https://rescript-lang.org/blog/bucklescript-is-rebranding)
- [State of Reason in 2021](https://formidable.com/blog/2021/reason-2021/)
- [ReScript official roadmap](https://rescript-lang.org/community/roadmap)
- [Roles for Belt, Js, and Pervasives in ReScript](https://forum.rescript-lang.org/t/roles-for-belt-js-and-pervasives-in-rescript/1683/3)
