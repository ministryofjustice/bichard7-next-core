require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    logLevel: "info",
    outdir: "build",
    minify: true,
    target: "node16",
    platform: "node"
  })
  .catch(() => process.exit(1))
