---
title: What Happened to Proper Tail Calls in JavaScript?
description: Why proper tail calls are important and why you can't use them in JS.
date: 2021-03-27
layout: ../../layouts/Article.astro
---

Proper tail calls (PTC) is a programming language feature that enables memory-efficient recursive algorithms. I'm not going to belabor the details of proper tail calls or how it pertains to JavaScript, as [Dr. Axel's article](https://2ality.com/2015/06/tail-call-optimization.html) already offers those explanations. Instead, I'm going to discuss the evolution of the feature in JavaScript since its genesis in ECMAScript 2015.

Despite its inclusion in the [2015 language specification](https://262.ecma-international.org/6.0/#sec-tail-position-calls), PTC is currently only supported by Safari. It is astounding that six years after the formal submission of the standard, only one major browser offers any kind of support.

- JavaScriptCore (Safari) ✔️([read about it here](https://webkit.org/blog/6240/ecmascript-6-proper-tail-calls-in-webkit/))
- V8 (Chrome, Edge, Opera) ❌
- SpiderMonkey (Firefox) ❌
- Carakan (Opera) ❌

Why are browser vendors ignoring PTC? V8 chalks it up to two main reasons:

1.  It makes it more difficult to understand during debugging how execution arrived at a certain point since the stack contains discontinuities, and

2.  [error.stack](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack) contains less information about execution flow which may break telemetry software that collects and analyzes client-side errors.

It's worth noting that V8 fully implemented proper tail calls but ultimately removed them, according to [their blog post from 2016](https://v8.dev/blog/modern-javascript#proper-tail-calls). To help outline a solution to the aforementioned problems, V8 created a proposal for an alternative approach called [syntactic tail calls](https://github.com/tc39/proposal-ptc-syntax) (STC). As the name suggests, it proposes a syntax for opting in to PTC, rather than supporting implicit opt-in.

The STC proposal is [hotly](https://github.com/tc39/proposal-ptc-syntax/issues/23) [debated](https://github.com/tc39/proposal-ptc-syntax/issues/22). The arguments tend to trend in one of two directions:

1. STC is unnecessary and defeats the purpose of PTC. Safari has implemented PTC since 2016 without issue, so most fears of implicit behavior are unwarranted.
2. STC is important to guard against potential problems with implicit behavior. As V8 summarized, PTC introduces educational concerns across developers and debugging concerns across implementations.

TC39 editors express a general hesitancy towards STC and a lack of faith for broader PTC adoption that is [well-summarized](https://github.com/kangax/compat-table/issues/819#issuecomment-226620936) by contributor Jordan Harband. Since 2017, the proposal has been [marked inactive](https://world.hey.com/mgmarlow/what-happened-to-proper-tail-calls-in-javascript-5494c256). There is no indication that the proposal will be revived or that PTC adoption will move in a forward direction.

All that drama aside, browser implementations are only one part of the story. What about Babel?

Similar to V8, Babel implemented and subsequently reverted both [proper tail calls](https://github.com/babel/babel/pull/701) and [tail call optimization](https://github.com/babel/babel/pull/714). The reference to PTC in Babel's [ES2015 documentation](https://babeljs.io/docs/en/learn#tail-calls) states,

> **Temporarily Removed in Babel 6**
>
> Only explicit self referencing tail recursion was supported due to the complexity and performance impact of supporting tail calls globally. Removed due to other bugs and will be re-implemented.

When will tail calls be re-implemented? Not in Babel 7, that's for sure. The uncertain fate of PTC requires JavaScript developers to reach for alternative approaches.

Kyle Simpson describes the use of a trampoline, a helper function that rewrites tail-recursive functions with while loops. His methodology is detailed in [Chapter 8 of Functional-Light JavaScript](https://github.com/getify/Functional-Light-JS/blob/master/manuscript/ch8.md/#trampolines).

Those looking for npm packages have a couple of options:

- [fext](http://glat.info/fext/), a library that enables optimizations by wrapping functions with its API.
- [babel-plugin-tailcall-optimization](https://github.com/krzkaczor/babel-plugin-tailcall-optimization), a plugin that automatically rewrites tail-recursive functions with trampolines.

PS, a final clarification for the pedantic:

The terminology of proper tail calls (PTC) and tail call optimization (TCO) is often conflated. Here's the difference between the two:

- proper tail calls: functions called in the tail position reuse the current stack frame, preventing the creation of additional stack frames that cause space inefficiency.
- tail call optimization: rewrites a recursive function into an iterative one, usually by calling goto.

The difference between the two is nuanced, though often mentioned in spicy Github threads. PTC only deals with stack manipulation, while TCO rewrites a recursive function as an iterative function. Find more details from Ward Cunningham's [tail call optimization wiki](http://wiki.c2.com/?TailCallOptimization).
