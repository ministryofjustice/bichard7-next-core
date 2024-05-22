import { lookupDurationUnitByCjsCode } from "../phase1/dataLookup"
import type { Result } from "../types/AnnotatedHearingOutcome"
import disqualifiedFromKeepingDisposalText from "./disqualifiedFromKeepingDisposalText"
import exclusionOrderDisposalText from "./exclusionOrderDisposalText"
import exclusionRequirementsDisposalText from "./exclusionRequirementsDisposalText"
import isFailedToAppearWarrantIssued from "./isFailedToAppearWarrantIssued"
import licencedPremisesExclusionOrderDisposalText from "./licencedPremisesExclusionOrderDisposalText"
import penaltyPointsDisposalText from "./penaltyPointsDisposalText"
import untilFurtherOrderDisposalText from "./untilFurtherOrderDisposalText"

const getDisposalTextFromResult = (result: Result): string => {
  const cjsResultCode = result.CJSresultCode
  const resultVariableText = result.ResultVariableText ? result.ResultVariableText.toUpperCase() : ""

  let disposalText: string = ""
  switch (cjsResultCode) {
    case 3008:
      disposalText = penaltyPointsDisposalText(result)
      break
    case 3025:
      disposalText = disqualifiedFromKeepingDisposalText(result, resultVariableText)
      break
    case 1100:
      disposalText = exclusionOrderDisposalText(resultVariableText)
      break
    case 3041:
      disposalText = licencedPremisesExclusionOrderDisposalText(resultVariableText)
      break
    case 3106:
      disposalText = exclusionRequirementsDisposalText(resultVariableText)
      break
    case 3047:
      disposalText = untilFurtherOrderDisposalText(resultVariableText)
      break
  }

  if (result.ResultQualifierVariable) {
    const qualifiers = result.ResultQualifierVariable.map((qualifier) => qualifier.Code)
    if (isFailedToAppearWarrantIssued(cjsResultCode, qualifiers)) {
      disposalText = "FAILED TO APPEAR WARRANT ISSUED"
    }
  }

  const durations = result.Duration ?? []

  durations.forEach((duration) => {
    if (duration.DurationUnit === "S") {
      const durationLength = duration.DurationLength
      const durationUnit = lookupDurationUnitByCjsCode(duration.DurationUnit)?.description
      if (durationLength > 0) {
        const suffix = `${durationLength} ${durationUnit}`.toUpperCase()
        disposalText = `${disposalText} ${suffix}`.trim()
      }
    }
  })

  return disposalText
}

export default getDisposalTextFromResult
