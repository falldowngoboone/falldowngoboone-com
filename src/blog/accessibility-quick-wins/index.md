---
title: Accessibility quick wins
date: 2021-02-09
tags:
  - accessibility
  - blogruary
---

I sometimes give talks on Web accessibility, and one of the top questions I get is: *What can I do right now to make my website more accessible?* When I began *practicing* accessibility, I would've probably talked about WAI-ARIA authoring practices, and adding `aria` roles, and managing focus with JavaScript. That's certainly true for more complex UI, but most of us aren't building Twitter. 

---

In reality, the most common accessibility problems can be fixed with simple solutions. What follows is a list of some of the quick wins I've compiled from online survey results, third-party auditors, and the A11y Slack group.

## Use colors with the proper contrast

This one's truly easy. [Check the color contrast](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#contrast) on your page. This should be the designer's job, but frontend developers should be diligent to double-check and make suggestions as necessary. Usually, it doesn't take many tweaks to ensure the correct contrast ratio.

## Add an `alt` attribute to all your images

This is a super-quick win. According to the [2020 WebAIM Million](https://webaim.org/projects/million/) survey, one of the top accessibility errors online was missing `alt` attributes on images. It's always a good idea to include [effective alt text](https://moz.com/learn/seo/alt-text) on images that are not purely decorative. 

It's important to note that **if you don't add an alt attribute, the default behavior of screen readers is to announce the source link of the image,** which can be annoying, especially if you're including hashes in the filename for cache-busting. So what about images that *are* decorative? Use a null value (`alt=""`). Better yet, add decorative images as background images via CSS (`background-image: url('link/to/image');`).

## Ensure all links have meaningful labels

One way screen reader users can quickly navigate content is by jumping through all the available page links. When all the links on the page are either "Click here", nonsense (e.g. icon fonts), or empty (e.g. an SVG icon without a label), navigating by page links becomes impossible.

If you're being asked to create "Click here" links, talk to the content authors about the difficulties of that type of phrasing. As a bonus, using [descriptive link text is better for your SEO](https://moz.com/learn/seo/anchor-text). You can learn more about link text in WebAIM's article about [links and hypertext](https://webaim.org/techniques/hypertext/link_text), and Scott O'Hara has a great article I continually reference for [accessible SVGs](https://www.scottohara.me/blog/2019/05/22/contextual-images-svgs-and-a11y.html).

## Label all form elements

This goes along with the last tip. Form elements (`input`, `textarea`, `select`, `button`, etc,) must have properly associated labels.

`button` elements are easy to label:

```html
<button>I'm a label</button>
```

For the rest, you need to associate a `label` element with the form element in question:

```html
<label for="element-id">Username</label>
<input id="element-id" name="username" />
```

Notice the `label` has a `for` attribute that's the same as its sibling `input`'s `id`. That's how accessible technology knows what label is associated with what input. **Avoid using `placeholder` as a label.** In fact, you probably should [avoid using the placeholder attribute altogether](https://www.smashingmagazine.com/2018/06/placeholder-attribute/).

## Don't use ARIA unless you've exhausted all other options

ARIA (Accessible Rich Internet Applications) is a collection of roles and attributes that enrich plain old HTML to support interactions that are currently not possible with HTML. The first rule of ARIA is *[Don't use ARIA](https://www.w3.org/TR/using-aria/#firstrule).* Great marketing, right?

The truth is, modern HTML can cover most UI needs. Don't believe me? **There are over 100 [current HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element),** and many of them have ARIA roles already baked into them. This brings me to my next tip.

## Use semantic HTML when possible

`div`s and `span`s are great to style with, but they have no meaning whatsoever to accessible technology. **Wrapping large blocks of text directly in a `div` should be avoided with few exceptions,** and those exceptions involve manually adding semantic meaning via `aria` roles.

```html
<div>This text has no meaning whatsoever because divs are a 
generic container.</div>
<p>This is a paragraph of content.</p>
```

Wrapping text in a `span` is a great way to style a select group of text, just make sure it's inside another element that has semantic meaning:

```html
<p>This is a paragraph. <span class="red">This span has no semantic meaning, 
but we're still inside a paragraph, so it's fine.</span></p>

<span>Without a semantic parent, this text has no meaning.</span>
```

## Don't hide the focus ring

You can restyle the focus ring, but make sure it meets [contrast guidelines](https://www.w3.org/TR/WCAG21/#contrast-enhanced). The reason is keyboard users need to be able to see where they are while tabbing through interactive elements.

One reason why the focus ring gets hidden is that clicking on interactive elements in certain browsers focuses them, activating the focus styling. If you only want to show the focus indicator for keyboard users, try `[focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible#selectively_showing_the_focus_indicator)`.

## Don't wrap large blocks of markup in links

So when would you want to do this? How about a cards that link to other pages:

```html
<a class="card" href="/page">
 <h2>Title of Article</h2>
 <p>Small blurb here.</p>
</a>
```

Why avoid this? For starters, you can't easily select text inside of links. Second of all, links are announced in screen readers by reading off the contained text content. **The more [content inside the link](https://webaim.org/techniques/hypertext/link_text#link_length), the more inconvenient the link text becomes.** I've made [a Codepen](https://codepen.io/falldowngoboone/pen/LYVdvQx) showing a couple of approaches to get around this.

## Validate your HTML

Valid HTML is important to ensure that your content renders correctly for years to come and that it works well with accessible technology. Little things like adding closing tags, properly nesting elements, and following the HTML spec can make a huge difference for your SEO as well. The W3C has a solid [HTML validator](https://validator.w3.org) that works well.

## Specify the document language

This one's something you should probably put into a snippet. Specifying the document's language helps translation apps, improves the SEO of the page, and improves a screen reader's ability to pronounce certain words. Here's how that looks:

```html
<html lang="en">...</html>
```

Of course, use the [ISO language code](https://www.sitepoint.com/web-foundations/iso-2-letter-language-codes/) that pertains to your chosen document language. This attribute is inherited by all children, so placing it on the document element (`html`)

## In closing

If you keep this list in mind, you will be well on your way to ensuring your website is accessible to the widest audience possible. Not only will it improve performance, SEO, and readability for *all* of your users, it's the right thing to do.

If you enjoyed this article, please consider sharing this article with others. And if you have any questions about any of the points above, feel free to [ask me on Twitter](https://twitter.com/therealboone).

Until tomorrow!