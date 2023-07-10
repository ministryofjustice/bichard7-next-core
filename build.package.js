const path = require("path")
const esbuild = require("esbuild")
const fs = require("fs")
const { buildOptions } = require("./build")

async function findFiles(directory, extension, files = []) {
  await Promise.all(
    fs.readdirSync(directory).map(async (filePath) => {
      const absolute = path.join(directory, filePath)
      if (fs.statSync(absolute).isDirectory()) {
        await findFiles(absolute, extension, files)
      } else if (absolute.endsWith(`.${extension}`) && !absolute.endsWith(`.test.${extension}`)) {
        files.push(absolute)
      }
    })
  )

  return files
}

async function resolveImportPaths() {
  const transpiledFiles = await findFiles(path.resolve(__dirname, "dist"), "js")
  const srcPath = path.resolve(__dirname, "dist")
  await Promise.all(
    transpiledFiles.map(
      (file) =>
        new Promise((resolve) => {
          const content = fs.readFileSync(file).toString()
          const filePath = path.dirname(file)
          const relativePath = path.relative(filePath, srcPath)
          fs.writeFileSync(file, content.replace(/(require\(")(src)(\/.*"\))/g, `$1${relativePath}$3`))
          resolve()
        })
    )
  )
}

async function run() {
  const files = await findFiles(path.resolve(__dirname, "src"), "ts")
  await esbuild.build({
    ...buildOptions,
    entryPoints: files,
    outdir: "dist",
    minify: false,
    bundle: false
  })

  console.log("Resolving import paths...")
  await resolveImportPaths()

  console.log("Build finished.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
