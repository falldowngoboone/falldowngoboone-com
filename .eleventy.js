const fs = require('fs');

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

  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ('tags' in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case 'all':
            case 'nav':
            case 'post':
            case 'posts':
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  return {
    dir: {
      input: 'src',
      layouts: '_includes/layouts',
    },
  };
};
