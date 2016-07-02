'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const extractSASS = new ExtractTextPlugin(isProd ? 'style-[hash].css' : 'style.css', { allChunks: true });

const plugins = [
  extractSASS,
  // outputs a chunk for all the javascript libraries: angular & co
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    chunks: ['vendor', 'app1', 'app2'],
    minChunks: Infinity,
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js'
  }),
  // handy to enable/disable development features in the client-side code
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${env}"`
  }),
  new HtmlWebpackPlugin({ filename: 'app1.html', chunks: ['app1', 'vendor'] }),
  new HtmlWebpackPlugin({ filename: 'app2.html', chunks: ['app2', 'vendor'] })
];

if (isProd) { // add plugins in case we're in production
  // plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }));
  plugins.push(new CleanWebpackPlugin(['build']));
}

const browserLibs = ['axios'];

module.exports = {
  devtool: isProd ? 'module-source-map' : 'module-inline-source-map',
  entry: {
    app1: path.join(__dirname, 'src/', 'app1.js'),
    app2: path.join(__dirname, 'src/', 'app2.js'),
    vendor: browserLibs
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js',
    sourceMapFilename: isProd ? '[name]-[chunkhash].map' : '[name].map'
  },
  module: {
    loaders: [
      // es6 code
      {
        test: /.js$/,
        loader: ['babel?cacheDirectory'],
        exclude: /node_modules/,
        cacheable: true
      },
      { test: /.html$/, loader: 'html', cacheable: true },
      // scss - and only scss
      { test: /\.scss$/, loader: extractSASS.extract(['css?sourceMap', 'sass?sourceMap']) },
      // { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
      // static assets
      { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url?limit=30000&name=[name]-[hash].[ext]' }
    ]
  },
  plugins,
  sassLoader: {
    includePaths: [path.join(__dirname, 'node_modules')]
  },

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  // devServer: { stats: 'minimal' }
};
