const webpack = require('webpack')

module.exports = {
  entry: './src/bootstrap.js', // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    // options related to how webpack emits results

    path: __dirname + '/public',
    // path: path.resolve(__dirname, '/public'), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: 'bundle.js', // string
    // the filename template for entry chunks

   },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: false,
            cacheDirectory: true,
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
                'transform-runtime',
                'transform-decorators-legacy'
            ]
          }
        }]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      }
    ]
  },
  // plugins: [ //todo
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  //     }
  //   }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //       warnings:       false,
  //       drop_console:   true,
  //       unsafe:         true
  //     }
  //   })
  // ]


};
