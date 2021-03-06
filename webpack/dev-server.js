var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require("./make-webpack-config")({
  development: true,
  devPanel: false,
  devtool: "eval",
  debug: true
});

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  colors: true,
  progress: true,
  hot: true,
  historyApiFallback: true
}).listen(9000, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:9000');
});
