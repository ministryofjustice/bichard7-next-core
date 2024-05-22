import type { Result } from "../types/AnnotatedHearingOutcome"
import isRecordableResult from "./isRecordableResult"

const recordableResultCount = (results: Result[]): number => {
  let count = 0
  results.forEach((result) => {
    if (isRecordableResult(result)) {
      count++
    }
  })

  return count
}

export default recordableResultCount
