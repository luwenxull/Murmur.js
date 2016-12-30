module.exports = {
    entry: './Murmur.js',
    output: {
        filename: './build/Murmur.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,exclude: /node_modules/,loader: "babel-loader"
        }]
    }
}