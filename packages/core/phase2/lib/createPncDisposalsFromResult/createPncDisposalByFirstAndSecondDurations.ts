import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"
import createPncDisposal from "./createPncDisposal"
import { getDisposalTextFromResult } from "../getDisposalTextFromResult"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isAmountSpecifiedInResultValid from "./isAmountSpecifiedInResultValid"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"
import formatDateSpecifiedInResult from "./formatDateSpecifiedInResult"

export const maxDisposalTextLength = 64

const createPncDisposalByFirstAndSecondDurations = (result: Result): PncDisposal => {
  const durations = result.Duration ?? []
  const firstDuration = durations[0]
  const secondDuration = durations[1] && durations[1].DurationType === "Suspended" ? durations[1] : undefined
  const amountInResult = result.AmountSpecifiedInResult?.[0]?.Amount
  const validatedAmountInResult = isAmountSpecifiedInResultValid(amountInResult) ? amountInResult : undefined

  let dateSpecifiedInResult = getFirstDateSpecifiedInResult(result)
  let disposalText = getDisposalTextFromResult(result)
  if (
    isDriverDisqualificationResult(result.PNCDisposalType) &&
    dateSpecifiedInResult &&
    firstDuration?.DurationLength &&
    !disposalText
  ) {
    disposalText = `from ${formatDateSpecifiedInResult(dateSpecifiedInResult)}`
    dateSpecifiedInResult = undefined
  }

  const validatedDisposalText =
    result.ResultVariableText && disposalText.length > maxDisposalTextLength
      ? `${disposalText.slice(0, maxDisposalTextLength - 1)}+`
      : disposalText

  const disposal = createPncDisposal(
    result.PNCDisposalType,
    firstDuration?.DurationUnit,
    firstDuration?.DurationLength,
    secondDuration?.DurationUnit,
    secondDuration?.DurationLength,
    dateSpecifiedInResult,
    validatedAmountInResult,
    result.ResultQualifierVariable?.map((res) => res.Code),
    validatedDisposalText
  )

  return disposal
}

export default createPncDisposalByFirstAndSecondDurations
