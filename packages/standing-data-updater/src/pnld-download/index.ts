import fs from "node:fs/promises"
import { consistentSort } from "../lib/consistentSort"
import { config } from "./config"
import { PnldFileDownloader } from "./PnldFileDownloader"
import { processPnldFiles } from "./processPnldFiles"

export const pnldDownload = async () => {
  const maxRetries = 5
  let retries = 1

  while (retries <= maxRetries) {
    try {
      console.log(`Downloading PNLD data - attempt ${retries} of ${maxRetries}`)

      const downloader = new PnldFileDownloader(config)
      const files = await downloader.download()
      const records = await processPnldFiles(files)
      const data = consistentSort(records)
      await fs.writeFile("input-data/offence-code/pnld-offences.json", JSON.stringify(data, null, 2))

      console.log("PNLD data successfully downloaded")
      return
    } catch (e) {
      console.error("Error downloading PNLD data")
      console.error(e)
    }

    retries += 1
  }

  if (retries >= maxRetries) {
    throw new Error("Failed to download PNLD data")
  }
}
