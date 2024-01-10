const HtmlWebPackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const production = process.env.NODE_ENV === 'production';

module.exports = () => {
  const env = dotenv.config().parsed;
  return {
    entry: {
      index: path.resolve(__dirname, 'src/index.js'),
      users: path.resolve(__dirname, 'src/view/components/admininterface/UsersList/index.js'),
      visitors: path.resolve(__dirname, 'src/view/components/visitors/VisitorsList/index.js'),
      watchers: path.resolve(__dirname, 'src/view/components/watchers/WatchersList.js')
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      pathinfo: true,
      filename: production ? 'static/js/[name].[chunkhash].js' : 'static/js/[name].js',
      chunkFilename: 'static/js/[id].js',
      publicPath: '/'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.json', '.jsx'],
      alias: {
        'react-native': 'react-native-web'
      }
    },
    devServer: {
      host: env.WEBPACK_HOST,

      compress: true,
      client: {
        logging: 'none',
        overlay: {
          warnings: false,
          errors: true
        }
      },
      historyApiFallback: {
        disableDotRule: true,
        htmlAcceptHeaders: 'text/html'
      },
      proxy: {
        '/': {
          secure: false,
          target: env.API_URL,
          changeOrigin: true,
          bypass(req) {
            if (req.headers.accept.indexOf('text/html') !== -1) {
              if (
                req.path === '/api/v1/login' ||
                req.path === '/api/v1/logout' ||
                req.path.indexOf('/rest/v1/') !== -1 ||
                req.path.indexOf('/rest/v2/') !== -1
              ) {
                return null;
              }
              return '/index.html';
            }
          }
        }
      },
      port: env.WEBPACK_PORT
    },
    stats: {
      preset: 'minimal'
    },
    watchOptions: {
      ignored: /node_modules/
    },
    optimization: {
      runtimeChunk: {
        name: (entrypoint) => `runtimechunk~${entrypoint.name}`
      },
      chunkIds: 'deterministic',
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint/lib/cli-engine/formatters/stylish')
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset'
        },
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['autoprefixer']]
                }
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './public/index.html',
        filename: './index.html',
        chunks: ['index']
      }),
      new MiniCssExtractPlugin({
        filename: production ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: '[id].css'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin(env),
      new webpack.ids.HashedModuleIdsPlugin(),
      new CleanWebpackPlugin()
    ]
  };
};
