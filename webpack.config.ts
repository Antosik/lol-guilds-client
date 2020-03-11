import type { Configuration } from 'webpack';

import MainConfig from "./config/webpack.config.main";
import RendererConfig from "./config/webpack.config.renderer";

const config: Configuration[] = [
  MainConfig,
  RendererConfig
];

export default config;