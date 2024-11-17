---
title: How to Install React
date: 2023-11-17
tags: javascript
---

Tsoding's [recent stream about React](https://youtu.be/XAGCULPO_DE) is a
hilarious reminder of the complications of web development tooling and the lack
of support for beginners who want to take a bottom-up approach to learning.

What I found most surprising about his foray into React is actually the React
documentation itself. It fails to provide any detail into setting up a React
build environment yourself, instead recommending frameworks and tools that hide
away the build mechanisms such that they're entirely opaque to the developer.
For those who want to learn how things work from start to finish there's not
much path forward, and it is all too easy to stumble onto old tools and
processes that have been left to decompose after their fifteen minutes of fame.

For example, the documentation for
[Start a New React Project](https://react.dev/learn/start-a-new-react-project)
points developers towards Next.js or Remix, frameworks that I view as highly
specialized and SSR-first. I can't believe that this is an acceptable starting
point for a complete beginner, not only is React super complicated in and of
itself, but to have to learn the abstractions of a meta-framework on top of
that? Sounds like a nightmare! The
[Remix documentation](https://remix.run/docs/en/main) alone offers a staggering
number of APIs. Where does React end and the framework begin? How is a beginner
supposed to know the difference?

It's also rather humorous how far React has moved away from its original goal of
being
["A JavaScript library for building user interfaces."](https://web.archive.org/web/20171228052523/https://reactjs.org/).
I know SSR is the bee's knees these days but I don't think it should be
emphasized over the fundamental build processes that make the whole thing work.

In the days of yore, [create-react-app](https://create-react-app.dev/) was
closer to this vision: run this CLI and bootstrap a React project that is just a
regular React single page application. Nowadays [Vite](https://vitejs.dev/) has
effectively superseded this project, and its omission in the React documentation
is surprising. Regardless, both of these projects still hide the details of the
React build process behind a velvet curtain.

I do think it's important for beginners to familiarize themselves with some of
the fundamental tools that drive their favorite frameworks. The new kids on the
block like [esbuild](https://esbuild.github.io/) are super approachable and
don't involve setting up convoluted Webpack configs or plugin pipelines. The
rest of this post will demonstrate setting up a new React project with esbuild.

## Why esbuild?

Why do we even need a build system in the first place? The answer is explained
in more detail in the next section, but the primary reason is to support
[React's JSX syntax](https://react.dev/learn/writing-markup-with-jsx). Browsers
don't know what JSX is, so we convert it to JavaScript beforehand.

Before esbuild, most developers were transforming JSX via the
[Babel JSX transform plugin](https://babeljs.io/docs/babel-plugin-transform-react-jsx)
together with a Webpack configuration that handled templating, static files, and
other optimizations. Now you could go and install Babel manually, like Tsoding
did in his stream, and use that instead for your new React project. However,
Babel is both more complicated and slower than esbuild, so I don't think it's a
good entrypoint for beginners.

The [esbuild compiler source code](https://github.com/evanw/esbuild) is also a
great read.

## How to actually install React

Start by initializing a new npm project:

```shell
mkdir react-hello-world
cd react-hello-world
npm init -y
```

Then add your dependencies, [React](https://www.npmjs.com/package/react),
[ReactDOM](https://www.npmjs.com/package/react-dom), and
[esbuild](https://www.npmjs.com/package/esbuild).

> Why are `react` and `react-dom` different packages? I can only guess at the
> intentions of the React core team, but my assumption is react-dom and react
> are separate packages to enable some of the non-browser React targets, like
> React Native. By shipping them in two packages, you can keep using `react` for
> your application's component/UI code, and easily swap in the
> `react-dom`/`react-native` entrypoints depending on whether you're building a
> web or mobile application. Since we're working with React in a browser, we'll
> need ReactDOM to configure the library to the DOM.

```shell
npm install react react-dom --save
npm install esbuild --save-dev
```

We use `--save` on React and ReactDOM because they're application dependencies,
things that our application runtime actually depends on. We use `--save-dev` for
esbuild since it's a development dependency, it's only needed to compile our
application. This is a bit of a pointless distinction at this point, since we're
going to compile our application into a static JS file anyway, but hey, best
practice.

There are two pieces of boilerplate that we need to fill in next, the
`index.html` webpage where our JavaScript is loaded, and `index.jsx` which
contains the contents and initialization of our React application.

First `index.jsx`:

```jsx
import { createRoot } from 'react-dom/client'

const App = () => {
  return <h1>hello react</h1>
}

const root = createRoot(document.getElementById('app'))
root.render(<App />)
```

And then `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Hello, React</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./out.js"></script>
  </body>
</html>
```

The important bit to note here is that the script tag in `index.html` is
pointing to a file that is yet to exist: `out.js`. Normally JS doesn't require a
build step (although when shipping to production it is a good idea for asset
minification, among other reasons), but React is a special case because of the
JSX syntax. JSX is not part of the ECMAScript specification and is therefore not
known to the browser, so we have to add support for it by compiling our JSX code
into plain old JS (hence esbuild).

In versions of React before the automatic runtime (which I'll get into in a
second), JSX compilation looked something like the following.

This JSX:

```jsx
// original.jsx
import React from 'react'

function App() {
  return <h1>Hello World</h1>
}
```

Is compiled to this JS:

```js
// compiled.js
import React from 'react'

function App() {
  return React.createElement('h1', null, 'Hello world')
}
```

In fact, you could write your entire app using the `React.createElement` API and
avoid the compilation step (although in practice JSX is really why you're here
anyway).

Nowadays the compilation situation is a little more complicated. Programmers
found that repeating the `import React from "react";` line at the top of every
JSX file was onerous, so the ecosystem grew to support a JSX syntax that doesn't
require it. This is known as
[the automatic JSX runtime](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

Modern JSX is written without the import statement, like so:

```jsx
// original.jsx
function App() {
  return <h1>Hello World</h1>
}
```

And the compiled JS output is likewise changed to support this new syntax:

```js
// compiled.js
import { jsx as _jsx } from 'react/jsx-runtime'

function App() {
  return _jsx('h1', { children: 'Hello world' })
}
```

The `react/jsx-runtime` is now imported as the responsibility of the compiler,
not the programmer.

All this to say that we'll need to enable the automatic JSX runtime when we
compile our `index.jsx` script into `out.js`. Luckily esbuild supports this out
of the box.

Add the following build script to your `package.json`:

```json
"scripts": {
  "build": "esbuild index.jsx --jsx=automatic --bundle --outfile=out.js"
}
```

The other point of note is the `--bundle` flag which inlines all of the
dependencies needed for the application during the build. For our application,
that means esbuild will insert React and ReactDOM from their respective
`node_modules/` into `out.js` during the build. `out.js` is referred to as a
"bundle" (hence `--bundle`) because it now contains our application and all of
its dependencies.

```shell
npm run build
```

After running the build, you can open up `index.html` in your browser and see
your new React app in all of its glory.

## What should new developers actually use when starting new projects?

Look, meta-frameworks like Next.js and Remix are rad. They bake in a ton of best
practices and make it easy to deliver very complicated web applications while
avoiding the pitfalls of a single page application. That said, I don't think
they're a good place for a beginner to start.

Instead, poke around with the different build tools that underly these
frameworks and learn how those megabytes of JS are actually delivered to your
end users. Focus on learning the principles of React alone, and not the
meta-framework glue that gives so many fancy features beneath layered
abstractions.
