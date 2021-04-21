const path = require("path");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css
const common = require("./webpack.common");
const CopyPlugin = require("copy-webpack-plugin"); // used to copy files of any time to dist
const { dirname } = require("path");

module.exports = merge(common, {
  mode: "development",

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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      path: path.resolve(__dirname, "dist/css"),
    }),
  ],
});
