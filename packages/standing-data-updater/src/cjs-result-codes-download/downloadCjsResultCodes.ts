import fs from "node:fs/promises"
import { getDownloadUrl } from "../cjs-download/getDownloadUrl"
import { consistentSort } from "../lib/consistentSort"
import { downloadFile } from "../lib/downloadFile"
import { convertCjsResultCodes } from "./convertCjsResultCodes"

export const downloadCjsResultCodes = async () => {
  console.log("Downloading CJS Result Codes")

  const downloadLinkRegex = /(https:\/\/.*cjs-result-codes.*\.xlsx?)"/i
  const downloadUrl = await getDownloadUrl(downloadLinkRegex)
  const fileContents = await downloadFile(downloadUrl)
  const resultCodes = convertCjsResultCodes(fileContents)
  const sortedData = consistentSort(resultCodes)
  await fs.writeFile("input-data/cjs-result-codes/cjs-result-data.json", JSON.stringify(sortedData, null, 2))

  console.log("CJS Result Codes successfully downloaded")
}
