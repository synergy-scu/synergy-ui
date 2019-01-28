/* eslint-disable no-sync, no-undefined */
const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const StringReplacePlugin = require('string-replace-webpack-plugin');

const babelConfiguration = require('../babel.config');

const APP_DIR = path.resolve(__dirname, '../app/');
const BUILD_DIR = path.resolve(__dirname, '../build/');

const config = {
    entry: [path.join(APP_DIR, 'index.js'), path.join(APP_DIR, 'index.scss')],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        pathinfo: false,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [APP_DIR],
                loader: 'babel-loader',
                options: babelConfiguration,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /-spec\.js$/,
                loader: 'ignore-loader',
            },
            {
                test: /\.(svg|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: "file-loader?[name].[ext]",
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        // new StringReplacePlugin(),
        new HtmlWebpackPlugin({
            title: 'Synergy UI',
            filename: 'index.html',
            cache: true,
            template: path.resolve(APP_DIR, 'index.html'),
        }),
    ],
    resolve: {
        symlinks: true,
        extensions: ['.js', '.json', "*"],
    },
};

module.exports = config;
