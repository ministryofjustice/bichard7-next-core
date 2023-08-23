import type ComparisonResultDetail from "phase1/comparison/types/ComparisonResultDetail"
import { parseComparisonFile } from "phase1/tests/helpers/processTestFile"
import { isPhase1 } from "phase1/comparison/lib/checkPhase"
import comparePhase1 from "phase1/comparison/lib/comparePhase1"
import getStandingDataVersionByDate from "phase1/comparison/cli/getStandingDataVersionByDate"

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
