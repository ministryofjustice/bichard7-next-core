import type { Result } from "../types/AnnotatedHearingOutcome"

const penaltyPointsDisposalText = (result: Result): string => {
  const numbersSpecifiedInResult = result.NumberSpecifiedInResult ? result.NumberSpecifiedInResult : []
  for (const num of numbersSpecifiedInResult) {
    if (!!num.Number) {
      return num.Number + " PENALTY POINTS"
    }
  }
  return ""
}

export default penaltyPointsDisposalText
