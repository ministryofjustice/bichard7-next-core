import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type { SkippedFile } from "./processRange"

import { resultMatches } from "./printResult"

type ComparisonResultStatistics = {
  errored: number
  expectedPassed: number
  expectedPassedAho: number
  expectedPassedPncUpdateDataset: number
  failed: number
  intentional: number
  passed: number
  passedAho: number
  passedPncUpdateDataset: number
  skipped: number
  total: number
}

const isIncomingMessageAho = (result: ComparisonResultDetail): boolean => {
  return result.incomingMessageType?.toLowerCase() === "annotatedhearingoutcome"
}

const isIncomingMessagePncUpdateDataset = (result: ComparisonResultDetail): boolean => {
  return result.incomingMessageType?.toLowerCase() === "pncupdatedataset"
}

const getComparisonResultStatistics = (
  results: (ComparisonResultDetail | SkippedFile)[]
): ComparisonResultStatistics => {
  const expectedPassingResults = results.filter(
    (result) => !result.skipped && !result.intentionalDifference
  ) as ComparisonResultDetail[]

  const passedResults = expectedPassingResults.filter((result) => resultMatches(result))
  const passed = passedResults.length
  const expectedPassed = expectedPassingResults.length
  const errored = results.filter((result) => "error" in result && result.error).length

  return {
    total: results.length,
    passed,
    expectedPassed,
    skipped: results.filter((result) => result.skipped && !result.intentionalDifference).length,
    intentional: results.filter((result) => "intentionalDifference" in result && result.intentionalDifference).length,
    errored,
    passedAho: passedResults.filter((result) => isIncomingMessageAho(result)).length,
    expectedPassedAho: expectedPassingResults.filter((result) => isIncomingMessageAho(result)).length,
    passedPncUpdateDataset: passedResults.filter((result) => isIncomingMessagePncUpdateDataset(result)).length,
    expectedPassedPncUpdateDataset: expectedPassingResults.filter((result) => isIncomingMessagePncUpdateDataset(result))
      .length,
    failed: expectedPassed - passed - errored
  }
}

export default getComparisonResultStatistics
