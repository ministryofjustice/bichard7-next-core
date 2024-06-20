import type { AnnotatedHearingOutcome, Offence, Result } from "../../types/AnnotatedHearingOutcome"

const getResults = (hearingOutcome: AnnotatedHearingOutcome, offence?: Offence): Result[] =>
  offence
    ? offence.Result
    : hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result
    ? [hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Result]
    : []

export default getResults
