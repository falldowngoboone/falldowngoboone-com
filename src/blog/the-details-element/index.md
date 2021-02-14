---
title: The details element
date: 2021-02-14
Tags: 
  - blogruary
  - html
---

The `details` element is one of my favorite HTML elements. Yes, I have favorite HTML elements. Yes, I know that's weird.

## The Disclosure pattern

So, what does this wonderful element do? Out of the box, it's a way to natively achieve the [disclosure pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#disclosure).

The disclosure pattern involves some content and a button (the `summary` element) that controls the visibility of that content. When the content is hidden, the button shows the content. When the content is shown, the button hides the content.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="falldowngoboone" data-slug-hash="QWGdaNX" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Details">
  <span>See the Pen <a href="https://codepen.io/falldowngoboone/pen/QWGdaNX">
  Details</a> by Ryan Boone (<a href="https://codepen.io/falldowngoboone">@falldowngoboone</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Previously this was something that you could only do with JavaScript. And while it wasn't difficult to do, I love when I can replace JavaScript with a native element that Just Works.™ 

## What's it good for?

`details` is a perfect fit for FAQs. You don't even have to do that much extra styling. 

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="falldowngoboone" data-slug-hash="PobWvKq" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Native FAQ">
  <span>See the Pen <a href="https://codepen.io/falldowngoboone/pen/PobWvKq">
  Native FAQ</a> by Ryan Boone (<a href="https://codepen.io/falldowngoboone">@falldowngoboone</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

And even though `details` isn't a native accordion element (personally, I would rather have a `tabs` element), it goes a long way toward a nicer progressive enhancement experience:

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="falldowngoboone" data-slug-hash="xxRgWyV" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Cheap accordion">
  <span>See the Pen <a href="https://codepen.io/falldowngoboone/pen/xxRgWyV">
  Cheap accordion</a> by Ryan Boone (<a href="https://codepen.io/falldowngoboone">@falldowngoboone</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Just bear in mind that you'll need to add some extra [ARIA roles and keyboard support](https://w3c.github.io/aria-practices/examples/accordion/accordion.html) on top of the default element.

## Menus

One particular type of use for `details` is really why I'm so fascinated with them. GitHub has implemented a pattern to use the element for their [menus](https://docs.google.com/presentation/d/1hvnPpsJo44BTPfJx28CV95vqk_dt6na1awUbk0kmZYM/edit#slide=id.g3e31444916_0_48). It's pretty ingenious.

My favorite part of their implementation is adding a pseudo-element to the `summary` element that covers the entire screen. This elegantly closes the menu with an outside click:

```css
[open] > summary:before {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 80;
	display: block;
	cursor: default;
	content: " ";
	background: transparent;
}

.details-menu {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 100;
	/* more specific styles...*/
}
```

## Gotchas

Of course, it wouldn't be the web if it didn't have any gotchas. First, `[summary` styling](https://css-tricks.com/quick-reminder-that-details-summary-is-the-easiest-way-ever-to-make-an-accordion/) is a bit inconsistent across browsers, but [nowhere near as weird as other elements](https://www.smashingmagazine.com/2020/11/standardizing-select-native-html-form-controls/).

Second, `summary`s can include a single heading element (`h1–6`), but because it natively carries the implicit ARIA role of `button`, any children, including headings, will be stripped of their semantic role. Depending on what's used, certain [screen reader and browser combinations may not recognize heading children](https://www.scottohara.me/blog/2018/09/03/details-and-summary.html#screen-reader-support) or allow them to be used for navigation.

Finally, there is no support in Internet Explorer, which is becoming less and less of a problem every day. There is a [polyfill](https://github.com/javan/details-element-polyfill), but I would simply let the content display completely. Unless it's absolutely necessary, sending more JavaScript to less capable browsers just for consistency's sake doesn't make much sense to me.

## Semantics for the win

So, `details` provides a simple, semantic way to implement the common disclosure pattern. Its flexibility and availability make it a powerful addition to any frontend developer's arsenal.

Do you have a favorite HTML element? [I would love to hear about it](https://twitter.com/therealboone). And if you're reading on Dev Community, please consider liking this post and sharing it with others. It makes me feel all warm inside and stuff.

Till next time!