const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },

    stats: {
        all: false,
        errors: true,
        warnings: true,
        assets: true,
        moduleTrace: true,
        colors: true,
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['file-loader'],
            },
            {
                test: /\.(scss)$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.svg', '.png', '.jpg'],
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3001,
        open: true,
        allowedHosts: 'all',
        historyApiFallback: true,
    },

    mode: 'development',
};
