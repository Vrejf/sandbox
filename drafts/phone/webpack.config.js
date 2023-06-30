const path = require('path');

module.exports = {
    entry: './phone1.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
