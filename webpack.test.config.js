module.exports = {
    entry: './test/murmur.test.js',
    output: {
        filename: './test/murmur.test.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,exclude: /node_modules/,loader: "babel-loader"
        }]
    }
}