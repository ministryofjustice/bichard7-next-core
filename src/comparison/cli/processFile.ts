import type { ComparisonResult } from "src/comparison/compareMessage"
import compareMessage from "src/comparison/compareMessage"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = (contents: string, fileName: string, date: Date): ComparisonResult => {
  const result = compareMessage(contents, true, { defaultStandingDataVersion: getStandingDataVersionByDate(date) })
  result.file = fileName
  return result
}

export default processFile
