var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    wpConfig = require('./webpack.config');

new WebpackDevServer(webpack(wpConfig), {
    publicPath: wpConfig.output.publicPath,
    hot: true,
    historyApiFallback: true
}).listen(8080, 'localhost', function (err, result) {
    if (err) {
        return console.log(err);
    }
    console.log('HOT listening at localhost:8080');
    console.log("Please wait while the bundle builds...");
});
