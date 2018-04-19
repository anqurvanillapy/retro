const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: '*.html' },
      { from: '*.md' },
      { from: '.gitignore' }
    ])
  ]
}
