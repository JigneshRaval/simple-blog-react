// webpack.config.js

const env = process.env.NODE_ENV;
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        // vendor: './src/vendor.ts',
        app: './src/main.tsx'
    },
    mode: env,
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
        chunkFilename: "[name].bundle.js",
        libraryTarget: "umd", // universal module definition
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.vue', '.json']
    },
    optimization: {
        occurrenceOrder: false,
        minimize: false,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                default: false
            }
        }
    },
    module: {
        rules: [
            {
                // SCSS Compilation : sass / scss loader for webpack
                test: /\.(sass|scss)$/i,
                use: ExtractTextPlugin.extract({
                    // fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/'
                    }
                }]
            },
            // TK THE LOADER: needed to process typescript files. Note the option used. We'll also need sfc.d.ts so that typescript can find the necessary .vue files
            // TK make sure to npm install ts-loader and npm link typscript if its installed globally
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        // Extract CSS from javascript file and put it into another CSS file in dist folder
        new ExtractTextPlugin({
            // define where to save the file
            filename: 'assets/css/[name].bundle.css',
            allChunks: true
        }),

        new HtmlWebpackPlugin({
            inject: true,
            title: 'React Typescript blog',
            template: `${__dirname}/src/index.html`,
            filename: `${__dirname}/dist/index.html`, //relative to root of the application
        }),
    ],
    /* devServer: {
        historyApiFallback: true,
        noInfo: false
    },
    performance: {
        hints: false
    }, */

}

/*
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
 */
