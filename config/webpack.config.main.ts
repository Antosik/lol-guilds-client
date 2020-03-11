import type { Configuration } from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import { join as joinPath } from "path";

const config: Configuration = {
  name: "guilds-app",
  target: "electron-main",

  mode: "none",

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  entry: "./app/index.ts",
  output: {
    path: joinPath(__dirname, "..", "target"),
    filename: "ignore_this.js"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "null-loader"
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./app/*.html",
        ignore: ["/node_modules/"],
        to: ".",
        flatten: true
      }
    ])
  ],
}

export default config;