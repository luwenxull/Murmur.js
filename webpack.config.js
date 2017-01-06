module.exports = {
    entry: './Murmur.js',
    output: {
        filename: './dist/Murmur.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,exclude: /node_modules/,loader: "babel-loader"
        }]
    }
}