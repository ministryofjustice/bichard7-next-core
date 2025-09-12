import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import DateSpecifiedInResultSequence from "../../../types/DateSpecifiedInResultSequence"
import createPoliceDisposal from "./createPoliceDisposal"
import isAmountSpecifiedInResultValid from "./isAmountSpecifiedInResultValid"

const getDateSpecifiedInResult = (result: Result) => {
  const startDateSpecifiedInResult = result.DateSpecifiedInResult?.find(
    (date) => date.Sequence === DateSpecifiedInResultSequence.SecondStartDate
  )?.Date
  const endDateSpecifiedInResult = result.DateSpecifiedInResult?.find(
    (date) => date.Sequence === DateSpecifiedInResultSequence.SecondEndDate
  )?.Date

  return startDateSpecifiedInResult ?? endDateSpecifiedInResult
}

const createPncDisposalByThirdDuration = (
  result: Result,
  validatedDisposalText: string | undefined
): PoliceDisposal | undefined => {
  const thirdDuration = result.Duration?.[2]
  if (!thirdDuration) {
    return undefined
  }

  const thirdAmountInResult = result.AmountSpecifiedInResult?.[2]?.Amount
  const validatedThirdAmountInResult = isAmountSpecifiedInResultValid(thirdAmountInResult)
    ? thirdAmountInResult
    : undefined

  const disposal = createPoliceDisposal({
    amountSpecifiedInResult: validatedThirdAmountInResult,
    dateSpecifiedInResult: getDateSpecifiedInResult(result),
    disposalText: validatedDisposalText,
    durationLength: thirdDuration?.DurationLength,
    durationUnit: thirdDuration?.DurationUnit,
    pncDisposalType: result.PNCDisposalType,
    resultQualifiers: result.ResultQualifierVariable?.map((result) => result.Code)
  })

  return disposal
}

export default createPncDisposalByThirdDuration
