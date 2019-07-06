---
title: CSS is Hard
subtitle: What I've learned from an old codebase
date: '2019-07-05T00:33:32.166Z'
currentmood: utility-first
keywords:
  - css
  - sass
---

## Agree on a class naming scheme

Also, BEM or BEMIT. Either are great for projects you control. I think the metaphor starts to break down the more team members you add that are not as proficient in CSS or creating components.

## Use `@extend` with care, or not at all

Use @extend only within a component class. For extending common code globally, use an argumentless mixin, or, when it makes sense, create a utility class. Actually, don't use `@extend` in a team environment.

## Component file naming

Name the file after the component/object name. Usually this is the template file name (`refinements.{html,handlebars,jsp,et al}` and `_refinements.scss`). In React, components usually just import their CSS, which lives either in the JavaScript itself (fun!) or lives in a sibling file inside a directory for that component.

There should be a one-to-one relationship between fragment component files and their styles. This comes out of SMACSS. Exceptions are global files (e.g. utility partials, resets, base element styles, et al).

## Nesting

Nesting should be generally discouraged unless it is a media query, a pseudo selector (`:hover`, `:not()`, etc), a pseudo element (`::after`, `::before`), or specificity is absolutely needed, typically for theme styling, but also for **temporarily** overriding legacy styles.

## Long Nesting

Nesting even one level deep gets a bit confusing when it's a long block of code. I get turned around when there's more than a screen of nesting. I would recommend simply un-nesting at this point and explicitly defining the selector.

## Specificity

In order to create maintainable, extendable CSS, specificity must me kept to a minimum. Only make a style as specific as it needs to be. **Styling via ids is strongly discouraged in favor of class selectors,** with the rare exception of page-specific styles. Attribute selectors are helpful, but only for general styling in base element styling (typically naked element styling found in reset or normalizing stylesheets). `!important` should only be used for utility classes in order to maintain immutability.

For more about specificity, refer to this [Smashing Magazine article on the subject](https://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/).

## Behavior related selectors

Styling via `.js-` classes and `[data-]` attributes should be avoided. This helps separates style and behavior concerns. Conversely, for hooking into the DOM, I would recommend using something other than classes (e.g. `id`s for single elements, `[data-]` attributes for multiple elements). If you really must use a class, prefix it with `js-` to explicitly define it. However, I've found it's too tempting to style these classes. If you use a CSS linter,

## Variables

Define variables closest to the scope they are used. If a variable is only useful for a single partial, define it in the partial scoped by the partial's name (e.g. `$footer-color-blue` for a blue used only in the `_footer.scss` partial), but do not use a variable in multiple files that is not defined in a global variables partial. This unnecessarily couples component partials.

## Libraries

The CSS space moves quickly, so libraries that solve today's problems usually decay quickly. Compass is a great example of that. If you have to use a library, abstract it out by creating intermediary facades. Actually, don't use libraries.
