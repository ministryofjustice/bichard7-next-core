import type { AnnotatedHearingOutcome, Offence } from "src/types/AnnotatedHearingOutcome"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0025
const validMatches = [
  { offenceCode: "MC80524", resultCode: 4584 },
  { offenceCode: "MC80527", resultCode: 3049 },
  { offenceCode: "MC80528", resultCode: 3049 }
]

const offenceMatches = (offence: Offence, offenceCode: string, resultCode: number) =>
  offence.CriminalProsecutionReference.OffenceReason.OffenceCode.FullCode === offenceCode &&
  offence.Result.some((result) => result.CJSresultCode === resultCode)

const matchingOffenceCodeAndResultCode = (
  hearingOutcome: AnnotatedHearingOutcome,
  offenceCode: string,
  resultCode: number
) =>
  hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((offence) =>
    offenceMatches(offence, offenceCode, resultCode)
  )

const matches = (hearingOutcome: AnnotatedHearingOutcome): boolean =>
  validMatches.some(({ offenceCode, resultCode }) =>
    matchingOffenceCodeAndResultCode(hearingOutcome, offenceCode, resultCode)
  )

const generator: TriggerGenerator = (hearingOutcome, _) => {
  if (matches(hearingOutcome)) {
    return [{ code: triggerCode }]
  }
  return []
}

export default generator
