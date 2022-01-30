---
layout: post.njk
title: revisiting rescript
date: 2021-12-11
tags: post
---

# Revisiting ReScript

When I first started looking at ReScript two years ago it was a project under another name: Reason. Derived from OCaml, Reason promised type safe code and powerful functional primitives without ditching the JavaScript ecosystem. It was created by Jordan Walke, the creator of React, and boasted adoption in Facebook's core messaging product, [Facebook Messenger](https://reasonml.github.io/blog/2017/09/08/messenger-50-reason).

However, Reason was divided between multiple teams with different responsibilities. Reason itself was a JavaScript-friendly syntax layer sitting in front of OCaml. The actual compiler, BuckleScript, was maintained by a separate team with a separate history. The development lifecycles for these two projects led to an awkward fragmentation of tooling, documentation, and community.

Luckily, BuckleScript and Reason are now united under a common name, [ReScript](https://rescript-lang.org/blog/bucklescript-is-rebranding). This change has brought about a fair deal of controversy, as it poses to further divide an already niche community with yet another syntax layer.

That aside, the project feels like it's in a much healthier state than two years ago. Unifying the documentation under a [single domain](https://rescript-lang.org/) is a non-trivial change that makes it easier to acclimate to the ecosystem. In addition, the new [VSCode extension](https://marketplace.visualstudio.com/items?itemName=chenglou92.rescript-vscode) goes a long way to make the experience feel at least comparable to TypeScript.

Now's the right time to get into ReScript and start exploring some of its killer features:

- Great type inference with basically no need for annotations.
- No undefined or null. Instead, a robust [option type](https://rescript-lang.org/docs/manual/latest/null-undefined-option).
- Pattern matching, automatic currying, and other paradigms associated with functional programming languages.
- Designed for JavaScript interop, making it easy to integrate into existing codebases.

I want to bring particular attention to the last bullet point since it's the most important when discussing real-world codebases. A new toolchain doesn't amount to much if it doesn't easily integrate with existing systems.

To test this, I created a prototype with create-react-app and Tailwind (full code [available here](https://github.com/mgmarlow/rescript-cra)).

The whole toolchain integrates pretty seamlessly with Webpack, but in retrospect that's not too surprising because the JavaScript output from ReScript is really clean. Each file is compiled into something that almost resembles code written by a human.

I was surprised by the guidance to [keep the compiled JavaScript files version-controlled](https://github.com/ryyppy/rescript-nextjs-template/#why-are-the-generated-mjs-files-tracked-in-git) alongside their ReScript counterparts. Something about committing compiled output feels fundamentally wrong, even if one of the core contributors of ReScript is arguing for it. Either way, the implementor can choose which style they prefer.

My only real gripe with ReScript is the advertisement that it's "the fastest build system on the web". Now, how can that be possible when [ESBuild](https://esbuild.github.io/) exists?
