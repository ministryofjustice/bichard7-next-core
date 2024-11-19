// eslint-disable-next-line import/no-extraneous-dependencies
const ignorePlugin = require("esbuild-plugin-ignore")

const buildOptions = {
  bundle: true,
  entryPoints: ["phase1/phase1.ts"],
  format: "cjs",
  logLevel: "info",
  minify: true,
  outdir: "build",
  platform: "node",
  plugins: [
    ignorePlugin([
      {
        contextRegExp: /node_modules\/pg/,
        resourceRegExp: /pg-native$/
      }
    ])
  ],
  target: "node16"
}

// eslint-disable-next-line import/no-extraneous-dependencies
require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))

module.exports = { buildOptions }
