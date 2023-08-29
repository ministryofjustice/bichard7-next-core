const buildOptions = {
  entryPoints: ["src/server.ts"],
  bundle: true,
  logLevel: "info",
  outdir: "build",
  minify: true,
  target: "node16",
  format: "cjs",
  platform: "node"
}

// eslint-disable-next-line import/no-extraneous-dependencies
require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))

module.exports = { buildOptions }
