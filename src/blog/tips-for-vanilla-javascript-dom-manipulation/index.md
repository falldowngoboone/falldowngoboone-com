---
title: Tips for vanilla JavaScript DOM manipulation
date: 2021-02-22
tags: 
  - blogruary
  - javascript
---

If you need to go *au naturale* with your JavaScript DOM manipulation, here are some tips for improving performance.

---

## Use `DocumentFragment`s to add multiple elements

Here's one way you might add multiple DOM nodes to a mounted node:

```jsx
var root = document.getElementById('fruit-list');
var fruitItems = ['apple', 'orange', 'banana'].map(function(fruit) {
	var item = document.createElement('li');
	item.innerText = fruit;
	return item;
});

for (var i = 0; i < fruitItems.length; i++) {
	root.appendChild(fruitItems[i]); // page reflows every time
}
```

This code works, but the issue is the page will reflow every time `appendChild` is called. If you have a long list of items to add, you're going to end up in a serious performance bottleneck, and an unhappy boss. The solution is to use a `[DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)`:

```jsx
var root = document.getElementById('fruit-list');
var fragment = document.crateDocumentFragment();
var fruitItems = ['apple', 'orange', 'banana'].map(function(fruit) {
	var item = document.createElement('li');
	item.innerText = fruit;
	return item;
});

for (var i = 0; i < fruitItems.length; i++) {
	fragment.appendChild(fruitItems[i]); // no page reflow!
}

root.appendChild(fragment);
```

The `appendChild` method is only called once, and this makes browsers (and my boss) very happy.

## But if you can, use `ParentNode.append`

You can think of the `[ParentNode.append](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append)` method as `appendChild` on steroids (sans the rage and adult acne). Unlike its puny cousin `appendChild`, `append` can take multiple nodes, automatically converts string arguments to text nodes, and it utilizes `DocumentFragment` for us:

```jsx
// the `consts` are my way of letting you know this is newer...🙃

const root = document.getElementById('fruit-list');
const fragment = document.crateDocumentFragment();
const fruitItems = ['apple', 'orange', 'banana'].map(function(fruit) {
	const item = document.createElement('li');
	item.innerText = fruit;
	return item;
});

root.append(...fruitItems);
```

This is the most convenient way to add multiple nodes to a parent node. [Support is great](https://caniuse.com/mdn-api_element_append) if you don't have to prop up Internet Explorer. Luckily, if you do, there's a [polyfill](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append#polyfill) for that.

## Create `DocumentFragment`s from strings with `Range`s

Imagine a world where you want to create HTML from a string. You might do something like this:

```jsx
// orange you getting tired of this example yet?

const root = document.getElementById('fruit-list');

root.innerHTML = `
	<li>apple</li>
	<li>orange</li>
	<li>banana</li>
`;
```

This is nice if you're trying to recreate JSX, but it's not as performant as using `DocumentFragment`s. Luckily there's a way to directly create a `DocumentFragment` from a string. Contrived code warning:

```jsx
const root = document.getElementById('fruit-list');
const fragment = document.createRange().createContextualFragment(`
	<li>apple</li>
	<li>orange</li>
	<li>banana</li>
`);

root.appendChild(fragment);
```

The `createRange` method returns a `Range`, which is a representation of a sliver of the current DOM document. The `createContextualFragment` creates a `DocumentFragment` using a parsing algorithm based on the current document's context (in this case, HTML). `Range` methods are meant to be convenience methods built on top of common node editing patterns with optimization in mind, and I'm quite interested to learn more about them.

## Memorize the DOM properties that trigger layout

The DOM API is tricky because just observing certain node properties can trigger page layout. Doing this multiple times in a row can be a performance problem. Doing this inside a loop can cause [layout thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing) (trust me, it's as bad as it sounds).

You'll want to be aware of what DOM properties cause the browser to trigger layout, so you need to get to memorizing. Or you could simply bookmark this convenient [list of properties that cause layout](https://gist.github.com/paulirish/5d52fb081b3570c81e3a).

## This is only scratching the proverbial surface

There's more to DOM layout with vanilla JavaScript, to be sure. I'm interested in looking at some of the performance optimizations VDOM libraries employ to eek the most out of DOM manipulation. I kinda like that sort of thing.

I hope you learned something new today. And if you did, please consider liking this post on DEV Community, and let me know on Twitter. I get lonely sometimes.

Until next time!
