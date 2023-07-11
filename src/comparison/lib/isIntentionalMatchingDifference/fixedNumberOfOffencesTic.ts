import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import { dateReviver } from "src/lib/axiosDateTransformer"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

// Core parses the offences TIC string more accurately so will now add it to the AHO

const extractOffencesTic = (aho: AnnotatedHearingOutcome): (number | undefined)[][] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((o) =>
    o.Result.map((r) => r.NumberOfOffencesTIC)
  )

const normaliseOffencesTic = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const clonedAho = JSON.parse(JSON.stringify(aho), dateReviver) as AnnotatedHearingOutcome
  clonedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((o) =>
    o.Result.forEach((r) => (r.NumberOfOffencesTIC = undefined))
  )
  return clonedAho
}

const fixedNumberOfOffencesTic = (
  expected: CourtResultMatchingSummary | null,
  actual: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    return false
  }

  if (convertAhoToXml(normaliseOffencesTic(expectedAho)) !== convertAhoToXml(normaliseOffencesTic(actualAho))) {
    return false
  }

  const expectedOffencesTic = extractOffencesTic(expectedAho)
  const actualOffencesTic = extractOffencesTic(actualAho)

  return JSON.stringify(expectedOffencesTic) !== JSON.stringify(actualOffencesTic)
}

export default fixedNumberOfOffencesTic
