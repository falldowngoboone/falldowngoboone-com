---
title: "What is your code communicating?"
date: 2021-02-20
tags: 
  - blogruary
  - career
  - programming
---

Developers don't write code for computers. I mean, we do, but not primarily. If we did, it would make no difference whether we wrote in Java, bytecode, or complete binary. Yet when given a choice, we write in abstractions because **developers write code for other developers.**

## The *Why?* behind the *What?*

Knowing this, you should always strive to lean into the abstraction and communicate why your code exists *in the code itself.* That is how you make self-documenting code[^code].

Let's look at an example in [Sass](https://sass-lang.com). If you're unfamiliar with Sass, it's a preprocessor scripting language that compiles to CSS. It's a further abstraction of CSS built to make CSS more expressive.

Imagine you come across this style in a code review:

```scss
.subheading-2 {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  margin-top: 20 / 24 * 1em;
}
```

Does anything jump out? You might ask why `margin-top` has an equation value (honestly, I'd prefer not to include a margin in this type of style; if you want to find out why [reach out to me on Twitter](https://twitter.com/therealboone)). 

You can probably figure out what that line is doing, but it's an unnecessary speed bump in the middle of an otherwise unremarkable piece of code. And as any good editor knows, anything that unnecessarily slows a reader down needs to be eliminated.

## Making the abstraction literally literal

Let's try making that `margin-top` a bit more readable:

```scss
.subheading-2 {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  margin-top: 0.8em;
}
```

You are less likely to get any questions about that. But I'm still bothered by one thing: `0.8em` is a rather arbitrary value, and `em` units tend to be confusing, especially if you work on a team of developers that aren't CSS-savvy.

What I want to do is communicate that, at the effective font size of `24px` (`1.5rem`), the `margin-top` should be `20px`. You might be tempted to communicate this in a comment, which is easy to do in Sass:

```scss
.subheading-2 {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  margin-top: 0.8em; // 20px in ems
}
```

That certainly communicates what we're trying to do, but comments like this one are tightly coupled to the code, meaning if the code changes, the comment needs to change as well. This could (and inevitably will) lead to stale comments.

## Back to the land of abstraction

If you find yourself writing comments like this, a good rule of thumb is to use the comments as a template for abstraction[^refactoring]. Luckily for us, Sass gives us the ability to [abstract this meaning into functions](https://sass-lang.com/documentation/at-rules/function). A bit of searching on the interwebs leads me to a useful [function to turn pixel values into em units](https://css-tricks.com/snippets/sass/px-to-em-functions/).


Let's incorporate our new `em` function into our style:

```scss
.subheading-2 {
  font-size: rem($px: 24);
  font-weight: bold;
  line-height: 1;
  margin-top: em($px: 20, $context: 24)
}
```

Hey, look, I wrote a `rem` function, too! I would argue this better fits a developer's mental model when translating [redline documents](https://www.uxbeginner.com/glossary/redlining/) into code. No math, and no confusion around what `em`'s context is.

## How to find opportunities for improved communication

If you are writing the code, often you know too much about what you are doing to reliably recognize confusing lines. Use code reviews to help with this. A good reviewer will always ask questions, and these questions can help identify opportunities for abstraction[^review].

Even if you get a terrible code review fraught with nitpicks and complete rewrites (and apologies if you do), there is still some meaningful feedback you can take away. You can see where other developers get tripped up, allowing you to better identify problem areas[^problems].


## Communication is everywhere

Your code is always communicating something, and it's your job as a developer to make sure it's communicating the right thing. This not only applies to Sass but to every coding language in existence, from HTML to Rust to whatever hot language the future gives us. Look for confusing lines of code, ask yourself why it exists, and lift that context into an abstraction.

If you can't tell, this is one of those subjects that I love. If you'd like to hear more about how to better communicate through code, please let me know by liking this article on DEV Community and sharing it with others. Also consider following [me on Twitter](https://twitter.com/therealboone), especially if you like rage tweets about local infrastructure and random tomfoolery.

One last note: I learned this idea of code as communication from Jonathan Cutrell's amazing podcast [Developer Tea](https://spec.fm/podcasts/developer-tea). Whether you're a beginner or a seasoned pro, I highly recommend subscribing to this podcast. It focuses on the human side of development, a topic that is often ignored.

Until my next communication!

[^code]: There's been some confusion over the meaning of the term *self-documenting code,* but my definition is code that's readable and reasonable to other human beings.

[^refactoring]: This is a technique that I learned from Martin Fowler's excellent book *[Refactoring](https://martinfowler.com/books/refactoring.html)*.

[^review]: The example in this post came from a real code review on my team.

[^problems]: Of course, if someone is a terrible code reviewer, not all of their feedback is going to point to actual problems. You'll have to use your best judgment here, but it's at least worth reassessing your choices.