import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0003
const mainResultCodes = [
  1100, 1177, 1178, 3034, 3041, 3047, 3068, 3078, 3080, 3082, 3106, 3100, 3115, 3121, 3122, 3123, 3124, 3125, 3133,
  3284, 3285, 3288, 4590
]
const yroResultCodes = [1141, 1142, 1143]
const yroSpeceficRequirementResultCodes = [3104, 3105, 3107]

const generator: TriggerGenerator = (hearingOutcome, _) =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (acc: Trigger[], offence) => {
      const containsMainResultCode = offence.Result.some((result) =>
        mainResultCodes.includes(parseInt(result.CJSresultCode, 10))
      )
      const containsYroResultCode = offence.Result.some((result) =>
        yroResultCodes.includes(parseInt(result.CJSresultCode, 10))
      )
      const containsYroSpeceficRequirementResultCode = offence.Result.some((result) =>
        yroSpeceficRequirementResultCodes.includes(parseInt(result.CJSresultCode, 10))
      )

      if (containsMainResultCode || (containsYroResultCode && containsYroSpeceficRequirementResultCode)) {
        acc.push({ code: triggerCode, offenceSequenceNumber: parseInt(offence.CourtOffenceSequenceNumber, 10) })
      }

      return acc
    },
    []
  )

export default generator
