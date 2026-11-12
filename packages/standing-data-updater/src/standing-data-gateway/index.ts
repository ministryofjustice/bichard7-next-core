import fs from "node:fs/promises"
import { consistentSort } from "../lib/consistentSort"
import { convertApiResponse } from "./convertApiResponse"
import { getOffence } from "./getOffence"

export const standingDataDownload = async () => {
  console.log("Calling Standing Data API")

  const alphaChar = [..."ABCDEFGHIJKLMNOPRSTUVWXYZ"] // "Q" Removed as not a valid request
  const chunks = 5
  const allApiResponses = []
  for (let i = 0; i < alphaChar.length; i += chunks) {
    let tempArray = []
    tempArray = alphaChar.slice(i, i + chunks)
    const promisedTasks = tempArray.map(getOffence)

    allApiResponses.push(await Promise.all(promisedTasks))
  }

  const offenceCodes = allApiResponses.flat().map(convertApiResponse)
  const data = consistentSort(offenceCodes.flat())
  await fs.writeFile("input-data/offence-code/standing-data-offences.json", JSON.stringify(data, null, 2))

  console.log("Standing Data API data successfully retrieved")
}
