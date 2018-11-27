const resolve = require('path').resolve;
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || 'development';
  const devMode = mode === 'development';

  const config = {
    mode: mode,
    devtool: devMode ? 'eval-source-map' : false,
    entry: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './client/src/index.tsx'
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    output: {
      path: resolve(__dirname, 'client/public'),
      filename: 'bundle.min.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: './client/tsconfig.json'
          }
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [['react', 'env', 'stage-2']],
                plugins: ['react-html-attrs'].concat(
                  devMode ? ['react-hot-loader/babel'] : []
                )
              }
            }
          ]
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: devMode ? true : false
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: devMode ? true : false,
                plugins: () => [autoprefixer]
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: devMode ? true : false }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, 'client/template.html'),
        minify: {
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true
        }
      })
    ],

    devServer: {
      historyApiFallback: true,
      contentBase: resolve('./client/public'),
      publicPath: '/',
      proxy: {
        '*': 'http://localhost:3000'
      },
      hot: true
    }
  };
  return config;
};
