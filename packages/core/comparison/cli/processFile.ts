import { isPhase1, isPhase2 } from "../lib/checkPhase"
import comparePhase1 from "../lib/comparePhase1"
import comparePhase2 from "../lib/comparePhase2"
import { parseComparisonFile } from "../lib/processTestFile"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = async (
  contents: string,
  fileName: string,
  date: Date
): Promise<ComparisonResultDetail | undefined> => {
  const comparison = parseComparisonFile(contents)
  if (isPhase1(comparison)) {
    const result = await comparePhase1(comparison, true, {
      defaultStandingDataVersion: getStandingDataVersionByDate(date)
    })
    result.file = fileName
    return result
  }
  if (isPhase2(comparison)) {
    const result = comparePhase2(comparison, true)
    result.file = fileName
    return result
  }
}

export default processFile
