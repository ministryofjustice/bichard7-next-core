import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const penaltyPointsDisposalText = (result: Result): string => {
  const numberSpecifiedInResultValue = result.NumberSpecifiedInResult?.find((num) => num.Number)?.Number
  return numberSpecifiedInResultValue ? `${numberSpecifiedInResultValue} PENALTY POINTS` : ""
}

export default penaltyPointsDisposalText
