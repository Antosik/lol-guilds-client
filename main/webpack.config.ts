import { Configuration, DefinePlugin } from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import { join as joinPath } from "path";
import TerserPlugin from "terser-webpack-plugin";

import { alias } from "../webpack.config";

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
    new CopyWebpackPlugin([
      {
        from: joinPath(__dirname, "static"),
        to: joinPath(__dirname, "..", "target")
      }
    ]),

    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
  ],

  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()]
  },
}

export default config;