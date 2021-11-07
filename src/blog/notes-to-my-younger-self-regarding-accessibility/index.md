---
title: "Notes to my younger self: Regarding accessibility"
date: 2021-02-10
tags:
  - accessibility
  - blogruary
---

Hello, my younger self. How are things? I understand you're learning about the amazing world of web accessibility, something I wholeheartedly endorse.

---

Actually, that's why I'm writing to you. What I'm about to tell you might hurt, but I think you can handle it. There are some things you're doing right now, things that you might think are helpful. Well, uh, they really aren't. In fact, they're pretty terrible.

## You don't need all those `nav` elements

First, why so many `nav`s on a single page? Multiple `nav` elements can create a lot of unnecessary noise for screen reader users. Remember what the `[nav` element spec](https://html.spec.whatwg.org/multipage/sections.html#the-nav-element) says:

> Not all groups of links on a page need to be in a nav element — the element is primarily intended for sections that consist of **major navigation blocks [emphasis mine].**

*Major* navigation blocks. Not every single link list in the `footer`. C'mon, man! 

Oh, and if you must have multiple `nav`s, make sure you label any that aren't the primary site navigation:

```html
<nav aria-labelledby="nav-label">
	<h2 id="nav-label">Secondary</h2>
	<ul>
    <!-- links in here -->
  </ul>
</nav>
```

Alternatively, you could use `aria-label`:

```html
<nav aria-label="secondary">
	<ul>
    <!-- links in here -->
  </ul>
</nav>
```

Just keep in mind that in the far, far distant future of 2021, content in `aria-label` still isn't translatable.

## Navigation links aren't menu items

Here's a snippet of actual code you wrote with your actual hands:

```html
<nav class="...">
  <ul class="...">
    <li id="...">
      <a role="menuitem" class="..." href="..." aria-expanded="false" aria-controls="..." aria-haspopup="true">
				...
			</a>
			<!-- more insanity omitted -->
```

I see you've learned about `aria` attributes. That's...nice.

There's just so much wrong here, but what I want to focus on is the `role="menuitem"`. All [menu roles](https://www.w3.org/TR/wai-aria-1.1/#menu) are meant for application menus, not navigation links. Unless you're building the browser equivalent of Photoshop, [stay away from them](https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html).

Also, I don't know what you're up to with all those `aria` attributes, but I know it can't be good.

## Hide invisible content from screen readers

Remember when you coded up that swanky dropdown menu that faded in and out? Yeah, that was slick! Remember the CSS you used?

```scss
.dropdown-panel {
	opacity: 0;
	transition: opacity 200ms;
	// other stuff

	&.is-open {
		opacity: 1;
	}
}
```

First of all, kudos on animating `opacity`. You're thinking about performance, and that's a Good Thing.™ But I think you're missing something.

Did you know that elements set to `opacity: 0` can still be read by screen readers? By the look on your face, I can see you didn't know that. Something else you probably didn't realize is since `opacity: 0` doesn't remove elements from the focus order, keyboard users get to tab through all 500 invisible links in your mega site nav.

If you are hiding elements for sighted users to reduce cognitive noise, you should do the same for screen readers. Remember that accessibility is about creating equivalent experiences. `display: none` is a much better choice here to completely hide the panel from everyone. 

What's that? You can't animate `opacity` when you're using `display: none`? Well, use JavaScript here, ya silly. It's already a requirement for your dropdown menu to work. Here's an [example Codepen](https://codepen.io/falldowngoboone/pen/qBqaRvx?editors=0010).

## That's it for now

There's more to discuss, for sure, but frankly, I don't have the strength to go on. Perhaps some other time. I want to leave you with some advice.

First, one day you'll want to write a [daily blog post for an entire month](https://www.falldowngoboone.com/blog/blogruary-28-days-of-posting/). Make sure you do more planning so you don't end up writing weird stuff like this at the last minute. Second, reach out to me through this magical time machine internet connection and [say hi to me on Twitter](https://twitter.com/therealboone). I get lonely sometimes.

See you in the future!