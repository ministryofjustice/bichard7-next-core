import { parseComparisonFile } from "tests/helpers/processTestFile"
import { isPhase1 } from "../lib/checkPhase"
import compareMessage from "../lib/comparePhase1"
import type ComparisonResult from "../types/ComparisonResult"
import getStandingDataVersionByDate from "./getStandingDataVersionByDate"

const processFile = async (contents: string, fileName: string, date: Date): Promise<ComparisonResult | undefined> => {
  const comparison = parseComparisonFile(contents)
  if (isPhase1(comparison)) {
    const result = await compareMessage(comparison, true, {
      defaultStandingDataVersion: getStandingDataVersionByDate(date)
    })
    result.file = fileName
    return result
  }
}

export default processFile
