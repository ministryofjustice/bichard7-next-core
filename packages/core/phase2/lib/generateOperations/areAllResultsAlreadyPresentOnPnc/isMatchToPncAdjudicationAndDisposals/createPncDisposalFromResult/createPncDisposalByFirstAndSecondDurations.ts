import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposal from "./createPncDisposal"
import { getDisposalTextFromResult } from "./getDisposalTextFromResult"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isAmountSpecifiedInResultValid from "./isAmountSpecifiedInResultValid"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"

export const maxDisposalTextLength = 64

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })

const createPncDisposalByFirstAndSecondDurations = (result: Result): PncDisposal => {
  const durationCount = result.Duration ? result.Duration.length : 0
  const firstDuration = durationCount > 0 ? result.Duration?.[0] : undefined
  const secondDuration =
    durationCount > 1 ? (result.Duration?.[1].DurationType === "Suspended" ? result.Duration[1] : undefined) : undefined
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
    disposalText = `from ${formatDate(dateSpecifiedInResult)}`
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
