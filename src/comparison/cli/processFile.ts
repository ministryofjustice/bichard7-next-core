import { parseComparisonFile } from "tests/helpers/processTestFile"
import { isPhase1 } from "../lib/checkPhase"
import comparePhase1 from "../lib/comparePhase1"
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
}

export default processFile
