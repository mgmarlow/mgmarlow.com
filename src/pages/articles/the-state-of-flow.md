---
title: The State of Flow in 2019
desscription: The current state of Facebook's static type checker, flow, is looking dire.
date: 2019-01-20
layout: ../../layouts/Article.astro
---

The current state of Facebook's static type checker, [Flow](https://flow.org/), is looking dire.

Open source projects within Facebook are [migrating from Flow to Typescript](https://github.com/facebook/jest/pull/7554), Facebook [retired Nuclide, their Flow IDE, in late 2018](https://blog.atom.io/2018/12/12/facebook-retires-nuclide-extension.html), and the community consensus around static typing in JavaScript seems to be trending towards TypeScript. Having launched a [new project](https://mindbody.io) with Flow this past year, I can no longer recommend it.

Our team settled on Flow initially to enable fast productivity on a project with a tight deadline—we were worried that TypeScript would mean extra onboarding for those unfamiliar with the language. We were also swayed by the painless [create-react-app setup](https://flow.org/en/docs/tools/create-react-app/), something that was not yet offered for TypeScript.

> **Note:** create-react-app 2.0 now offers this
> [out of the box](https://facebook.github.io/create-react-app/docs/adding-typescript#docsNav).

I stand by the decision to choose Flow when this project started in 2018. However, for new projects in 2019, I cannot recommend using Flow instead of TypeScript.

## Flow-typed and DefinitelyTyped

One of the biggest problems facing Flow is its lack of solid third-party types. Flow's equivalent to TypeScript's `@type` is a project called [flow-typed](https://github.com/flow-typed/flow-typed), a separate CLI that maintains third-party type definitions.

The CLI is not bad in its own right, but the project only has a sliver of definitions when compared to [DefinitelyTyped](https://definitelytyped.org/). Moreover, many of the Flow definitions that were brought into our project were out of date and unusable, requiring manual edits to the definition files in order to get them to work. Many of these issues are linked to Github tickets that have been circulating for months. This is particularly apparent in the `ReasonReact` definitions, a library that is critical for our project.

Here are a few of the open tickets that have caused hours of debugging pain for our development team:

- [Issues with react-redux](https://github.com/facebook/flow/issues/5343)
- [\$Diff with object behaves unexpectedly](https://github.com/facebook/flow/issues/6149)
- [React-redux mapDispatchToProps problems](https://github.com/flow-typed/flow-typed/issues/2628)

Now, these are third-party definition files that are maintained by the community, so I cannot direct blame towards Facebook for the lack of quality. But when discussing Flow I need to add this to the conversation because such issues will nip away chunks of development time that don't provide value for the end product.

## Community Support, or Lack Thereof

In contrast to other open source projects, including those within Facebook itself e.g. React, Flow's communication with the community is altogether lacking.

There is no roadmap detailing Flow's future plans, making it difficult to discern whether or not issues like those outined above will ever be fixed. Moreover, their releases are accompanied with a mere bulleted list of [one-line descriptions](https://github.com/facebook/flow/releases/tag/v0.91.0), failing to detail why such changes are advantageous to users. Upgrading is driven by the desire to check whether old bugs were resolved rather than to take advantage of exciting new features.

Facebook is signalling that they are not invested in the open source community that surrounds Flow. This is further evidenced by [their retiring](https://blog.atom.io/2018/12/12/facebook-retires-nuclide-extension.html) of the predominant Flow editor, [Nuclide](https://nuclide.io/), forcing a large portion of the community to jump to Visual Studio Code.

These types of issues aren't the sort that will stop me from using a product, but when the [alternative provides such compelling documentation](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html), a detailed [roadmap](https://github.com/Microsoft/TypeScript/wiki/Roadmap), and frequent updates, it is hard to quell the desire to jump ship.

## The Future of Flow

Jest, Facebook's JavaScript testing library, announced a few days ago their plans to migrate from [Flow to Typescript](https://github.com/facebook/jest). This news is particularly alarming due to the reasons for migrating, provided by one of the Jest core team members:

> This is about improving the health and maintainability of the code base
> and encouraging contributions. - Simen Bekkhus

These are the same reasons that are driving me to migrate my projects. If I didn't already feel uncertain about Flow due to the painpoints I've outlined in this article, this trend of migrations and EOL's of Flow-backed products is making me question whether Flow has much, if any, of a future.
