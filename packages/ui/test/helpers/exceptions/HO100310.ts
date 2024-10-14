import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { cloneDeep } from "lodash"

export default function (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  offences.splice(1, 2)
  offences.push(cloneDeep(offences[0]))

  offences[1].Result.push(cloneDeep(offences[1].Result[0]))

  offences[1].Result[1].CJSresultCode = 3052

  aho.Exceptions.push({
    code: ExceptionCode.HO100310,
    path: [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "Offence",
      0,
      "CriminalProsecutionReference",
      "OffenceReasonSequence"
    ]
  })

  return aho
}
