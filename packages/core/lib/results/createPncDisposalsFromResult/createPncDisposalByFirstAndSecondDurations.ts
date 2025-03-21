import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"

import { getDisposalTextFromResult } from "../getDisposalTextFromResult"
import createPncDisposal from "./createPncDisposal"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isAmountSpecifiedInResultValid from "./isAmountSpecifiedInResultValid"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"

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
    disposalText = `from ${dateSpecifiedInResult.toLocaleDateString("en-GB", { year: "2-digit", month: "2-digit", day: "2-digit" })}`
    dateSpecifiedInResult = undefined
  }

  const validatedDisposalText =
    result.ResultVariableText && disposalText.length > maxDisposalTextLength
      ? `${disposalText.slice(0, maxDisposalTextLength - 1)}+`
      : disposalText

  const disposal = createPncDisposal({
    amountSpecifiedInResult: validatedAmountInResult,
    dateSpecifiedInResult,
    disposalText: validatedDisposalText,
    durationLength: firstDuration?.DurationLength,
    durationUnit: firstDuration?.DurationUnit,
    pncDisposalType: result.PNCDisposalType,
    resultQualifiers: result.ResultQualifierVariable?.map((result) => result.Code),
    secondaryDurationLength: secondDuration?.DurationLength,
    secondaryDurationUnit: secondDuration?.DurationUnit
  })

  return disposal
}

export default createPncDisposalByFirstAndSecondDurations
