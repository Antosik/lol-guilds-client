import { resolve as resolvePath } from "path";

export const alias = {
  "@guilds-main": resolvePath(__dirname, "main/src"),
  "@guilds-web": resolvePath(__dirname, "renderer/src"),
  "@guilds-shared": resolvePath(__dirname, "shared"),
};
