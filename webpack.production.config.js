var config = require('config');
var webpack = require('webpack');
var path = require('path');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var vendorLibs = [];
var PUBLIC_PATH = './server/public';
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//process libs from config
for(var lib in config.vendorLibs){
  vendorLibs.push(config.vendorLibs[lib]);
}

var config = {
    entry: {
        index: [
            path.resolve(__dirname, 'client/js/index.jsx'),
            path.resolve(__dirname, 'client/css/styles.css')
        ],
        vendor: [
        ].concat(vendorLibs)
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            'client/js/vendor',
            'client/img',
            'client/fonts'
        ]
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, PUBLIC_PATH),
        filename: 'js/[name].js',
        sourceMapFilename: '[name].map'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/, // A regexp to test the require path
                //loader: 'babel',
                loaders: ['react-hot', 'babel'],
                exclude: [node_modules_dir]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(png|gif|jpg|ico)$/,
                loader: 'file-loader?limit=100000&name=img/[name].[ext]'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?limit=100000&name=fonts/[name].[ext]'
            }
        ]
    },
    node: {
        streams: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.js', Infinity),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new ExtractTextPlugin("css/[name].css", {
            publicPath: path.resolve(__dirname, PUBLIC_PATH, 'css'),
            allChunks: true
        })
    ]
};

module.exports = config;
