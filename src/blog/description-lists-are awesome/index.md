---
title: Description lists are awesome
date: 2021-02-16
tags: 
  - blogruary
  - html
---

The [description list](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl) (`<dl>`) is a magical element that can be used to mark up anything from dictionary entries to recipes. So, what's so special about it?

## It's all relational

The description list, like its cousins the ordered and unordered list, is a list of associated items, meaning all items should be considered related to each other. The big difference is description list items are made up of two parts, a term (`<dt>`) and description (`<dd>`).

Here's what that looks like:

```html
<dl>
  <div>
    <dt>Freshly Brewed Coffee</dt>
    <dd>$1.75</dd>
  </div>
  <div>
    <dt>Iced Coffee</dt>
    <dd>$2.25</dd>
  </div>
  <div>
    <dt>Caffé Americano</dt>
    <dd>$2.25</dd>
  </div>
  <div>
    <dt>Flat White</dt>
    <dd>$3.75</dd>
  </div>
</dl>
```

Notice that, unlike ordered and unordered lists, you can wrap related terms and descriptions in a single `div` to aid with styling. Normally a `div` would indicate a semantic separation of content, but inside a `<dl>` it's completely ignored.

And just like an ordered list, the order of the terms may be significant as well:

```html
<dl>
  <dt>If product pricing is hidden</dt>
  <dd>Show "See price in cart"</dd>
  <dt>If product is on sale</dt>
  <dd>Show sale pricing and styling</dd>
  <dt>Otherwise</dt>
  <dd>Show regular pricing and styling</dd>
</dl>
```

That some pretty mind-blowing stuff, right? Okay, it's not life-changing, but the description list is perfect for semantically establishing a relationship between terms and descriptions.

## What are they good for?

So, when would you reach for the description list? Well, I work in e-commerce, so the first thing I can think of is product metadata on a product detail page:

```html
<dl>
  <dt>Price:</dt>
  <dd>$29.99</dd>
  <dt>SKU:</dt>
  <dd>123456</dd>
  <div>
    <dt>Colors:</dt>
    <dd>Red</dd>
    <dd>Green</dd>
    <dd>Blue</dd>
  </div>
  <div>
    <dt>Features:</dt>
    <dd>Non-slip finish</dd>
    <dd>Dishwasher safe</dd>
    <dd>Microwave safe</dd>
    <dd>One size fits most pots and pans</dd>
  </div>
</dl>
```

Note that you can have multiple descriptions relating to a single term. I've seen this type of information marked up as a `table` and as separate `div`s, but this is semantically more correct.

Another use of description lists that I've seen is in recipes:

```html
<dl>
  <dt>Ingredients</dt>
  <dd>flour</dd>
  <dd>salt</dd>
  <dd>dry yeast</dd>
  <dd>sugar</dd>
  <dd>...</dd>
  <dt>Instructions</dt>
  <dd>
    <p>Mix all dry ingredients in a bowl. Add wet ingredients.
    Let stand for 2 hours.</p>
    <p>Preheat oven to 375°.</p>
    <p>...</p>
  </dd>
</dl>
```

The description list is useful in any situation where you have a list of related things that need to be broken down into name-value pairs. I even found a great [article that suggests several more uses](http://maxdesign.com.au/articles/definition/), all the way from the distant year 2004.

## Gotchas

Even though the description list has been around since 1993, iOS VoiceOver has lacked proper support since it was first introduced in 2009. However, VoiceOver on iOS 14 and iPadOS 14 finally support description lists. As [Adrian Roselli writes in a recent article](https://adrianroselli.com/2020/09/voiceover-on-ios-14-supports-description-lists.html), however, it is not without its quirks, mostly owed to existing VoiceOver bugs.

## The underutilized list

Description lists are great for groups of name-value pairs, which covers a surprising amount of semantic content. Next time you're marking up your HTMLs and whatnot, consider the humble description list.

Are you already using description lists? [Let me know](https://twitter.com/therealboone) what you're using them for. And if you're reading this on Dev Community, please consider liking this post if it is in any way helpful. This helps me know what articles make the most impact.

Until tomorrow!