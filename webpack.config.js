const path = require('path');

module.exports = (env = {}) => {
  const isProduction = env.production;
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/js/index.js',
    watch: !isProduction,
    output: {
      path: path.resolve(__dirname, '_site/js'),
      filename: 'bundle.js',
    },
  };
};
