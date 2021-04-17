const path = require("path")
const common = require("./webpack.common")
const { merge } = require("webpack-merge")

const MiniCssExtractPlugin = require("mini-css-extract-plugin") // extract css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // minimize css
const TerserPlugin = require("terser-webpack-plugin") // minimize js
const HtmlWebpackPlugin = require('html-webpack-plugin') // minimize html
// const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin"); // minify json

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        minimizer: [
            // new JsonMinimizerPlugin(), // for json
            new CssMinimizerPlugin(), // for css
            new TerserPlugin(), // for js
            new HtmlWebpackPlugin({
                template: "./src/template.html", // my html file that im using
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
    },
    plugins: [
        new MiniCssExtractPlugin(
            { filename: "[name].[contenthash].css" }
        )
    ]
})