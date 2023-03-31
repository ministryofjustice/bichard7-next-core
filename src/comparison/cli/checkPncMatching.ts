import { parseComparisonFile } from "tests/helpers/processTestFile"
import { isPhase1 } from "../lib/checkPhase"
import comparePncMatching from "../lib/comparePncMatching"
import type PncComparisonResultDetail from "../types/PncComparisonResultDetail"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const checkPncMatching = async (
  contents: string,
  fileName: string,
  date: Date
): Promise<PncComparisonResultDetail | undefined> => {
  const comparison = parseComparisonFile(contents)
  if (isPhase1(comparison)) {
    const result = await comparePncMatching(comparison, {
      defaultStandingDataVersion: getStandingDataVersionByDate(date)
    })
    result.file = fileName
    return result
  }
}

export default checkPncMatching
