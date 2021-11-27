---
title: Kicking Sass to the curb
date: 2021-11-21
excerpt: |
  Sass has been my go to CSS preprocessor for years, but with a recent CSS feature boom, it's a good time to revisit whether or not I can lean completely on native CSS for all my Sass.
tags: 
  - css
  - sass
---

Google web dev advocate and all-around awesome person [Una Kravets mentioned in a tweet](https://twitter.com/Una/status/1375077749291896834?s=20) earlier this year that got my wheels turning (I can hear them squeaking as I type):

> I used to write "Convert your CSS codebase into Sass!" guides
> Now I think it's time for a "Convert your Sass codebase into vanilla CSS!" guide

Sass is usually the first thing I install in a brand-new project, right after git and npm initialization. Could I bear to do without it now? And why would I want to get rid of Sass anyway?

Simplicity is a worthy goal in any web dev endeavor, but maybe simplicity in the build chain is the most worthy goal of all. Removing a complete build branch makes the process easier to maintain and understand. But before I can even think about getting rid of Sass, I need to examine why I use it in the first place.

## Why I use Sass

I've used Sass in a variety of ways over the past decade, from Codekit to Gulp, WebPack, and most recently the JavaScript API (I also have experience with [Compass](http://compass-style.org), although not by choice). [Sass offers several features](https://sass-lang.com/documentation), but the ones I currently use are:

- Static variables
- Nesting
- Mixins
- Modules

Let's take a look at each one and see if vanilla CSS offers a suitable alternative.

## Static variables

I use Sass variables for storing colors, spacing values, font data, and breakpoints. They are one of the Sass features I lean on consistently. And now they're easier to reason about thanks to [the `@use` rule](https://sass-lang.com/documentation/at-rules/use). 

```scss
// _colors.scss
$black: lch(10% 0 0);
$red: lch(38% 68 33);

// style.scss
@use "colors" as c;

.text {
  color: c.$black; // namespaced, which is useful for large Sass projects
  
  &:hover {
    color: c.$red;
  }
}
```

The question is, *Can vanilla CSS replace my Sass variables?* This one seems easy at first. Variables, by way of [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), have already made their way into many of my style sheets. 

```scss
// root.css

:root {
  --black: lch(10% 0 0);
  --red: lch(38% 68 33);
}

// style.css

.text {
  color: var(--black);
  
  &:hover {
    color: var(--red);
  }
}
```

Sure, their syntax is weird at first, especially compared to Sass, but custom properties have superpowers Sass variables only wish they had. For starters, custom properties are dynamic and can change value based on the current context:

```scss
.container {
  --padding: 0.5rem;

  padding: var(--padding);
}

@media screen and (min-width: 640px) {
  .container {
    --padding: 1rem;
  }
}
```

Imagine changing the global spacing and typography by setting a couple of custom properties in the `:root` selector at different breakpoints. I'm heavily utilizing this pattern on this blog.

Another nice thing about CSS custom properties is I can easily share and manipulate them with JavaScript. I talk more about this in my article about [sharing variables between JavaScript and CSS](https://www.falldowngoboone.com/blog/share-variables-between-javascript-and-css/), but, in summary, custom properties are computed style, just like every other CSS property, so JavaScript can read and mutate them at will:

```scss
:root {
  --my-property: hello;
}
```

```jsx
const myProperty = getComputedStyle(document.documentElement)
    .getPropertyValue('--my-property');

console.log(myProperty); // hello

document.documentElement.style.setProperty('--my-property', 'goodbye');

const myMutatedProperty = getComputedStyle(document.documentElement)
    .getPropertyValue('--my-property');

console.log(myMutatedProperty); // goodbye
```

The above example is scratching the surface of how CSS custom properties outshine their static Sass cousins, but I still haven't dropped Sass variables altogether. There are a couple of areas where I yet prefer static variables.

The CSS variables [spec](https://www.w3.org/TR/css-variables-1/#using-variables) states that the "`var()` function can not be used as property names, selectors, or anything else besides property values." The property value rule is an unfortunate limitation on where and how custom properties are accessed.

First, you can't use custom properties as part of selectors, so no `&__block` selectors. That's not a deal-breaker for me since I'm moving away from doing that sort of thing in my code. Generating BEM selectors with the parent selector may not be terrible in a small, well-known codebase, but it becomes a nuisance when searching for selectors in larger codebases.

The biggest bummer is you can't use custom properties is in media queries. The first reason is `@-` rules are top-level, so there's nowhere to set them and no way to inherit a value. Dynamic media query values can also create update cycles that never resolve (this could be why media queries created with `rem`s tended to be buggy early on as well).

There is currently a proposal to add [custom media queries](https://drafts.csswg.org/mediaqueries-5/#at-ruledef-custom-media) that would solve this problem:

```css
@custom-media --md (max-width: 30em);

@media (--md) {
  ...
}
```

It's in Editor's Draft at the time of this writing, but I'm hoping we'll see it implemented soon.

### Static variables verdict

I already use custom properties everywhere, and I predict custom media queries will one day replace my need for Sass's static variables. For now, though, it seems Sass’s variables will continue to make my life easier.

## Nesting

[Nesting](https://sass-lang.com/documentation/style-rules#nesting) was the killer feature when I started using Sass. It was so convenient to nest rules inside of rules that I did it often. Probably too often. Now I limit myself to three levels of nesting, mostly pseudo-selectors and media queries. 

```scss
.button {
  background-color: lch(57% 40 212);
  padding: 0.25em 0.5em;

  :hover {
    background-color: lch(64% 40 212);
  }

  :active {
    background-color: lch(51% 40 212);
  }

  ::before {
    content: "→";
  }

  .uppercase-block & {
    text-transform: uppercase;
  }

  @media screen and (min-width: 70em) {
    padding: 0.5em;
  }
}
```

The good news for camp vanilla CSS is there is a [CSS Nesting Module proposal](https://drafts.csswg.org/css-nesting-1/). It's slightly different from the Sass implementation. None of those fancy compound BEM-style ( e.g. `&__element`) selectors and the nesting selector (`&`) is always required, at least for now (Sass infers the current selector to be the first character unless explicitly used elsewhere in the selector).

```scss
.button {
  background-color: lch(57% 40 212);
  padding: 0.25em 0.5em;

  &:hover {
    background-color: lch(64% 40 212);
  }

  &:active {
    background-color: lch(51% 40 212);
  }

  &::before {
    content: "→";
  }

  // hey, look, a new at-rule!
  @nest .uppercase-block & {
    text-transform: uppercase;
  }

  @media screen and (min-width: 70em) {
    & {
      padding: 0.5em;
    }
  }
}
```

Unfortunately, the proposal is in Editor's Draft as of this post's publish date. But, hey, that's also a good thing because at least the W3C is looking at it.

### Nesting verdict

I will gladly replace Sass nesting with native CSS nesting, provided it gets implemented. Even if I were to stay with Sass, chances are the Sass spec itself would have to change to support the new native CSS implementation.

## Mixins

There was a point when the main thing I would use mixins for was vendor prefixes, but Autoprefixer replaced them. Now that prefixes aren't as prevalent, I manually add prefixes as needed.

A current use I have for mixins, in combination with Sass variables, is creating custom media queries:

```scss
// _utils.scss

$md-min: 611px;

@mixin mq-max($width) {
  @media screen and (max-width: $width) {
    @content;
  }
}

@mixin md-and-up {
  @include mq-min($md-min) {
    @content;
  }
}

// style.scss

@use "./utils" as u;

html {
  font-size: 112.5%;

  @include u.md-and-up {
    font-size: 125%;
  }
}
```

I've already mentioned that native custom media queries are under consideration, so this use case is also covered (or, at least *will* be covered).

I also dry up selector generation with mixins. Here is a sample mixin I've used in the past to generate utility classes:

```scss
@mixin generateUtils($property-map, $value-map, $suffix) {
  @each $property-id, $properties in $property-map {
    @each $value-id, $values in $value-map {
      .u-#{$property-id}-#{$value-id}#{$suffix} {
        @each $property in $properties {
          #{$property}: $values;
        }
      }
    }
  }
}
```

This admittedly opaque mixin loops through properties and values to create a bunch of utility classes. It's a factory for margin and padding utility classes, similar to what you would find in Tailwind.

There are several issues with the above utility factory. First of all, it creates a ton of classes, many of which may remain unused. We must then purge these classes with something like [PurgeCSS](https://purgecss.com). This purging is further complicated by dynamically generated markup.

The second issue is, as previously stated, this code is opaque. I can't perform a simple global search to find a class created dynamically. I need *intimate* knowledge of the codebase to understand where the code generation occurs.

Removing the factory and manually adding utility classes as you need them solves both problems:

```scss
.u-m-0 {
  margin: var(--m-0);
}

.u-m-1 {
  margin: var(--m-1);
}

.u-m-2 {
  margin: var(--m-2);
}

// ...etc.
```

It's not perfect, but at least I can search for a utility class and find it. I can also add utilities as needed, which should prevent utility class bloat. 

The biggest drawback to this approach is you lose control over the abstraction. I've seen team members insert explicit values in the utility names (e.g. `u-m-15`, which would set the `margin` property to `15px`), which can, ironically, cause class bloat.

Ultimately, I would prefer to avoid a utility-first solution, but if one is necessary, perhaps leaning on a library would be the best solution in this case. Tailwind has been improving leaps and bounds in reducing bloat, and it's becoming a more familiar solution. Otherwise, it's probably time to revisit your CSS methodology.

### Mixins verdict

There is no one-size-fits-all approach for replacing mixins. Determine why you or your team are using them and whether it makes sense to replace them. In short, It Depends™.

## Modules

Sass modules are an improvement over the old `@import` syntax. My main use for Sass modules is importing other stylesheets via the `@use` at-rule:

```scss
// styles.scss

@use 'reset';
@use 'global';
@use 'objects';
@use 'components';
@use 'utilities';
```

`@use` allows me to split large style sheets up into manageable and composable chunks, which is one of the best use cases for Sass. Sass's module system will only write a style sheet once, even if you import it multiple times.

This module system is an instance where a build tool will always outshine a runtime approach. Sass will concatenate the imported files together and output a single file, which creates a larger style sheet but cuts down on HTTP requests. There are CSS alternatives (multiple `link` elements and the `@import` rule[^import]), but they involve separate HTTP requests.

[^import]: According to Harry Roberts, you should [avoid the `@import` rule in CSS](https://csswizardry.com/2018/11/css-and-network-performance/#avoid-import-in-css-files). `@import` prevents a browser's ability to download CSS in parallel and will slow down the initial render significantly.

Of course, I assume that we still live in a world where fewer, larger HTTP requests are better than several small HTTP requests. HTTP/2 support is prevalent throughout modern browsers now, and many sites I have worked on have HTTP/2 turned on by default. I could forgo concatenating scripts, but I have yet to find a source that wholeheartedly recommends this approach (yet another attack of the It Depends monster).

### Modules verdict

Honestly, this is such a new concept in Sass that I don’t see myself abandoning it any time soon. The power and simplicity of a statically-analyzed, build-time module system for CSS is a perfect use of Sass.

## PostCSS

A recurring theme throughout this article is certain CSS functionality has been proposed but is not yet available. One solution to this challenge that many of you are probably already thinking is to (🚨 obligatory marketing copy alert 🚨) *Use Tomorrow's CSS Today* with [PostCSS Preset Env](https://preset-env.cssdb.org).

The Preset Env plugin is sort of like the CSS equivalent of Babel's preset-env plugin. PostCSS Preset Env is prone to some of the same issues as Babel, namely code bloat and the risk of changing specifications breaking implementation, but it’s the best (only?) solution if you want to start using some of these future specs today. Available polyfills include the nesting and custom media query proposals mentioned earlier, as well as several others.

Keep in mind, though, CSS affords much less flexibility than JavaScript when extending the language. That means polyfills may come with extreme limitations, like the Custom Property polyfill that only allows custom properties on the `:root` selector. Your mileage may vary.

## Conclusion

Will there ever be a time when I ditch Sass? I don't know. Sass may continue evolving as CSS evolves, solving new problems we can’t even perceive at the moment.

For now, though, Sass remains on my install list, even as I eye the inevitable list of goodies making their way through the CSS specification process. I’ve tried many times to move over to PostCSS, but I can never get it to stick. Sass is just easier to configure and use, at least for me.
