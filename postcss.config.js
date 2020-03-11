const production = process.env.mode === "production";

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("autoprefixer"),
  ]
};
