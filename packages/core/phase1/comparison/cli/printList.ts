// eslint-disable-next-line import/no-extraneous-dependencies
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import { resultMatches } from "./printResult"
import type { SkippedFile } from "./processRange"

const printList = (
  result?: (ComparisonResultDetail | SkippedFile) | (ComparisonResultDetail | SkippedFile)[]
): boolean => {
  if (!result) {
    return false
  }
  if (Array.isArray(result)) {
    const results = result.map((r) => printList(r))
    return results.every((res) => res)
  }

  if (result.skipped) {
    return true
  }

  if (result.error || !resultMatches(result)) {
    console.log(result.file)
    return false
  }

  return true
}

export default printList
