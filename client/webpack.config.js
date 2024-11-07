const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname,'dist'),
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
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
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
