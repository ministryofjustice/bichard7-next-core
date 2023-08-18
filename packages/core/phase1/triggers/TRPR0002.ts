import { TriggerCode } from "core/common/types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0002
const resultCodes = [4575, 4576, 4577, 4585, 4586]
const resultQualifier = "EO"

const generator: TriggerGenerator = (hearingOutcome) => {
  const shouldRaiseTrigger = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (offence) =>
      offence.Result.some(
        (result) =>
          result.CJSresultCode &&
          resultCodes.includes(result.CJSresultCode) &&
          !result.ResultQualifierVariable.some((qual) => qual.Code === resultQualifier)
      )
  )

  if (shouldRaiseTrigger) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
