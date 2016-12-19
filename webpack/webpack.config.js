var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const dist = path.resolve(__dirname, "../dist/");

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index'
  ],
  output: {
    path: dist,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader?cacheDirectory' ],
      exclude: /node_modules/
    },{
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },{
      test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
      loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
    }]
  },
  debug: true,
  resolve: {
    alias: {
      jquery: "jquery/src/jquery"
    }
  }
};