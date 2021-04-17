module.exports = {
    entry: {
        main: "./src/index.js",
        popup: "./src/popup.js"
    },
    module: {
        rules: [
            {
                test: /\.json$/, // trying to load json not working
                use: 'json-loader'
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            }, {
                test: /\.(svg|png|jpg|gif|ico)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "imgs"
                    }
                }
            },
        ]
    }

}