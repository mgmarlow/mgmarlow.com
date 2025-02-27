---
title: Zod refinements are complicated
date: 2025-02-26
---

Today I found myself at the bottom of a rabbit hole, exploring how
[Zod's](https://zod.dev) refine method interacts with form validations. As with
most things in programming, reality is never as clear-cut as the types make it
out to be.

Today's issue concerns
[zod/issues/479](https://github.com/colinhacks/zod/issues/479), where refine
validations aren't executed until all fields in the associated object are
present. Here's a reframing of the problem:

The setup:

- I have a form with fields A and B. Both are required fields, say `required_a`
  and `required_b`.
- I have a validation that depends on the values of both A and B, say
  `complex_a_b`.

The problem:

If one of A or B is not filled out, the form parses with errors: `[required_a]`,
not `[required_a, complex_a_b]`. In other words, `complex_a_b` only pops up as
an error when both A and B are filled out.

Here's an example schema that demonstrates the problem:

```ts
const schema = z
  .object({
    a: z.string(),
    b: z.string(),
  })
  .refine((values) => complexValidation(values.a, values.b), {
    message: 'complex_a_b error',
  })
```

This creates an experience where a user fills in A, submits, sees a validation
error pointing at B, fills in B, and sees another validation error pointing at
`complex_a_b`. The user has to play whack-a-mole with the form inputs to make
sure all of the fields pass validation.

As a programmer, we're well-acquainted with error messages that work like this.
And we hate them! Imagine a compiler that suppresses certain errors before
prerequisite ones are fixed.

If you dig deep into the aforementioned issue thread, you'll come across the
following solution (credit to
[jedwards1211](https://github.com/colinhacks/zod/issues/479#issuecomment-2429834215)):

```ts
const base = z.object({
  a: z.string(),
  b: z.string(),
})

const schema = z.preprocess((input, ctx) => {
  const parsed = base.pick({ a: true, b: true }).safeParse(input)
  if (parsed.success) {
    const { a, a } = parsed.data
    if (complexValidation(a, b)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['a'],
        message: 'complex_a_b error',
      })
    }
  }
  return input
}, base)
```

Look at all of that extra logic! Tragic.

From a type perspective, I understand why Zod doesn't endeavor to fix this
particular issue. How can we assert the types of A or B when running the
`complex_a_b` validation, if types A or B are implicitly optional? To evaluate
them optionally in `complex_a_b` would defeat the type, `z.string()`, that
asserts that the field is required.

How did I fix it for my app? I didn't. I instead turned to the form library,
applying my special validation via the form API instead of the Zod API. I
concede defeat.
