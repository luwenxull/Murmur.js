let path = require('path');
let webpack = require('webpack');
module.exports = function (env) {
    return {
        entry: {
            test: './test/murmur.test',
            murmur:'./source/murmur.app',
            rx:'rxjs-es'
        },
        output: {
            path: path.join(__dirname, '../build'),
            filename: '[name].js',
            // publicPath: publicPath
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['.ts', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: ['murmur','rx','manifest'] // Specify the common bundle's name.
            })
        ],
        module: {
            rules: [
                {
                    test: /\.ts/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                }
            ]
        },
        devtool: 'cheap-eval-source-map'
    }
};
