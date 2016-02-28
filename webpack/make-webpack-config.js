var path = require("path");
var webpack = require("webpack");
//var StatsPlugin = require("stats-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(options) {
  var entry;

  if (options.development) {
    entry = {
      grorcery: [
        'webpack-dev-server/client?http://0.0.0.0:9000',
        'webpack/hot/only-dev-server',
        './index'
      ]
    };
  } else {
    entry = {
      grorcery: './index'
    }
  }

  var loaders = [
    // TypeScript
    {
      test: /\.tsx?$/,
      loaders: ['react-hot', 'ts-loader']
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "url-loader?limit=10000&minetype=application/font-woff"
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }
  ];

  if (options.separateStylesheet) {
    loaders.push(
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
      }
    );
  }
  else {
    loaders.push(
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    );
  }


  var publicPath = options.development
    ? "http://localhost:9000/_assets/"
    : "/_assets/";

  var plugins = [
    new webpack.PrefetchPlugin("react")
  ];

  if (options.minimize) {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.optimize.DedupePlugin()
    ]);
  }

  if (options.minimize) {
    plugins = plugins.concat([
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }),
      new webpack.NoErrorsPlugin()
    ]);
  }

  if (options.development) {
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: true,
        __DEVPANEL__: options.devPanel
      })
    ]);
  } 
  else {
    plugins = plugins.concat([new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVPANEL__: false
    }),
      new ExtractTextPlugin("styles.css")
    ]);
  }

  return {
    entry: entry,
    output: {
      path: path.join(__dirname, ".", "build", options.development ? "development" : "public"),
      publicPath: publicPath,
      filename: options.development ? "[id].js" : "[name].js",
      chunkFilename: "[id].js",
      sourceMapFilename: "debugging/[file].map",
      pathinfo: options.debug
    },
    target: 'web',
    module: {
      loaders: loaders
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, '..', "node_modules")
    },
    resolve: {
      root: path.join(__dirname, "..", "app"),
      modulesDirectories: ['node_modules'],
      extensions: ["", ".web.js", ".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: plugins,
    devServer: {
      stats: {
        cached: false
      }
    }
  };
};
