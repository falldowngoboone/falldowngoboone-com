const { DateTime } = require('luxon');
const fs = require('fs');
const dateToISO = require('@11ty/eleventy-plugin-rss/src/dateToISO');
const absoluteUrl = require('@11ty/eleventy-plugin-rss/src/absoluteUrl');
const htmlToAbsoluteUrls = require('@11ty/eleventy-plugin-rss/src/htmlToAbsoluteUrls');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginNavigation = require('@11ty/eleventy-navigation/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // TODO: remove after updating to v0.11.0
  eleventyConfig.addFilter('log', console.log);

  // manually add RSS stuff as liquid filters and shortcode
  eleventyConfig.addFilter('rssLastUpdatedDate', (collection) => {
    if (!collection || !collection.length) {
      throw new Error('Collection is empty in rssLastUpdatedDate filter.');
    }

    // Newest date in the collection
    return dateToISO(collection[collection.length - 1].date);
  });

  eleventyConfig.addFilter('rssDate', (dateObj) => dateToISO(dateObj));

  eleventyConfig.addFilter('absoluteUrl', (href, base) =>
    absoluteUrl(href, base)
  );

  eleventyConfig.addPairedLiquidShortcode(
    'htmlToAbsoluteUrls',
    async (content, base) => {
      if (!content) {
        return '';
      }

      const result = await htmlToAbsoluteUrls(content, base);

      return result.html;
    }
  );

  // manually adding navigation filters as universal
  eleventyConfig.addFilter(
    'eleventyNavigation',
    pluginNavigation.findNavigationEntries
  );
  eleventyConfig.addFilter(
    'eleventyNavigationBreadcrumb',
    pluginNavigation.findBreadcrumbEntries
  );
  eleventyConfig.addFilter('eleventyNavigationToHtml', function (
    pages,
    options
  ) {
    return pluginNavigation.toHtml.call(eleventyConfig, pages, options);
  });

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias('post', 'layouts/post.liquid');

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'));

  eleventyConfig.addPassthroughCopy('./src/img');
  eleventyConfig.addPassthroughCopy('./src/fonts');
  eleventyConfig.addWatchTarget('./src/sass');

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#',
  });
  eleventyConfig.setLibrary('md', markdownLibrary);

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
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
    ui: false,
    ghostMode: false,
  });

  return {
    templateFormats: ['md', 'html', 'liquid'],

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',

    dir: {
      input: './src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
