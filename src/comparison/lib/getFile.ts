import fs from "fs"
import { cacheFileExists, clearCache, getCacheFile, storeCacheFile } from "../cli/cache"
import createS3Config from "./createS3Config"
import getFileFromS3 from "./getFileFromS3"

const s3Config = createS3Config()

const getFile = async (file: string, cache: boolean): Promise<string> => {
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
  return contents
}

export default getFile
