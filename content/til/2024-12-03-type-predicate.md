---
title: Type predicates to avoid casting
date: 2024-12-03
---

[Type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
have been around but today I found a particularly nice application. The
situation is this: I have an interface that has an optional field, where the
presence of that field means I need to create a new object on the server, and
the lack of the field means the object has already been created and I'm just
holding on to it for later. Here's what it looked like:

```ts
interface Thing {
  name: string
  blob?: File
}

const things: Thing[] = [
  /* ... */
]

const uploadNewThings = (things: (Thing & { blob: File })[]) =>
  Promise.all(things.map((thing) => createThing(thing.name, thing.blob)))
```

The intersection type `Thing & { blob: File }` means that `uploadNewThings` only
accepts `things` that have the field `blob`. In other words, things that need to
be created on the server because they have blob content.

However, TypeScript struggles if you try to simply filter the list of `things`
before passing it into `uploadNewThings`:

```ts
uploadNewThings(things.filter((thing) => !!thing.blob))
```

The resulting error is this long stream of text:

```txt
Argument of type 'Thing[]' is not assignable to parameter of type '(Thing & { blob: File; })[]'.
  Type 'Thing' is not assignable to type 'Thing & { blob: File; }'.
    Type 'Thing' is not assignable to type '{ blob: File; }'.
      Types of property 'blob' are incompatible.
        Type 'File | undefined' is not assignable to type 'File'.
          Type 'undefined' is not assignable to type 'File'.
```

The tl;dr being that despite filtering `things` by `thing => !!thing.blob`,
TypeScript does not recognize that the return value is actually
`Thing & { blob: File }`.

Now you could just cast it,

```ts
things.filter((thing) => !!thing.blob) as (Thing & { blob: File })[]
```

But casting is bad! It's error-prone and doesn't _really_ solve the problem that
TypeScript is hinting at. Instead, use a type predicate:

```ts
const hasBlob = (t: Thing): t is Thing & { blob: File } => !!t.blob

uploadNewThings(things.filter(hasBlob))
```

With the type predicate (`t is Thing & ...`) I can inform TypeScript that I do
in fact know what I'm doing, and that the call to `filter` results in a
different interface.
