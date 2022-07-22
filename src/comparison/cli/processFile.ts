import type { ComparisonResult } from "src/comparison/compare"
import compare from "src/comparison/compare"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = (contents: string, fileName: string, date: Date): ComparisonResult => {
  const result = compare(contents, true, { defaultStandingDataVersion: getStandingDataVersionByDate(date) })
  result.file = fileName
  return result
}

export default processFile
