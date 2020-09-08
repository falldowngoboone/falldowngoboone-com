const fs = require('fs');
const { DateTime } = require('luxon');
const readingTime = require('reading-time');

module.exports = function (eleventyConfig) {
  // merge all data arrays
  eleventyConfig.setDataDeepMerge(true);

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

  eleventyConfig.addLayoutAlias('post', 'post.liquid');
  eleventyConfig.addLayoutAlias('default', 'default.liquid');

  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/js');

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

  eleventyConfig.addShortcode('readingTime', function (content) {
    const { minutes } = readingTime(content);
    return `${Math.round(minutes) || 1} minute read`;
  });

  eleventyConfig.addShortcode('tagLink', function (tag) {
    const urlify = eleventyConfig.getFilter('url');
    const tagUrl = `/tags/${tag}`;

    return `<a href="${urlify(tagUrl)}">${tag}</a>`;
  });

  return {
    dir: {
      input: 'src',
      layouts: '_includes/layouts',
    },
  };
};

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

  eleventyConfig.addFilter('currentlyReading', (bookshelf) =>
    bookshelf[0].books.find(({ status }) => status === 'reading')
  );
}

function isDisplayTag(item) {
  return !['all', 'nav', 'post', 'posts'].includes(item);
}
