/* global require, process, module, __dirname */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const inProduction = process.env.NODE_ENV === 'production';
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
];
let optimization={};
if (inProduction) {
  optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  };
}

module.exports = {
  plugins,
  optimization,
  watch: !inProduction,
  devtool: !inProduction && 'source-map',
  entry: {
    main: './scripts.js',
},
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': `${__dirname}`,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
              }
            }
          ],
        },
      {
        test: /\.(png|svg|jpg|gif|webp|woff2)$/,
        exclude: /(node_modules)/,
        loader: 'url-loader',
    },
    ],
  },
};
