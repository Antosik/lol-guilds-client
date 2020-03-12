const { join: joinPath } = require("path");
const sveltePreprocess = require("svelte-preprocess");

module.exports.preprocess = sveltePreprocess({
  typescript: {
    transpileOnly: true,
    tsconfigFile: joinPath(__dirname, "tsconfig.json"),
    compilerOptions: {
      paths: {
        "@guilds-main/*": ["main/src/*"],
        "@guilds-web/*": ["renderer/src/*"],
        "@guilds-shared/*": ["shared/*"],
      }
    },
  },
  postcss: true
});