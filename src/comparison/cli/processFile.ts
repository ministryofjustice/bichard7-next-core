import type { ComparisonResult } from "../lib/compareMessage"
import compareMessage from "../lib/compareMessage"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = (contents: string, fileName: string, date: Date): ComparisonResult => {
  const result = compareMessage(contents, true, { defaultStandingDataVersion: getStandingDataVersionByDate(date) })
  result.file = fileName
  return result
}

export default processFile
