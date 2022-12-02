import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = async (contents: string, fileName: string, date: Date): Promise<ComparisonResult> => {
  const result = await compareMessage(contents, true, {
    defaultStandingDataVersion: getStandingDataVersionByDate(date)
  })
  result.file = fileName
  return result
}

export default processFile
