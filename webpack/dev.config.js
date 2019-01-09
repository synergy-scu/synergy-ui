const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
// const StringReplacePlugin = require('string-replace-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const WEBPACK_PORT = process.env.WEBPACK_PORT || 8082;

module.exports = merge(baseConfig, {
    entry: ['react-hot-loader/patch', 'webpack/hot/dev-server', `webpack-dev-server/client?http://localhost:${WEBPACK_PORT}/`],
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new StringReplacePlugin(),
        // new BundleAnalyzerPlugin(),
    ],
});
