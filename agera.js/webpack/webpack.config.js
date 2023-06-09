const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "../"),
        filename: "./agera.js",
    },
    optimization: {
        minimize: false,
    },
};
