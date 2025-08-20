import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import DateSpecifiedInResultSequence from "../../../types/DateSpecifiedInResultSequence"

const getFirstDateSpecifiedInResult = (result: Result): Date | undefined => {
  if (result.DateSpecifiedInResult?.length) {
    const startDate = result.DateSpecifiedInResult.find(
      (date) => date.Sequence === DateSpecifiedInResultSequence.FirstStartDate
    )
    const endDate = result.DateSpecifiedInResult.find(
      (date) => date.Sequence === DateSpecifiedInResultSequence.FirstEndDate
    )

    return (startDate ?? endDate)?.Date
  }

  return result.NextHearingDate &&
    result.ResultClass &&
    [
      ResultClass.ADJOURNMENT_POST_JUDGEMENT,
      ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
      ResultClass.ADJOURNMENT_WITH_JUDGEMENT
    ].includes(result.ResultClass)
    ? new Date(result.NextHearingDate)
    : undefined
}

export default getFirstDateSpecifiedInResult
