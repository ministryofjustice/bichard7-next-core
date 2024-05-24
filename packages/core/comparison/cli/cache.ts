import fs from "fs"
import path from "path"

const cacheDir = "/tmp/comparison"

const getCachePath = (file: string): string => {
  const match = file.match(/s3\:\/\/[^\/]*\/(.*)/)
  if (!match) {
    throw new Error("Could not process file name")
  }

  return `${cacheDir}/${match[1]}`
}

const cachedFileIsNotEmpty = (file: string): Promise<boolean> =>
  fs.promises.stat(getCachePath(file)).then((stats) => stats.size > 0)

export const cacheFileExists = (file: string): Promise<boolean> =>
  fs.promises
    .access(getCachePath(file))
    .then(() => cachedFileIsNotEmpty(file))
    .catch((_) => false)

export const getCacheFile = (file: string): Promise<string> =>
  fs.promises.readFile(getCachePath(file)).then((f) => f.toString())

export const storeCacheFile = async (file: string, contents: string): Promise<void> => {
  const cachePath = getCachePath(file)
  const baseDir = path.parse(cachePath).dir
  await fs.promises.mkdir(baseDir, { recursive: true })
  return fs.promises.writeFile(cachePath, contents)
}

export const clearCache = async (): Promise<void> => {
  if (fs.existsSync(cacheDir)) {
    await fs.promises.rm(cacheDir, { recursive: true })
  }
}
