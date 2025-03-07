import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { Trigger } from "../../types/Trigger"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0003
const mainResultCodes = [
  1100, 1177, 1178, 3034, 3041, 3047, 3068, 3078, 3080, 3082, 3106, 3100, 3115, 3121, 3122, 3123, 3124, 3125, 3133,
  3284, 3285, 3288, 4590, 3324, 3326
]
const yroResultCodes = [1141, 1142, 1143]
const yroSpecificRequirementResultCodes = [3104, 3105, 3107]

const generator: TriggerGenerator = (hearingOutcome) =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (triggers: Trigger[], offence) => {
      const containsMainResultCode = offence.Result.some(
        (result) => result.CJSresultCode && mainResultCodes.includes(result.CJSresultCode)
      )
      const containsYroResultCode = offence.Result.some(
        (result) => result.CJSresultCode && yroResultCodes.includes(result.CJSresultCode)
      )
      const containsYroSpecificRequirementResultCode = offence.Result.some(
        (result) => result.CJSresultCode && yroSpecificRequirementResultCodes.includes(result.CJSresultCode)
      )

      if (containsMainResultCode || (containsYroResultCode && containsYroSpecificRequirementResultCode)) {
        triggers.push({ code: triggerCode, offenceSequenceNumber: offence.CourtOffenceSequenceNumber })
      }

      return triggers
    },
    []
  )

export default generator
