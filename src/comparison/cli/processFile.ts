import type { ComparisonResult } from "../compare"
import compare from "../compare"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = (contents: string, fileName: string, date: Date): ComparisonResult => {
  const result = compare(contents, true, { defaultStandingDataVersion: getStandingDataVersionByDate(date) })
  result.file = fileName
  return result
}

export default processFile
