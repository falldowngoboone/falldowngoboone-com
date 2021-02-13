---
title: The address element
date: 2021-02-13
tags:
  - blogruary
  - html
---

Did you know there's an `address` element? Well, brace yourself, because there is! But its use has been a source of confusion until recently.

In the past, the `address` element was strictly used for content author info, something it's still useful for:

```html
<article>
  <!-- article content -->
  <footer>
  <p>Like my stuff? As the kids say, drop me a line via electronic mail:</p>
  <address>
  <a href="mailto:rick.cooldood78@example.com">Ricky Cooldood 😎</a>
  </address>
  </footer>
</article>
```

Note that this example has the `address` element nested within a sectioning element, in this case, an `article`. This is what associates the contact information with the content. If you wanted to associate it with the entire site, you would drop it into the site's main `footer`.

Of course, you would think that you could use an `address` element for addresses as well, but that has not always been the case. Thankfully, a recent [change in spec](https://www.w3.org/TR/html52/grouping-content.html#the-address-element) allows for the one thing you would think it could be used for:

```html
<address>
  Richard Cooldood<br>
  1234 No Way Yes Way<br>
  Awesome, USA 77777
</address>
```

This makes me incredibly happy. Probably too happy. 

Anyway, if you need more granular semantics around an address, you can use a structured data format like [Microdata or RDFa](https://schema.org/address).

If you'd like to hear more about structured data, [let me know](https://twitter.com/therealboone), and while you're at it, hit the follow button, because I'm going to keep writing stuff and you might as well read it, right?