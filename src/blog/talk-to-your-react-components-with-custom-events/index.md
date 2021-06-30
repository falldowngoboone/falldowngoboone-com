---
title: Talk to your React components with custom events
date: 2021-02-23
tags: 
  - blogruary
  - javascript
  - react
---

I build pages with both React and non-React components, and sometimes all these components need to talk to each other. Examples include opening a React modal when a customer clicks a button or updating a text block when a customer adds a product from a React stepper. There are many ways to do this, but in my opinion, the best way is to use [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).

## What are custom events?

Custom events are just like regular browser events (e.g. "click", "keyup", etc.) except they're manually created. You can create a simple synthetic event with a custom type using the [`Event` constructor](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)[^ie]:

```jsx
const event = new Event('build');
document.dispatchEvent(event);
```

If you need to pass arbitrary data, you can use the `CustomEvent` interface[^iecustom]:

```jsx
const customEvent = new CustomEvent('build', { detail: { name: 'primary' } });
document.dispatchEvent(customEvent);
```

I use the `document` element as the single event handler for all custom events because it centralizes all event methods and decouples custom events from specific nodes on the page.

```jsx
document.addEventListener('build', function({ detail }) {
  const { name } = detail;
  ...
}
```

Using a single entity to manage events makes this approach act like a browser-native [publish-subscribe pattern](https://en.wikipedia.org/wiki/Publish–subscribe_pattern). Benefits to this pattern include decoupling (previously mentioned) and scalability.

## Example time!

I've built an [example app](https://stackblitz.com/edit/react-zqp3ot?file=src%2FApp.js) with [Create React App](https://create-react-app.dev) to illustrate this. The `App` component includes a modal built with [React Modal](https://github.com/reactjs/react-modal):

```jsx
// App.js

import * as React from "react";
import Modal from "react-modal";
import "./style.css";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
 }

 return (
   <div>
    <h1>Trigger modal outside React</h1>
    <p>Custom events are AWESOME!</p>
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <p>I was opened by a modal outside of React. How cool is that?</p>
      <button onClick={closeModal}>Close</button>
    </Modal>
  </div>
 );
}
```

The `isOpen` prop determines the `Modal` component open state. We then control this state using the `useState` hook.

We will create a button outside of the React component that opens the React app modal. Let's add the button to the page:

```html
<!-- public/index.html -->

<!-- ... -->
<button id="open-button">I'm outside React</button>
<div id="root"></div>
<!-- ... -->
```

To make things a bit easier and reduce event boilerplate, I've put our event functions into a module:

```jsx
// events.js

function on(eventType, listener) {
  document.addEventListener(eventType, listener);
}

function off(eventType, listener) {
  document.removeEventListener(eventType, listener);
}

function once(eventType, listener) {
  on(eventType, handleEventOnce);

  function handleEventOnce(event) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export { on, once, off, trigger };
```

You could go crazy and make this look more like traditional pub-sub implementations[^pubsub], or you could completely emulate the [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) interface if you want. Here I've tried to capture the most common functions.


Now that we have all the pieces in place we need to wire everything up.

## Putting it together

The next step is to publish an event when the open button is clicked. For this example app, I'm going to do that in the `index.js` file Create React App provides:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { trigger } from "./events";

import App from "./App";

const openButton = document.getElementById("open-button");
openButton.addEventListener("click", function() {
  trigger("openButton:click");
});

ReactDOM.render(<App />, document.getElementById("root"));
```

I've named the event `openButton:click`. I typically follow a pattern of `subject:verb`, mainly because that's what I learned way back in my jQuery days. A nice benefit of this pattern is it reduces the possibility of event name collisions.

Finally, we'll listen for that event inside the `App` component and set the `isOpen` state to `true` when it's triggered. Since adding event listeners is a side effect, we'll use `useEffect` to do that.

```jsx
import * as React from "react";
import Modal from "react-modal";
import { off, on } from "./events";
import "./style.css";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const openModal = React.useState(() => () => setIsOpen(true));

  React.useEffect(() => {
    on("openButton:click", openModal);
    
    return () => {
      off("openButton:click", openModal);
    }
  });

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <h1>Trigger modal outside React</h1>
      <p>Custom events are AWESOME!</p>
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        <p>I was opened by a modal outside of React. How cool is that?</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}
```

And now it works (hopefully)! You can [test it for yourself over on StackBlitz](https://stackblitz.com/edit/react-zqp3ot?file=src%2FApp.js).

## Custom events are awesome indeed

Custom events are great when you need two completely separate entities to talk to each other, which is a common problem in UI design. Be aware, though, this pattern's not all sunshine and rainbows. Drawbacks include an increased difficulty of maintenance (ghost events, or published events that are no longer listened to) and a higher degree of reasoning (indeterminate order of execution).

I hope I've at the very least piqued your interest in custom events, and maybe even given you a solution to a problem you're dealing with right now. If that's you, please do me a favor and like this article on DEV Community. And while you're at it, [follow me on Twitter](https://twitter.com/therealboone) so I don't get lonely.

Until next time!

[^ie]: Note this code will not work in Internet Explorer (what does, amirite?). You will need to use the [old-fashioned event constructor](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#the_old-fashioned_way).

[^iecustom]: The `CustomEvent` constructor is also unsupported in Internet Explorer (whomp whomp). They are created the same way as `Event`s, but initialize with [`initCustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/initCustomEvent).

[^pubsub]: One addition could be a method to remove all event listeners for a particular event. You would need to manually track listeners in an object since there's no way of directly accessing event listeners in native browser event handling.
