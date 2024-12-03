const path = require('path');
const webpack = require('webpack');

module.exports = {
    // plugins: [
    //     new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })
    // ],
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
        moduleTrace: true,  // Включает трассировку модулей
        colors: true,       // Цветной вывод
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
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: ['file-loader'],  // или замените на 'url-loader'
            },
            {
                test: /\.scss$/, // добавляем правило для SCSS файлов
                use: [
                    'style-loader',  // Встраивает CSS в DOM
                    'css-loader',    // Преобразует CSS в CommonJS
                    'sass-loader',   // Компилирует Sass в CSS
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3001,
        open: true,
        allowedHosts: 'all',
        historyApiFallback: true, // Поддержка React Router
    },
    mode: 'development',
};
