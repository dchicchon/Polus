const MiniCssExtractPlugin = require("mini-css-extract-plugin") // extract css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // minimize css
const TerserPlugin = require("terser-webpack-plugin") // minimize js
const HtmlWebpackPlugin = require('html-webpack-plugin') // minimize html

module.exports = {
    entry: {
        main: "./src/index.js"
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/template.html",
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    remoteComments: true
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,// 3. Inject styles into DOM 
                    'css-loader',  // 2. Turns css into commonjs
                    'sass-loader', // 1. Turns sass to css
                ]
            },
        ]
    }
}