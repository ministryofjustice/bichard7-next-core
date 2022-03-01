import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0002
const resultCodes = [4575, 4576, 4577, 4585, 4586]
const resultQualifier = "EO"

const generator: TriggerGenerator = (hearingOutcome, _) => {
  const shouldRaiseTrigger = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (offence) =>
      offence.Result.some(
        (result) =>
          resultCodes.includes(parseInt(result.CJSresultCode, 10)) &&
          !result.ResultQualifierVariable.some((qual) => qual.Code === resultQualifier)
      )
  )

  if (shouldRaiseTrigger) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
