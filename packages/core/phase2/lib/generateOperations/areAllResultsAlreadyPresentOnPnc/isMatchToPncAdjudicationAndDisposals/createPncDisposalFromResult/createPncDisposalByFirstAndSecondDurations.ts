import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../../types/Exception"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposal from "./createPncDisposal"
import { getDisposalTextFromResult } from "./getDisposalTextFromResult"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"

export const maxDisposalTextLength = 64

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })

const createPncDisposalByFirstAndSecondDurations = (
  result: Result,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<PncDisposal> => {
  const durationCount = result.Duration ? result.Duration.length : 0
  const firstDuration = durationCount > 0 ? result.Duration?.[0] : undefined
  const secondDuration =
    durationCount > 1 ? (result.Duration?.[1].DurationType === "Suspended" ? result.Duration[1] : undefined) : undefined
  const { value: amountInResult, exceptions } = validateAmountSpecifiedInResult(result, offenceIndex, resultIndex, 0)

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
    amountInResult,
    result.ResultQualifierVariable?.map((res) => res.Code),
    validatedDisposalText
  )

  return { value: disposal, exceptions }
}

export default createPncDisposalByFirstAndSecondDurations
