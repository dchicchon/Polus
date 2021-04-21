module.exports = {
  entry: {
    main: "./src/index.js",
    popup: "./src/popup.js",
    background: "./src/background.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      // {
      //   test: /\.(svg|png|jpg|gif|ico)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[ext]",
      //       outputPath: "imgs",
      //     },
      //   },
      // },
    ],
  },
};
