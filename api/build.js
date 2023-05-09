const ignorePlugin = require("esbuild-plugin-ignore")

require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    logLevel: "info",
    outdir: "build",
    minify: true,
    target: "node16",
    platform: "node",
    plugins: [
      ignorePlugin([
        {
          resourceRegExp: /pg-native$/,
          contextRegExp: /node_modules\//
        }
      ])
    ]
  })
  .catch(() => process.exit(1))
