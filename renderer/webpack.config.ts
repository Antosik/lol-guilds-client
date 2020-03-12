import type { Configuration } from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join as joinPath } from "path";
import TerserPlugin from "terser-webpack-plugin";
import { DefinePlugin, IgnorePlugin } from "webpack";

import { preprocess } from "./svelte.config";
import { alias } from "../webpack.config";

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";


const config: Configuration = ({
  name: "guilds-view",
  target: "electron-renderer",

  mode: "none",
  devtool: isProduction ? "hidden-source-map" : "cheap-module-source-map",

  resolve: {
    extensions: [".mjs", ".js", ".ts", ".svelte", ".html"],
    alias
  },

  entry: joinPath(__dirname, "src/index.ts"),
  output: {
    path: joinPath(__dirname, "..", "target/renderer"),
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: /node_modules/,
        use: {
          loader: "svelte-loader",
          options: {
            dev: !isProduction,
            hotReload: !isProduction,
            immutable: true,
            emitCss: true,
            preprocess
          }
        }
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          { loader: "postcss-loader", options: { config: { path: __dirname } } }
        ]
      }
    ]
  },

  plugins: [
    new IgnorePlugin(/.*\.js.map$/i),

    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),

    new CopyWebpackPlugin([
      {
        from: joinPath(__dirname, "static"),
        to: joinPath(__dirname, "..", "target"),
      }
    ]),

    new MiniCssExtractPlugin({
      filename: "../css/[name].css"
    })
  ],

  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()]
  },
});

export default config;