import { Configuration, DefinePlugin } from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import { join as joinPath } from "path";
import TerserPlugin from "terser-webpack-plugin";

import { alias } from "../webpack.config";
import { version, bugs, homepage } from "../package.json";


const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";


const config: Configuration = {
  name: "guilds-app",
  target: "electron-main",

  mode: "none",
  devtool: isProduction ? "hidden-source-map" : "cheap-module-source-map",

  resolve: {
    extensions: [".mjs", ".js", ".ts"],
    alias
  },

  entry: joinPath(__dirname, "src/index.ts"),

  output: {
    path: joinPath(__dirname, "..", "target/app"),
    filename: "main.js"
  },

  module: {
    rules: [
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
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      VERSION: JSON.stringify(version),
      ISSUES_URL: JSON.stringify(bugs.url),
      RELEASES_URL: JSON.stringify(`${homepage}/releases/tag/v{}`)
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: joinPath(__dirname, "static"),
          to: joinPath(__dirname, "..", "target")
        }
      ]
    }),
  ],

  optimization: {
    nodeEnv: isProduction ? "production" : "development",
    minimize: isProduction,
    minimizer: [new TerserPlugin({
      parallel: true,
      sourceMap: true,
      terserOptions: {
        keep_fnames: true,
      },
    })]
  },
}

export default config;