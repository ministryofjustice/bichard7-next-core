const buildOptions = {
  bundle: true,
  entryPoints: ["src/server.ts"],
  format: "cjs",
  logLevel: "info",
  minify: true,
  outdir: "build",
  platform: "node",
  target: "node16"
}

// eslint-disable-next-line import/no-extraneous-dependencies
require("esbuild")
  .build(buildOptions)
  .catch(() => process.exit(1))

module.exports = { buildOptions }
