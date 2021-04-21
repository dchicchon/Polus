const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin"); // used to copy files of any time to dist

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    // popup: "./src/popup.js",
    background: "./src/background.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
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
          from: "*.json",
          to: path.resolve(__dirname, "dist"),
        },
        {
          context: "src/",
          from: "./assets/",
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    // new HtmlWebpackPlugin({ template: "./src/popup.html" }),
    new CleanWebpackPlugin(),
  ],
};
