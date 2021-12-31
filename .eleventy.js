const fs = require('fs');
const { DateTime } = require('luxon');
const readingTime = require('reading-time');
const EMPTY = require('./src/_data/empty');
const rss = require('@11ty/eleventy-plugin-rss');
const syntaxHighlighting = require('@11ty/eleventy-plugin-syntaxhighlight');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFootnote = require('markdown-it-footnote');

let uid = 0;

module.exports = function (eleventyConfig) {
  // merge all data arrays; specifically allows the blog.json tags to merge with
  // all blog page tags
  eleventyConfig.setDataDeepMerge(true);

  // add excerpts; default separator is `---`
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });

  // see https://browsersync.io/docs/options
  eleventyConfig.setBrowserSyncConfig({
    files: '_site/**/*.css', // sync on new CSS files
    ghostMode: false,
    ui: false,
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  eleventyConfig.setLibrary('md', markdownParser());

  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy(
    'src/**/*.(png|jpg|jpeg|gif|svg|webp|avif)'
  );
  eleventyConfig.addPassthroughCopy('src/js');

  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(syntaxHighlighting);

  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ('tags' in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(isDisplayTag);

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet].sort();
  });

  addFilters(eleventyConfig);
  addShortcodes(eleventyConfig);

  return {
    dir: {
      input: 'src',
      layouts: '_includes/layouts',
    },
  };
};

function markdownParser() {
  const options = {
    html: true,
    linkify: true,
    typographer: true,
  };
  return markdownIt(options)
    .use(markdownItAttrs)
    .use(markdownItFootnote)
    .use(markdownItAnchor, {
      permalink: true,
      permalinkAttrs: (slug) => ({
        'aria-label': 'permalink',
        'aria-describedby': slug,
      }),
      permalinkClass: 'c-anchor-link',
      permalinkSpace: false,
      permalinkSymbol:
        '<svg aria-hidden="true" focusable="false"><use href="#icon-link" xlink:href="#icon-link"></use></svg>',
    });
}

function addFilters(eleventyConfig) {
  eleventyConfig.addFilter(
    'readableDate',
    (dateObj, format = 'dd LLL yyyy') => {
      return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
    }
  );

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('displayTags', (tags) => tags.filter(isDisplayTag));

  eleventyConfig.addFilter('encodeUriComponent', (string) =>
    encodeURIComponent(string)
  );

  eleventyConfig.addFilter('markdownToHtml', (md) => {
    return markdownParser().renderInline(md);
  });
}

function addShortcodes(eleventyConfig) {
  eleventyConfig.addShortcode('readingTime', function (content) {
    const minutes = Math.round(readingTime(content).minutes);
    return isNaN(minutes) ? EMPTY : `${minutes} min read`;
  });

  eleventyConfig.addShortcode('tagLink', function (tag) {
    const urlify = eleventyConfig.getFilter('url');
    const tagUrl = `/tags/${tag}`;

    return `<a class="c-tag-link" href="${urlify(tagUrl)}">${tag}</a>`;
  });

  eleventyConfig.addShortcode('uid', function () {
    return String(uid++);
  });

  eleventyConfig.addShortcode('codepen', function (id, height = 450) {
    if (!id) return;

    return `<p class="codepen" data-height="${height}" data-theme-id="dark" data-default-tab="html,result" data-user="falldowngoboone" data-slug-hash="${id}" style="height: ${height}px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Details">
  <span>See the Pen <a href="https://codepen.io/falldowngoboone/pen/${id}">
  Details</a> by Ryan Boone (<a href="https://codepen.io/falldowngoboone">@falldowngoboone</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>`;
  });

  eleventyConfig.addPairedShortcode('aside', function (content, tone = 'info') {
    return `<aside class="c-post__aside c-post__aside--${tone}">${markdownParser().render(content)}</aside>`;
  });
}

function isDisplayTag(item) {
  return !['all', 'nav', 'post', 'posts'].includes(item);
}
