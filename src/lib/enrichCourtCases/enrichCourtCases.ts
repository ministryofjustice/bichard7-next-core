import matchCases from "src/lib/caseMatcher/caseMatcher"
import matchMultipleCases from "src/lib/matchMultipleCases"
import type { OffenceMatcherOutcome } from "src/lib/offenceMatcher/offenceMatcher"
import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCase } from "src/types/PncQueryResult"
import addError from "./addError"
import enrichOffencesFromCourtCasesAndMatcherOutcome from "./enrichOffencesFromCourtCasesAndMatcherOutcome"

const enrichOffencesFromMatcherOutcome = (hoOffences: Offence[], matcherOutcome: OffenceMatcherOutcome) => {
  console.log(hoOffences, matcherOutcome)
}

const enrichCaseTypeFromCourtCase = (hoCase: Case, pncCase: PncCase) => {
  console.log(hoCase, pncCase)
}

const enrichCaseTypeFromPenaltyCase = (hoCase: Case, pncCase: PncCase) => {
  console.log(hoCase, pncCase)
}

const enrichHearingDefendantFromPncResult = (aho: AnnotatedHearingOutcome) => {
  console.log(aho)
}

const matchCourtCases = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  if (!aho.PncQuery) {
    addError(aho, ExceptionCode.HO100304, ["path", "to", "asn"])
    return aho
  }

  let allPncOffencesMatched = false

  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  const pncQueryResult = aho.PncQuery

  const outcome = matchCases(hoOffences, pncQueryResult)

  if (outcome.courtCaseMatches.length > 0 && outcome.penaltyCaseMatches.length > 0) {
    addError(aho, ExceptionCode.HO100328, ["path", "to", "asn"])
    return aho
  }

  if (outcome.penaltyCaseMatches.length > 1) {
    addError(aho, ExceptionCode.HO100329, ["path", "to", "asn"])
    return aho
  }

  if (outcome.courtCaseMatches.length > 1) {
    const hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
    const multipleMatchingOutcome = matchMultipleCases(hoOffences, outcome, hearingDate)
    enrichOffencesFromCourtCasesAndMatcherOutcome(aho, pncQueryResult.cases ?? [], multipleMatchingOutcome)
    allPncOffencesMatched = !multipleMatchingOutcome.unmatchedPNCOffences
  }

  if (outcome.courtCaseMatches.length === 1) {
    const { courtCase, offenceMatcherOutcome } = outcome.courtCaseMatches[0]
    enrichOffencesFromMatcherOutcome(hoOffences, offenceMatcherOutcome)
    allPncOffencesMatched = offenceMatcherOutcome.allPncOffencesMatched

    if (allPncOffencesMatched) {
      enrichCaseTypeFromCourtCase(aho.AnnotatedHearingOutcome.HearingOutcome.Case, courtCase)
    }
  }

  if (outcome.courtCaseMatches.length === 0 && outcome.penaltyCaseMatches.length > 0) {
    const { courtCase, offenceMatcherOutcome } = outcome.penaltyCaseMatches[0]
    enrichOffencesFromMatcherOutcome(hoOffences, offenceMatcherOutcome)
    allPncOffencesMatched = offenceMatcherOutcome.allPncOffencesMatched

    if (allPncOffencesMatched) {
      enrichCaseTypeFromPenaltyCase(aho.AnnotatedHearingOutcome.HearingOutcome.Case, courtCase)
    }
  }

  if (allPncOffencesMatched) {
    enrichHearingDefendantFromPncResult(aho)
  }

  return aho
}

export default matchCourtCases
