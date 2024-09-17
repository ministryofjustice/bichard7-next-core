import { lookupDurationUnitByCjsCode } from "../../../../../../../lib/dataLookup"
import type { Result } from "../../../../../../../types/AnnotatedHearingOutcome"
import disqualifiedFromKeepingDisposalText from "./disqualifiedFromKeepingDisposalText"
import exclusionOrderDisposalText from "./exclusionOrderDisposalText"
import exclusionRequirementsDisposalText from "./exclusionRequirementsDisposalText"
import isFailedToAppearWarrantIssued from "./isFailedToAppearWarrantIssued"
import licencedPremisesExclusionOrderDisposalText from "./licencedPremisesExclusionOrderDisposalText"
import penaltyPointsDisposalText from "./penaltyPointsDisposalText"
import untilFurtherOrderDisposalText from "./untilFurtherOrderDisposalText"

const disposalTextMap: Record<number, (resultVariableText: string) => string> = {
  1100: exclusionOrderDisposalText,
  3025: disqualifiedFromKeepingDisposalText,
  3041: licencedPremisesExclusionOrderDisposalText,
  3047: untilFurtherOrderDisposalText,
  3106: exclusionRequirementsDisposalText
}

const getDisposalTextFromResult = (result: Result): string => {
  const cjsResultCode = result.CJSresultCode
  const resultVariableText = result.ResultVariableText?.toUpperCase() ?? ""
  let disposalText = disposalTextMap[cjsResultCode]?.(resultVariableText) ?? ""

  if (cjsResultCode === 3008) {
    disposalText = penaltyPointsDisposalText(result)
  }

  const qualifiers = result.ResultQualifierVariable.map((qualifier) => qualifier.Code)
  if (isFailedToAppearWarrantIssued(cjsResultCode, qualifiers)) {
    disposalText = "FAILED TO APPEAR WARRANT ISSUED"
  }

  result.Duration?.filter((duration) => duration.DurationUnit === "S" && duration.DurationLength > 0).forEach(
    (duration) => {
      const durationUnit = lookupDurationUnitByCjsCode(duration.DurationUnit)?.description
      const suffix = `${duration.DurationLength} ${durationUnit}`.toUpperCase()
      disposalText = `${disposalText} ${suffix}`.trim()
    }
  )

  return disposalText
}

export default getDisposalTextFromResult
