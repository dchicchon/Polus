const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin"); // used to copy files of any time to dist

module.exports = merge(common, {
  mode: "development",

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 3. Inject styles into DOM
          "css-loader", // 2. Turns css into commonjs
          "sass-loader", // 1. Turns sass to css
        ],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: "src/",
          from: "./assets/",
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./src/manifest.json",
          to: "./manifest.json",
        },
      ],
    }),

    new MiniCssExtractPlugin({ filename: "[name].[fullhash].css" }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
      inject: true,
      filename: "index.html",
      minify: "auto",
    }),
    new HtmlWebpackPlugin({
      template: "./src/popup.html",
      chunks: ["popup"],
      filename: "popup.html",
      inject: true,
      minify: "auto",
    }),
    new CleanWebpackPlugin(),
  ],
});
