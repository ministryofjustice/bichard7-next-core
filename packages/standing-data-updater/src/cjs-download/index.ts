import * as fs from "fs"
import consistentSort from "../lib/consistentSort"
import convertOds from "./convertOds"
import downloadFile from "../lib/downloadFile"
import getDownloadUrl from "./getDownloadUrl"

export default async () => {
  console.log("Downloading CJS data")
  const downloadLinkRegex = /(https:\/\/.*offences.*cjs.*index.*\.csv?)"/i
  const downloadLocation = await getDownloadUrl(downloadLinkRegex)
  const fileContents = await downloadFile(downloadLocation)
  const offenceCodes = convertOds(fileContents)
  const data = consistentSort(offenceCodes)
  await fs.promises.writeFile("input-data/offence-code/cjs-offences.json", JSON.stringify(data, null, 2))
  console.log("CJS data successfully downloaded")
}
