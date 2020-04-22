const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { cleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    module: {
        mode: 'production',
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new cleanWebpackPlugin({
            //simulate the removal of files
            dry: true,
            //write logs to console
            verbose: true,
            //auto remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
    ]
}