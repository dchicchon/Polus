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
    ],
  },
};
