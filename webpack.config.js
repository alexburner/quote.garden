var path = require('path');
var webpack = require('webpack');

/**
 * Notes
 * - NODE_ENV set to 'production' in package.json, for React optimization
 * - the build folder is named "docs" to work with GitHub Pages
 */

module.exports = {
  resolve: {
    root: [
      path.resolve('./src')
    ]
  },
  entry: './src/app.jsx',
  output: {
    path: './docs',
    filename: 'bundle.js',
  },
  devtool: 'module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify(process.env.NODE_ENV)}
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      // this tells uglify to stfu about react
      compress: {warnings: false},
    }),
  ],
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: /src/,
        exclude: /node_modules/,
        test: /.jsx?$/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};