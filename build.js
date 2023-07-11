const ignorePlugin = require("esbuild-plugin-ignore")

const buildOptions = {
  entryPoints: ["src/index.ts"],
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

require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))

module.exports = { buildOptions }
