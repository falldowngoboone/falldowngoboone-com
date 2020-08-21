module.exports = function (eleventyConfig) {
  // handle the CSS injection in BrowserSync correctly
  // when watching Sass, we output to the `_site` directory
  eleventyConfig.setBrowserSyncConfig({
    files: '_site/**/*.css',
  });

  eleventyConfig.addLayoutAlias('post', 'post.liquid');
  eleventyConfig.addLayoutAlias('default', 'default.liquid');

  return {
    dir: {
      input: 'src',
      layouts: '_includes/layouts',
    },
  };
};
