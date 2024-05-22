import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"
import createPncDisposal from "../../createPncDisposal"
import getDisposalTextFromResult from "../../getDisposalTextFromResult"
import getFirstDateSpecifiedInResult from "./getFirstDateSpecifiedInResult"
import isDriverDisqualificationResult from "./isDriverDisqualificationResult"
import validateAmountSpecifiedInResult from "./validateAmountSpecifiedInResult"
import validateDisposalText from "./validateDisposalText"

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })

const createPncDisposalByFirstAndSecondDurations = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): PncDisposal => {
  const result =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]

  const durationCount = result.Duration ? result.Duration.length : 0
  const firstDuration = durationCount > 0 ? result.Duration?.[0] : undefined
  const secondDuration =
    durationCount > 1 ? (result.Duration?.[1].DurationType === "Suspended" ? result.Duration[1] : undefined) : undefined
  const firstAmountSpecifiedInResult = validateAmountSpecifiedInResult(aho, offenceIndex, resultIndex, 0)
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

  const validatedDisposalText = result.ResultVariableText
    ? validateDisposalText(disposalText, aho, resultIndex, offenceIndex)
    : disposalText

  return createPncDisposal(
    result.PNCDisposalType,
    firstDuration?.DurationUnit,
    firstDuration?.DurationLength,
    secondDuration?.DurationUnit,
    secondDuration?.DurationLength,
    dateSpecifiedInResult,
    firstAmountSpecifiedInResult,
    result.ResultQualifierVariable?.map((res) => res.Code),
    validatedDisposalText
  )
}

export default createPncDisposalByFirstAndSecondDurations
