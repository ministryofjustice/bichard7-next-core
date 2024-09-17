import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import DateSpecifiedInResultSequence from "../../../../../../types/DateSpecifiedInResultSequence"
import ResultClass from "../../../../../../types/ResultClass"

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
      ResultClass.ADJOURNMENT_PRE_JUDGEMENT,
      ResultClass.ADJOURNMENT_WITH_JUDGEMENT,
      ResultClass.ADJOURNMENT_POST_JUDGEMENT
    ].includes(result.ResultClass)
    ? new Date(result.NextHearingDate)
    : undefined
}

export default getFirstDateSpecifiedInResult
