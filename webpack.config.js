const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: [
        './js/src/main.js',
        './js/src/site-controls.js',
        './js/src/pin-manager.js',
    ],
    plugins: [new CleanWebpackPlugin(['js/dist'])],
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'js/dist'),
    }
};