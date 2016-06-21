const path = require('path')
const webpack = require('webpack')

const config = {
  entry: path.resolve(__dirname, './demo/index.js'),
  output: {
    path: './dev/demo',
    filename: 'demo.js',
  },
  module: {
    loaders: [
      {
        test: /\.vex$/,
        loader: joinLoaders([
          '../lib/vexil-loader.js',
        ]),
      },
    ],
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime'],
  },
}

webpack(config, function (err, stats) {
  if (stats.compilation.errors.length) {
    stats.compilation.errors.forEach(function (err) {
      console.error(err.message)
    })
  }
})

function joinLoaders (loaders) {
  return loaders.map(loader => {
    return path.resolve(__dirname, loader)
  }).join('!')
}
