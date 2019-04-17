const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const PATHS = {
  context: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist')
};


module.exports = {
  mode: 'development',
  entry: {
    app: './index.js'
  },
  context:PATHS.context,
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: PATHS.dist,
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './src',
    hot: true,
    compress: true,
    port: 3001
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    usedExports: true
  }
};