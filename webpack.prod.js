const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // minimize css
const TerserPlugin = require("terser-webpack-plugin"); // minimize js
const HtmlWebpackPlugin = require("html-webpack-plugin"); // minimize html
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin"); // minify json
const CopyPlugin = require("copy-webpack-plugin"); // used to copy files of any time to dist

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new JsonMinimizerPlugin(), // for json
      new CssMinimizerPlugin(), // for css
      // new TerserPlugin(), // for js
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.html", // template html
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          remoteComments: true,
        },
      }),
      new HtmlWebpackPlugin({
        filename: "popup.html",
        template: "./src/popup.html", // popup html
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          remoteComments: true,
        },
      }),
    ],
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
    }),
    new CleanWebpackPlugin(),
  ],
});
