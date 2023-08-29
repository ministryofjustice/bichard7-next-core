// eslint-disable-next-line import/no-extraneous-dependencies
const ignorePlugin = require("esbuild-plugin-ignore")

const buildOptions = {
  entryPoints: ["phase1/phase1.ts"],
  bundle: true,
  logLevel: "info",
  outdir: "build",
  minify: true,
  target: "node16",
  format: "cjs",
  platform: "node",
  plugins: [
    ignorePlugin([
      {
        resourceRegExp: /pg-native$/,
        contextRegExp: /node_modules\/pg/
      }
    ])
  ]
}

// eslint-disable-next-line import/no-extraneous-dependencies
require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))

module.exports = { buildOptions }
