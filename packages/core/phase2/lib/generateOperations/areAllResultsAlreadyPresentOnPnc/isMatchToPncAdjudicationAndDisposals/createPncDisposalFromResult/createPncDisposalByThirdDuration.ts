import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import DateSpecifiedInResultSequence from "../../../../../../types/DateSpecifiedInResultSequence"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposal from "./createPncDisposal"
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
): PncDisposal | undefined => {
  if (!result.Duration?.[2]) {
    return undefined
  }

  const thirdDuration = result.Duration[2]
  const thirdAmountInResult = result.AmountSpecifiedInResult?.[2]?.Amount
  const validatedThirdAmountInResult = isAmountSpecifiedInResultValid(thirdAmountInResult)
    ? thirdAmountInResult
    : undefined

  const disposal = createPncDisposal(
    result.PNCDisposalType,
    thirdDuration.DurationUnit,
    thirdDuration.DurationLength,
    undefined,
    undefined,
    getDateSpecifiedInResult(result),
    validatedThirdAmountInResult,
    result.ResultQualifierVariable.map((res) => res.Code),
    validatedDisposalText
  )

  return disposal
}

export default createPncDisposalByThirdDuration
