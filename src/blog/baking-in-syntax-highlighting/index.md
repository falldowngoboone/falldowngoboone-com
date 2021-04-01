---
title: Baking in syntax highlighting
date: 2021-04-01
tags: eleventy, javascript, personal
---

Another runtime dependency bites the dust. My ongoing work of [designing and building this blog](https://www.falldowngoboone.com/blog/how-im-redesigning-my-blog/) continues with moving syntax highlighting from the client-side to [Eleventy's syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/):

```js
const syntaxHighlighting = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlighting);

  // other config stuff...

  return {
    dir: {
      input: 'src',
      layouts: '_includes/layouts',
    },
  };
};
```

There are a couple of benefits to baking syntax highlighting into the build process vs. runtime. First of all, there's no flash of unstyled markup in cases where JavaScript is slow to parse. Second, JavaScript is no longer required for syntax highlighting.

There are issues, of course. One of my goals is to add line numbers to code blocks, and while there is a [Prism line number plugin](https://prismjs.com/plugins/line-numbers/), it requires DOM to be present. Since there is no DOM during the plugin phase of Eleventy, this plugin doesn't work.

After searching around a bit, I found a [clever trick involving CSS counters](https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/10) (thanks to Josh Buchea), but it breaks under certain conditions due to an issue with the line highlighting plugin. I detailed a few of the conditions in an [issue I filed on my site](https://github.com/falldowngoboone/falldowngoboone-com/issues/116).

It looks like there is a possible fix that's been opened, but I don't see any activity around the pull request. It may be worth it to pull the commit into a third-party plugin, but that's an exercise for later.

There have been other changes since last I posted about the blog, but nothing too drastic. Now that I've got some more time on my hands, I hope to knock out some changes I've prioritized and make this a proper frontend playground.

Till next time!