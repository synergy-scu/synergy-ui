const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./dev.config.js');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'build/');

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
    contentBase: BUILD_DIR,
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});
server.listen(process.env.WEBPACK_PORT || 8082, 'localhost');
