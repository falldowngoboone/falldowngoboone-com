---
title: "Quick tip: Non-standard npm module resolution"
date: 2022-03-19
excerpt: You’ve used `index.js`, but what happens _when you can’t?_ Here’s a quick way to resolve non-standard entry files for Node.js.
tags: 
  - javascript
---

I’m putting the finishing touches on a publishing script for my blog and ran across an interesting situation. The scripts use native ES modules, but Eleventy, the JavaScript framework my blog uses, currently does not support them. I have to specify that my scripts use ES modules with the `.mjs` extension.

```text
scripts/
└── my-publishing-script/
		└── index.mjs
```

I like to abstract the internals of a script as much as possible, so I like to utilize Node.js module resolution, which allows you to do stuff like this:

```jsx
const library = require('library');
```

The assumption is that you’ve already run `npm install library` and `library` now lives in your `node_modules` directory.

If you’ve ever cracked open one of those libraries and looked at their `package.json` file, chances are they’re making use of the `main` field, which instructs Node.js as to where the entry file lives relative to the `package.json`. By default, Node.js looks for `index.js`, but it can literally be named anything.

Going back to my script, since it now has to use the `.mjs` extension, Node.js no longer automatically resolves it, but I can fix that by adding a `package.json` to my script’s directory with a single `main` field:

```text
scripts/
└── my-publishing-script/
		├── index.mjs
		└── package.json
```

```json
{
	"main": "index.mjs"
}
```

Now I don’t have to specify the entry file when calling the script:

```bash
node scripts/my-publishing-script
```