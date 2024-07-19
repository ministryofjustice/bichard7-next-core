import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import getOffenceFullCode from "../getOffenceFullCode"

const triggerCode = TriggerCode.TRPR0025
const validMatches = [
  { offenceCode: "MC80524", resultCode: 4584 },
  { offenceCode: "MC80527", resultCode: 3049 },
  { offenceCode: "MC80528", resultCode: 3049 }
]

const offenceMatches = (offence: Offence, offenceCode: string, resultCode: number) =>
  getOffenceFullCode(offence) === offenceCode && offence.Result.some((result) => result.CJSresultCode === resultCode)

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

const generator: TriggerGenerator = (hearingOutcome) => {
  if (matches(hearingOutcome)) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
