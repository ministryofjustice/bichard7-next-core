import fs from "fs"
import compare from "src/comparison/compare"
import createS3Config from "src/comparison/createS3Config"
import getFileFromS3 from "src/comparison/getFileFromS3"
import printOutput from "./printOutput"

const s3Config = createS3Config()

const processFile = async (file: string) => {
  let contents: string | Error | undefined
  if (file.startsWith("s3://")) {
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
  } else {
    contents = fs.readFileSync(file).toString()
  }

  const result = compare(contents, true)
  printOutput(result)
}

export default processFile
