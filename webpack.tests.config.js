require('dotenv').config()

module.exports = {
  entry: 'mocha-loader!./spec/index.js',
  mode: 'development',
  output: {
      filename: 'test.build.js',
      path: '/spec/',
      publicPath: 'http://localhost:' + process.env.TEST_PORT + '/spec'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  devServer: {
      host: 'localhost',
      port: process.env.TEST_PORT
  }
};