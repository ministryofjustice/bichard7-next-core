import type { Trigger } from "../types/Trigger"
import { TriggerCode } from "../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

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
      const containsMainResultCode = offence.Result.some(
        (result) => result.CJSresultCode && mainResultCodes.includes(result.CJSresultCode)
      )
      const containsYroResultCode = offence.Result.some(
        (result) => result.CJSresultCode && yroResultCodes.includes(result.CJSresultCode)
      )
      const containsYroSpeceficRequirementResultCode = offence.Result.some(
        (result) => result.CJSresultCode && yroSpeceficRequirementResultCodes.includes(result.CJSresultCode)
      )

      if (containsMainResultCode || (containsYroResultCode && containsYroSpeceficRequirementResultCode)) {
        acc.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      }

      return acc
    },
    []
  )

export default generator
