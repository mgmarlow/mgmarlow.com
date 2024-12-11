---
title: The Most Common React Mistake
date: 2024-12-10
description: |
  React promises that "learning React is learning programming"
  but the framework has its own share of subtle complexities
  that stretch well beyond vanilla JavaScript.
---

The React homepage promises that "learning React is learning programming" and I
think the framework somewhat delivers on it. At the very least you don't need to
learn a new templating language thanks to JSX.

That said, don't be completely fooled by this promise. Like every other
JavaScript framework, React is full of subtle complexities and esoteric nuances
that have nothing to do with the language it's programmed in. In vanilla
JavaScript there's no such thing as "the rules of hooks" or the need to avoid
mutable variables in favor of `useState`.[^1]

The subject of this post is one such piece of esoteric knowledge that I see
newcomers trip up against when learning React (spoilers: it's `useEffect`). It's
a great demonstration of the subtle complexities of React, where the promises of
JavaScript-ness meet the reality of framework design.

## The problems of syncing async state

A classic point of friction is the introduction of asynchronous code. You have
some data from the server and you want to render it in your component to
populate the initial values of a form. That last bit is where the bug arises,
forms usually use controlled components which hold onto their values via
`useState` calls. Attempting to populate the initial value of `useState` hooks
from asynchronous code inevitably runs into a tricky issue. It's easiest to
demonstrate by example.

Here's a simple component that wraps an HTML `input` and captures its value:

```jsx
const MyInput = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText)

  const handleChange = (ev) => {
    setText(ev.target.value)
  }

  return <input value={text} onChange={handleChange} />
}
```

It's a
[controlled input](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
because the state variable `text` dictates the value of `input`. You might
render `MyInput` in the template of a form, like so:

```jsx
const App = () => {
  return (
    <form>
      <MyInput />
    </form>
  )
}
```

Perhaps even with an initial value by passing the prop `initialText`:

```jsx
const App = () => {
  return (
    <form>
      <MyInput initialText="starting value" />
    </form>
  )
}
```

This is all fine and dandy. The input correctly initializes with the value of
`initialText` when passing a string and correctly handles user input.

The problem arises when `initialText` is asynchronous, as is often the case when
dealing with forms that are populated with data from a server. For example,
introducing a new function `getTextFromServer` that simulates a 300ms response
time:

```jsx
const getTextFromServer = (ms = 300) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('text from server')
    }, ms)
  })

const App = () => {
  const [asyncText, setAsyncText] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const text = await getTextFromServer()
      setAsyncText(text)
    }

    fetch()
  }, [])

  return (
    <form>
      <MyInput initialText={asyncText} />
    </form>
  )
}
```

A routine operation in React code: wrap an async fetch call with a `useEffect`
and monitor the async state with `useState`. However, run this code and you'll
find a bug. Can you spot it in the code?

Here's the problem: the initial value of `MyInput` is never populated with the
value of `asyncText`. It remains blank, even after the `getTextFromServer`
promise resolves.

Naturally the first step is to log out what's going on with `initialText`. Is
the prop not being updated?

```jsx
const MyInput = ({ initialText }) => {
  console.log(initialText)
  // ...
```

Here's what you'll see:

```text
""
"text from server"
```

Well, actually this looks right. On the first render pass, the value is `""`,
the initial value of the `useState` in the parent. After `getTextFromServer`
responds with the string `"text from server"`, that `useState` is updated and
the child component, `MyInput`, is re-rendered. It receives the new value of
`"text from server"` from props.

Well then, how come `MyInput` is blank?

This is where the most common React mistake is introduced. At this point in
debugging, a new developer searches for a framework solution to this problem. We
just encountered one such solution for handling async state by using
`useEffect`, what if we were to use it again?

```jsx
const MyInput = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText)

  useEffect(() => {
    setText(initialText)
  }, [initialText])

  const handleChange = (ev) => {
    setText(ev.target.value)
  }

  return <input value={text} onChange={handleChange} />
}
```

Now when the value of the `initialText` prop updates asynchronously, `MyInput`
updates to match. The `useEffect` monitors the dependency change in
`initialText` and calls `setText` in response. No more blank input!

Generally when I see this kind of code appear in the wild, it's accompanied by
the text "for some reason React isn't updating `MyInput` with the new value of
`initialText` so I put in a `useEffect` to keep things in sync." That "for some
reason" is revealing: something is happening in React-land that I don't really
understand, but at least I solved it using a React-like solution.[^2]

Here's the rub: sure, this code solves the problem. But it's also incredibly
brittle. This solution isn't obviously incorrect because developer machines are
fast and we're usually dealing with sub-100ms response times from whatever API
we're working with. In other words, because of quick response times, a developer
might not notice the pop-in when `MyInput` is updated with the asynchronous
value.

The thing is slow connections (e.g. mobile phones accessing your application,
server saturation, etc.) will experience increasingly worse pop-in because of
this `useEffect` change. In the worst-case scenario, a user could type text into
`MyInput` and have that text cleared away by the `useEffect` after `asyncText`
is loaded! Try increasing `getTextFromServer` to `3000` and see the result
yourself.

The other problem with this kind of code is that we've effectively doubled the
number of renders of the `MyInput` component. Sure, in this contrived example
more renders is not doing any harm, but you can imagine that for particularly
complicated components that set 10s of hundreds of different pieces of state,
additional renders are to be avoided. State-syncing code of the kind in this
example often leads to more state-syncing due to extraneous render passes, a
problem that keeps on giving as your application grows.[^3]

So what's actually happening with the `MyInput` `useState`? Why isn't it picking
up the new value of `initialText` from the component prop? The answer is hidden
away in the React documentation (emphasis mine):

> `useState` Parameters:
>
> - `initialState`: The value you want the state to be initially. It can be a
>   value of any type, but there is a special behavior for functions. **This
>   argument is ignored after the initial render**.

"Ignored after the initial render", meaning even though the prop `initialText`
is updated correctly, the `useState` that wraps `text` doesn't care. It's
memoized such that any additional renders of the component will have no effect
on the state variable it encapsulates.

If you think about it, this behavior makes sense. In 90% of cases, you wouldn't
want your state variables to be blown away by component re-renders. When you use
`useState` you expect it to hold onto a value until `setState` is called, and
the memoization achieves that goal.

Now that we know more about how `useState` works behind the scenes, we can find
a different solution for the problem of handling asynchronous initial state.

## Solution: handle the pending state

So what should you do instead? The easiest solution is to have the parent
component own the loading state:

```jsx
const MyInput = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText)

  const handleChange = (ev) => {
    setText(ev.target.value)
  }

  return <input value={text} onChange={handleChange} />
}

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [asyncText, setAsyncText] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      const text = await getTextFromServer()
      setIsLoading(false)
      setAsyncText(text)
    }

    fetch()
  }, [])

  return (
    <form>
      {isLoading ? <p>loading...</p> : <MyInput initialText={asyncText} />}
    </form>
  )
}
```

`MyInput` goes back to its original form: a single `useState` that accepts
`initialText` as an argument. Because `MyInput` is only rendered when
`asyncText` has been fetched from the server (determined via `isLoading` in the
parent component) the resulting `useState` is called once with an initial value
of `"text from server"`. There's no longer any need to sync state because the
initial render of the component has the desired state.

I'll argue that thinking about loading states is actually the power of avoiding
`useEffect` to solve these kinds of problems. By moving control of the loading
state up the component hierarchy, developers need to put more thought into the
async nature of their application and how the UI will handle it.

Going back into the discussion of React complexity and the burden of frameworks,
the whole counter-intuitive nature of `useState` discarding its argument after
the first render is a mind-bender for the beginner. I could imagine spending a
few hours on this problem and getting nowhere because it's hard to conceptualize
that the cause is actually within the framework itself, buried in the
implementation detail of memoization in the `useState` hook. It takes time to
encounter these kinds of issues in React, but spend enough time with it and they
will inevitably rise to the surface.

[^1]:
    Although of course there's the vanilla JS alternative of needing to
    re-render the DOM when you update application state, but that's neither here
    nor there.

[^2]:
    I want to re-emphasize that I don't think the developer is at fault here.
    They encountered a subtle problem that is super confusing and solved it
    using the tools React gives them. I think it's a very natural way of
    thinking about things.

[^3]:
    State-syncing begets more state-syncing because the lifecycle of state
    values becomes hard to reconcile, and the only solution is to set state
    again to ensure everything is the most recent.
