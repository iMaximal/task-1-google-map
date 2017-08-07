const AssetsPlugin = require('assets-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    devtool: false,
    output: {
        filename: '[chunkhash:12].js'
    },
    plugins: [
        new AssetsPlugin({
            filename: 'react.json',
            path: 'manifest',
            processOutput(assets) {
                for (const key in assets) {
                    assets[`${key}.js`] = assets[key].js.slice('/js/'.length)
                    delete assets[key]
                }

                return JSON.stringify(assets)
            }
        })
    ]
}
