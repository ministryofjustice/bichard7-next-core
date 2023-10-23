const fs = require("fs")
const path = require("path")

const currentPath = process.cwd()

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
  const transpiledFiles = await findFiles(path.resolve(currentPath, "dist"), "js")
  const srcPath = path.resolve(currentPath, "dist")
  await Promise.all(
    transpiledFiles.map(
      (file) =>
        new Promise((resolve) => {
          const content = fs.readFileSync(file).toString()
          const filePath = path.dirname(file)
          const relativePath = path.relative(filePath, srcPath)
          const updatedContent = content.replace(/(require\(")(@moj-bichard7)(\/.*"\))/g, `$1${relativePath}/..$3`)
          fs.writeFileSync(file, updatedContent)
          resolve()
        })
    )
  )
}

async function run() {
  await resolveImportPaths()
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error)
  process.exit(1)
})
