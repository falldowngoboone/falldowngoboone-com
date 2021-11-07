---
title: The curious case of flexbox gap and Safari
date: 2021-04-28
tags: 
  - blogruary
  - career
  - css
---

**Update at the end**

The `gap` property was first introduced to add inner grid spacing but was extended in the spec to work with flexbox. With one line of code, you can replace something like this:

---

```scss
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -0.5em;
}
.flex-container > * {
  margin: 0.5em;
}
```

with this:

```scss
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em;
}
```

That's nice, but Safari doesn't support `gap` in flexbox just yet. Normally I'd just reach for `@supports`:

```scss
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em;
}

@supports not (gap: 1em) {
  .flex-container {
    margin: -0.5em;
  }
  .flex-container > * {
    margin: 0.5em;
  }
}
```

Unfortunately, [Safari already supports `gap` in grid](https://caniuse.com/mdn-css_properties_gap_grid_context), so this doesn't work. This is one of those weird cases where there is no easy CSS-only solution, though there have been [proposals for workarounds](https://github.com/w3c/csswg-drafts/issues/3559).

This has left me scratching my head. You could [polyfill with JavaScript](https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/flexgap.js) or [use PostCSS](https://github.com/nkt/postcss-flexboxgrid), but at this point, is it worth it? That's a question that all frontend developers have to weigh from time to time, and there's no one-size-fits-all answer.

I will probably wait until Safari supports flexbox gap in the latest two versions before using it, mainly because it doesn't take that much more CSS to achieve the same effect. The only drawback is I cannot change the margins of the flex container. This can be overcome with an extra wrapper element, but then you're starting to complicate the markup.

If you want to read more about the flexbox gap issue, [check out this post from Ahmad Shadeed](https://ishadeed.com/article/flexbox-gap/). And if you found this post helpful, please like it on Dev Community and [let me know on Twitter](https://twitter.com/therealboone).

Until tomorrow!

## Update

As of Safari 14.1, [flex gap is now supported](https://caniuse.com/?search=gap)! This brings me one step closer to replacing my object styles that do the same thing. I typically wait until something is supported in the last two versions of the evergreen browsers (or can be worked around).

I would still love to have a way to use `@supports`, but I'll take what I can get. Anyway, happy coding!
