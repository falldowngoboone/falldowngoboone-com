---
title: Share variables between JavaScript and CSS
date: 2021-02-28
tags:
  - blogruary
  - javascript
  - css
  - sass
---

Whether you need site breakpoints for `matchMedia` or access to theme colors, sharing values between your JavaScript and CSS is sometimes unavoidable. The easiest solution is to [copy and paste](https://www.falldowngoboone.com/blog/understand-the-context-of-code-you-copy/) values, but how can you ensure values stay synchronized when that brand blue color changes to indigo?

The answer is to create a single source of truth by sharing values between the JavaScript and style layers. There are several ways to accomplish this, and the best approach for a project depends on its frontend stack. Here are all of the ways I know how to pass data back and forth between all the layers.

## ICSS

[CSS Modules](https://css-tricks.com/css-modules-part-1-need/), gives us two ways of sharing variables, the [Interoperable CSS](https://github.com/css-modules/icss) (ICSS) spec and the PostCSS Modules Values spec. ICSS appears to be the older of the two specifications, so I'll start there.

ICSS is a low-level specification that's mainly for loader authors. It describes how to treat CSS modules as JavaScript dependencies and introduces the `:export` directive to act as a way to export defined values. Coupled with Sass variables, it allows you to export theme values:

```sass
// colors.module.scss
// assuming this is within Create React App; the `.module` lets CRA know
// this is a CSS Module

$my-red: #ff0000;

:export {
  myRed: $my-red;
}
```

The exported values are imported like much like any other JavaScript module:

```jsx
// MyComponent.js
// assuming this is within Create React App

import * as React from 'react';
import * as colors from 'theme/colors.module.scss';

export function MyComponent() {
  return <p>myRed's value: {colors.myRed}</p>
}
```

The above should work in Create React App out of the box. If you are rolling your own Webpack configuration (may God have mercy on your soul), you'll need to [configure `modules` with a `compileType` of `icss`](https://github.com/webpack-contrib/css-loader#compiletype):

```jsx
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: "css-loader",
        options: {
          modules: {
            compileType: "icss",
          },
        },
      },
    ],
  },
};
```

- CSS is the source of truth
- Great solution if you're using Create React App
- Webpack configuration could be a challenge
- Aimed more at library authors than app developers
- Non-standard CSS

## Setting `@value`

CSS Modules also offers [the `@value` directive](https://github.com/css-modules/postcss-modules-values), which explicitly defines module values. `@value` can also be used to import values from other CSS modules. It's a catchall solution for passing values to and from CSS modules to anywhere.

```sass
// breakpoints.module.css

@value larry: (max-width: 599px);
@value moe: (min-width: 600px) and (max-width: 959px);
@value curly: (min-width: 960px);

// MyComponent.module.css
// this is one of the multiple ways you can import @value definitions
// see https://github.com/css-modules/postcss-modules-values

@value larry, moe, curly from "theme/breakpoints.module.css";

@media larry {
  ...
}

@media moe {
  ...
}

@media curly {
  ...
}
```

```jsx
// MyComponent.module.js

import * as React from 'react';
import Media from 'react-media';
import { larry, moe, curly } as bp from 'theme/breakpoints.module.css';

export function MyComponent() {
  return (
    <Media queries={{ larry, moe, curly }}>
      {matches =>
        matches.larry 
          ? (
            <p>Oh, a wise guy, eh?</p>
          ) 
          : matches.moe ? (
            <p>Why I outta...</p>
          ) : (
            <p>Nyuk nyuk</p>
        )
      }
    </Media>
  );
}
```

- CSS is the source of truth
- Easy to implement in Create React App
- Again, Webpack (meh)
- Appears to be more of a dev-friendly solution
- Allows you to share values between CSS modules
- Non-standard CSS

## Sass compiler

Sass's JavaScript API can add custom functions by defining the [`functions` option of `render`](https://sass-lang.com/documentation/js-api#functions). You can use this to define getter functions that return your theme's values directly in Sass. I implemented this on our website using `node-sass`, which exposes the `functions` option in its CLI:

```bash
node-sass src/styles/ -o build/styles --functions path/to/sass-functions.js
```

And the `sass-functions.js` file looks like this:

```jsx
// sass-functions.js

const sass = require('node-sass');
const theme = require('../theme/index.js');

module.exports = {
  'getColorMap()': function () {
    return Object.entries(theme.colors).reduce(
      toSassMap,
      new sass.types.Map(Object.keys(theme.colors).length)
    );
  },
  'getMqMap()': function () {
    return Object.entries(theme.mqs).reduce(
      toSassMap,
      new sass.types.Map(Object.keys(theme.mqs).length)
    );
  },
};

function toSassMap(list, [key, value], idx) {
  list.setKey(idx, new sass.types.String(key));
  list.setValue(idx, new sass.types.String(value));
  return list;
}
```

Note that I'm having to define Sass types. The `getColorMap()` and `getMqMap()` functions return Sass maps that include all of our theme variables. Very handy!

Unfortunately, [LibSass, the core engine of `node-sass`, has been deprecated](https://sass-lang.com/blog/libsass-is-deprecated), along with `node-sass`. The canonical Dart version of Sass lacks a nice CLI option for custom functions. If you want to recreate this functionality, you're stuck building a compiler using Dart Sass's JavaScript API.

- JavaScript (or JSON) is the source of truth
- Requires Sass
- Easy to implement with `node-sass`, but it's deprecated[^deprecated]
- You have to role your own compilation if you want to define custom functions in Dart Sass

## CSS-in-JS

A common variable sharing solution in React is to simply let JavaScript do all the work. And as controversial as [CSS-in-JS](https://css-tricks.com/the-differing-perspectives-on-css-in-js/) seems to be, it presents an easy way to share variables simply because you are defining CSS in a JavaScript file.

Here's how you might share a variable in the library [Emotion](https://emotion.sh/docs/introduction):

```jsx
import { css, cx } from '@emotion/css';
import * as colors from './theme.colors.js';

render(
  <div
    className={css`
      color: ${colors.primary};
      &:hover {
        color: ${colors.secondary};
      }
    `}
  >
    I get so emotional, baby.
  </div>
)
```

I mean, it's easy. It's so easy that I'd debate whether or not this is classified as sharing variables between JavaScript and CSS, but I'm throwing it in anyway.

I've already mentioned Emotion, but other CSS-in-JS libraries to check out include [Styled Components](https://styled-components.com), [JSS](https://cssinjs.org/), [Theme-UI](https://theme-ui.com), [Radium](https://formidable.com/open-source/radium/), and [Aprhodite](https://github.com/Khan/aphrodite).

- JavaScript (or JSON) is the source of truth
- Good option for shared React component libraries
- Requires JavaScript to apply styles (no JS, no styles)
- Non-standard CSS

## Custom Properties

If you need a lightweight, "proper" way to share variables between JavaScript and CSS, look no further than Custom Properties. Custom Properties allow you to create arbitrary CSS properties and set them to any value you want.

```css
:root {
  --color-brand: #BADA55;
  --color-secondary: #005DAB;
}
```

```jsx
import * as React from 'react';

function MyComponent() {
  const brandColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-brand');
  
  return <p style={{ color: brandColor }}>I'm brand color!</p>
}
```

If you access these properties a lot, you may want to create a utility function to save on typing:

```bash
function cssValue(property) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property);
}
```

Custom Properties are completely standard CSS spec, and this is the only solution that is dynamic, meaning properties can change based on context:

```css
:root {
  --color-brand: #BADA55;
  --color-secondary: #005DAB;
}

@media (prefers-color-scheme: dark)
  :root {
    --color-brand: white;
    --color-secondary: #ccc;
  }
}
```

When you access those properties, they'll be different depending on the user's preferences. This is incredibly powerful.

- CSS is the source of truth
- Context-specific (CSS updates custom properties live based on the context)
- Easy to implement
- Not supported in Internet Explorer 11, but you can sort of [polyfill](https://www.npmjs.com/package/ie11-custom-properties) it
- Can't use Custom Properties for breakpoints 😩
- Standard CSS

## Lots of options

Sharing variables between CSS and JavaScript can help reduce toil and cut down on unintentional tech debt. And if you need to, you have no shortage of options. Just make sure you understand what you want to act as the source of truth and know your technical requirements.

If you found that helpful, please let me know by liking this post on DEV Community and sharing it. And if you want more articles like this, make sure you [follow me on Twitter](https://twitter.com/therealboone) so you'll know when I post new ones.

Until next time!

[^deprecated]: Trust me when I say you should not use `node-sass`. It's so buggy that it can't process newer CSS.