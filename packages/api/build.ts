import type { Plugin } from "esbuild"
import { build } from "esbuild"
import { cp } from "node:fs/promises"
import path from "node:path"
import glob from "tiny-glob"

function esbuildPluginFastifySwaggerUi(): Plugin {
  return {
    name: "@fastify/swagger-ui",
    setup(build) {
      const { outdir } = build.initialOptions
      const fastifySwaggerUi = path.dirname(require.resolve("@fastify/swagger-ui"))
      const source = path.join(fastifySwaggerUi, "static")
      const dest = path.join(outdir as string, "static")

      build.onEnd(async () => cp(source, dest, { recursive: true }))
    }
  }
}

;(async function () {
  const entryPoints = await glob("src/**/!(*.test).ts")

  build({
    entryPoints,
    logLevel: "info",
    outdir: "build",
    bundle: true,
    minify: true,
    platform: "node",
    format: "cjs",
    sourcemap: true,
    plugins: [esbuildPluginFastifySwaggerUi()]
  })
})()
