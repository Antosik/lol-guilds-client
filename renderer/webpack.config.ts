import { Configuration, DefinePlugin } from "webpack";

import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join as joinPath } from "path";
import TerserPlugin from "terser-webpack-plugin";
import { IgnorePlugin } from "webpack";

import { preprocess } from "./svelte.config";
import { alias } from "../webpack.config";
import { version, bugs } from "../package.json";


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

  entry: {
    main: joinPath(__dirname, "src/index.ts"),
    preload: joinPath(__dirname, "src/preload.ts")
  },
  output: {
    path: joinPath(__dirname, "..", "target/renderer"),
    filename: "[name].js"
  },

  module: {
    rules: [
      {
        test: /\.svelte$/,
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
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          { loader: "postcss-loader" }
        ]
      }
    ]
  },

  plugins: [
    new DefinePlugin({
      VERSION: JSON.stringify(version),
      ISSUES_URL: JSON.stringify(bugs.url)
    }),

    new IgnorePlugin(/.*\.js.map$/i),

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
});

export default config;