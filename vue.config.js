const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  publicPath: '',
  chainWebpack: (config) => {
    config
      .entry('content-script')
      .add('./src/content-script.js');
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin([
        {
          context: 'wrappers/chrome/',
          from: '**/*',
          to: '../',
        },
      ]),
    ],
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
  outputDir: 'dist/monitor/',
  pages: {
    index: 'src/main.js',
  },
};
