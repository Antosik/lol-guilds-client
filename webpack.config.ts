import Copy from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import autoPreprocess from 'svelte-preprocess';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const config: webpack.Configuration[] = [
  {
    mode: 'none',
    name: 'guilds-app',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    entry: './app/index.ts',
    output: {
      path: path.join(__dirname, 'target'),
      filename: 'ignore_this.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'null-loader'
        }
      ]
    },
    plugins: [
      new Copy([
        {
          from: './app/*.html',
          ignore: ['/node_modules/'],
          to: '.',
          flatten: true
        },
        {
          from: './app/*.json',
          ignore: ['/node_modules/'],
          to: '.',
          flatten: true
        },
        {
          from: './app/keymaps/*.json',
          ignore: ['/node_modules/'],
          to: './keymaps',
          flatten: true
        },
        {
          from: './app/static',
          to: './static'
        }
      ])
    ],
    target: 'electron-main'
  },

  {
    mode: 'none',
    name: 'guilds-view',
    resolve: {
      extensions: ['.mjs', '.js', '.svelte', '.ts', '.html',]
    },
    devtool: isProd ? 'hidden-source-map' : 'cheap-module-source-map',
    entry: './lib/index.ts',
    output: {
      path: path.join(__dirname, 'target', 'renderer'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          use: {
            loader: "svelte-loader",
            options: {
              dev: !isProd,
              hotReload: !isProd,
              immutable: true,
              emitCss: true,
              preprocess: autoPreprocess({
                typescript: {
                  transpileOnly: true,
                },
                postcss: true
              })
            }
          }
        },
        {
          test: /\.json/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader"
          ]
        }
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/.*\.js.map$/i),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(nodeEnv)
        }
      }),
      new Copy([
        {
          from: './assets',
          to: './assets'
        }
      ]),

      new MiniCssExtractPlugin({
        filename: "[name].css"
      })
    ],
    optimization: {
      minimize: isProd ? true : false,
      minimizer: [new TerserPlugin()]
    },
    target: 'electron-renderer'
  },
];

export default config;