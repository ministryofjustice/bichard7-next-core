import fs from "fs"
import type { ComparisonResult } from "src/comparison/compare"
import compare from "src/comparison/compare"
import createS3Config from "src/comparison/createS3Config"
import getFileFromS3 from "src/comparison/getFileFromS3"
import { cacheFileExists, clearCache, getCacheFile, storeCacheFile } from "./cache"

const s3Config = createS3Config()

const processFile = async (file: string, cache: boolean): Promise<ComparisonResult> => {
  let contents: string | Error
  if (!cache) {
    await clearCache()
  }

  if (file.startsWith("s3://")) {
    if (cache && (await cacheFileExists(file))) {
      contents = await getCacheFile(file)
    } else {
      const urlMatch = file.match(/s3\:\/\/([^\/]+)\/(.*)/)
      if (!urlMatch) {
        console.error("Invalid S3 Url")
        process.exit()
      }

      contents = await getFileFromS3(urlMatch[2], urlMatch[1], s3Config)

      if (contents instanceof Error) {
        console.error("Error fetching file from S3", contents)
        process.exit()
      }

      if (cache) {
        await storeCacheFile(file, contents)
      }
    }
  } else {
    contents = await fs.promises.readFile(file).then((f) => f.toString())
    if (contents instanceof Error) {
      console.error("Error reading file", contents)
      process.exit()
    }
  }

  const result = compare(contents, true)
  result.file = file
  return result
}

export default processFile
