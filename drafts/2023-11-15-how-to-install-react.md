---
title: How to Install React
date: 2023-11-15
tags: javascript
---

Tsoding, a programming streamer whose content I enjoy, livestreamed a
bit of React the other day. For those unfamiliar, React is very much
not the general content of his streams. He tends to live-code systems
languages with projects like compilers, text editors, and so
on. Definitely a C-head through and through.

He had mentioned that he thought about learning React previously, but
ultimately gave up on the effort. Today was the day though, diving
into the React documentation and starting a new project from
scratch. Let's see, how do we install this thing?

Well if you consult the shiny new React documentation, [Start a New
React Project]() will immediately lead you to "production-grade"
frameworks like Next.js and Remix. I think this is very bad advice for
new developers.

Kickstarting a React project with a tool like Next.js or Remix (the
latter of which I am a big fan of) is a special amount of overkill for
a beginner learning React. Both of these frameworks introduce so many
concepts on top of React that it's effectively doubling the API
surface area, what with filesystem routing, loader APIs, form APIs,
progressive enhancement, and a whole suite of other terms guaranteed
to confuse someone new to the ecosystem. I mean, just take a look at
the [Remix documentation](), that's a ton of concepts to introduce to
the beginner!

I know SSR is the bee's knees these days, but React is a UI
framework. It shouldn't be so complicated to get started.

Now, maybe I'm not being fair to the React documentation. The
Installation page does mention that you can "Try React" via a embedded
codesandbox, or download some HTML to "Try React locally". In my
opinion though, both of these sound incredibly less appealing than
"Start a new React project". I don't want to try React, I want to
tinker with something! Let me `npm install` it like any other package
that I might grab from the JS ecosystem.

In the days of yore, [create-react-app]() was closer to this vision:
run this CLI and bootstrap a React project that is just a regular
React single page application. Nowadays [Vite]() has effectively
superceded this project, and its ommission in the React documentation
is surprising. Are we really not building SPAs anymore? Regardless,
both of these projects still hide quite a few of the details of the
React build process behind some fancy developer experience
upgrades.

For curious engineers, what's the path to starting React with a
complete view of its build process? How would I have recommended
Tsoding to approach React before going down a lengthy Babel rabbit
hole?

## How to actually install React

Although I wouldn't recommend doing this in production, it's useful as
an academic exercise to try using React without a build step. There
are a few different ways of achieving this, but I think the most
illustrative is the ECMAScript module (ESM) approach that ditches JSX
support. Don't get me wrong, JSX is a core feature of React and the
next section with esbuild will enable it. For now, I think it's
interesting to start with what JSX actually means after it's been
compiled into JavaScript that the browser understands.

First we put together some HTML boilerplate into `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hello, React</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

The `type="module"` specifier in the script tag is important because
it denotes that we're using ESM in the associated script.

Before ESM, you really only had two choices when dealing with
JavaScript dependencies: either you include the dependency as a
separate script tag that binds itself to the `window` object, or you
use a bundler with Node that uses its own module format
(e.g. commonJS). With ESM, we now have a module format that is
natively supported by modern browsers, so we can avoid littering our
`index.html` with script tags while maintaining the ability to split
our application into independent modules.

Next we set up our React application with some ESM imports from the
[esm.sh CDN](https://esm.sh/):

```js
import { createElement } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

const App = () => {
  return createElement("h1", {}, "hello react");
};

const root = createRoot(document.getElementById("app"));
root.render(createElement(App));
```

Yes, I am cheating by using the `createElement` API instead of
JSX. We'll get to JSX later.

Finally, since we're using ESM we can't just open `index.html` in our
browser and expect it to work. We need to serve the files with a
proper web server.

```text
npx http-server .
```

Now browse to <localhost:8080> and you're running React.

### JSX with esbuild

The previous walkthrough is missing a big piece of the React pie:
JSX. No one wants to write React using the `createElement` API, that's
just asking for a bad time. To use JSX we need to set up a proper
build system that will compile our JSX code into plain JavaScript that
the browser understands. In effect, the JSX compiler turns JSX code
into the equivalent `React.createElement` expression.

First, rename `index.js` to `index.jsx` and modify the script to use
JSX without a CDN.

```jsx
import { createRoot } from "react-dom/client";

const App = () => {
  return <h1>hello react</h1>;
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
```

Note that we ditched the import for React altogether, we won't need it
for this version. When we compile our code with esbuild, we are going
to opt in to the automatic JSX runtime, which removes the need for an
explicit React import statement.

Next, bring in a few dependencies.

```shell
npm init -y
npm install react react-dom --save
npm install esbuild --save-dev
```

And set up a build script in `package.json`:

```json
"scripts": {
  "build": "esbuild index.jsx --jsx=automatic --bundle --outfile=out.js"
}
```

Update `index.html` to point to the new bundle:

```html
<!-- snip -->
  <div id="app"></div>
  <script type="module" src="./out.js"></script>
<!-- snip -->
```

The workflow has changed a bit from the previous iteration. Before
running your web server, first run a build: `npm run build`. That
generates a 1MB JavaScript bundle, `out.js`, that is the new
entrypoint for our application.

### Why esbuild?

Before esbuild, the most common JSX toolchain was the Babel JSX
transform plugin. It was common to configure a Babel toolchain with
Webpack, including plugins for JSX transform, polyfills, and any other
experimental ECMAScript features that you might need for your
application. The Babel/Webpack toolchain is incredibly flexible and
fits a wide-variety of applications, but does so at the cost of
performance. Running Webpack with the Babel JSX transform plugin is
order of magnitude slower than running esbuild.


