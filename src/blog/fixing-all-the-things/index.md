---
title: Fixing all the things
date: 2021-02-12
tags: 
  - accessibility
  - blogruary
---

If you didn't already know, [your CSS can influence screen readers](https://benmyers.dev/blog/css-can-influence-screenreaders/). One of the most surprising things to me was learning that VoiceOver removes list semantics from `ul`s and `ol`s when `list-style-type: none` is applied to them.

---

Turns out, this is actually intended behavior:

> This [not announcing a list for a groups of links when list-style is set to none] was a purposeful change due to rampant "list"-itis by web developers…Basically, if you remove all default visible indication of the list, there is no indication to a sighted user or screen reader user that the content is a list…
>
>—James Craig, [Webkit Bugzilla](https://bugs.webkit.org/show_bug.cgi?id=170179#c1)

This is one of those interesting things that may seem wrong to developers that apparently was annoying accessible technology users. James goes on to say the easiest way to fix this is to explicitly define a list role on the list:

```html
<ul role="list">
	<!-- list content here -->
</ul>
```

Unfortunately, as Scott O'Hara reminds us in his [fantastic write up on this issue](https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html), the [first rule of ARIA](https://www.w3.org/TR/using-aria/#rule1) is to not use it when there are existing HTML elements that already have the needed role. Scott mentions a nice [CSS-only fix](https://gerardkcohen.me/writing/2017/voiceover-list-style-type.html) put forth by [Gerard Cohen](https://gerardkcohen.me/index.html) and retweeted by [Sara Soueidan](https://www.sarasoueidan.com):

```css
.list li {
	list-style-type: none; /* remove bullets */
}

.list li::before {
	content: "\200B"; /* add zero-width space */
}
```

I think my biggest takeaway from Scott's article, though, is that "bugs" like this may be best left alone:

> While this behavior can be unwelcome in some situations, let’s also not spend too much effort over correcting an over correction which was in response to an over use of unnecessary semantics.

VoiceOver users are used to the quirks that the technology presents. Forcing a consistent experience may end up making things worse. Just like everything else in web development, you need to test with real people.

When I began my journey of learning about accessibility, I enthusiastically "fixed" everything I could find in my code, usually over-complicating markup and making things worse for people. More often than not, it pays to keep it simple.

If you'd like to hear more about how I've overcomplicated things in the past, check out this [letter to my younger self](https://www.falldowngoboone.com/blog/notes-to-my-younger-self-regarding-accessibility/), or you can just ask me on [Twitter](https://twitter.com/therealboone) about all the hot garbage code I've been known to write. Maybe you can learn from my (many) past mistakes.