import matchCases from "src/lib/caseMatcher/caseMatcher"
import matchMultipleCases from "src/lib/matchMultipleCases"
import type { AnnotatedHearingOutcome, Case } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCase } from "src/types/PncQueryResult"
import addError from "./addError"
import enrichOffencesFromCourtCasesAndMatcherOutcome from "./enrichOffencesFromCourtCasesAndMatcherOutcome"
import enrichOffencesFromMatcherOutcome from "./enrichOffencesFromMatcherOutcome"

const enrichCaseTypeFromCourtCase = (hoCase: Case, pncCase: PncCase) => {
  const cprCourtCaseRef = pncCase.courtCaseReference
  if (cprCourtCaseRef) {
    hoCase.CourtCaseReferenceNumber = cprCourtCaseRef
  }
}

const enrichCaseTypeFromPenaltyCase = (hoCase: Case, pncCase: PncCase) => {
  // TODO: This needs updating to actually use penalty cases once they are implemented
  const cprCourtCaseRef = pncCase.courtCaseReference
  if (cprCourtCaseRef) {
    hoCase.CourtCaseReferenceNumber = cprCourtCaseRef
  }
}

const enrichHearingDefendantFromPncResult = (aho: AnnotatedHearingOutcome) => {
  const defendant = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  // Set HO PNCCheckname
  defendant.PNCCheckname = aho.PncQuery?.checkName
  // Set HO CRONumber if IDS.CRONumber is present
  defendant.CRONumber = aho.PncQuery?.croNumber
  // Set HO PNCIdentifier if IDS.PNCID is present
  defendant.PNCIdentifier = aho.PncQuery?.pncId
}

const anyOffenceHasAmbiguousError = (aho: AnnotatedHearingOutcome): boolean =>
  !!aho.Exceptions?.some((exception) => exception.code === ExceptionCode.HO100332)

const matchCourtCases = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  if (!aho.PncQuery) {
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
    enrichOffencesFromMatcherOutcome(aho, offenceMatcherOutcome)
    allPncOffencesMatched = offenceMatcherOutcome.allPncOffencesMatched

    if (allPncOffencesMatched) {
      enrichCaseTypeFromCourtCase(aho.AnnotatedHearingOutcome.HearingOutcome.Case, courtCase)
    }
  }

  if (outcome.courtCaseMatches.length === 0) {
    if (outcome.penaltyCaseMatches.length > 0) {
      const { courtCase, offenceMatcherOutcome } = outcome.penaltyCaseMatches[0]
      enrichOffencesFromMatcherOutcome(aho, offenceMatcherOutcome)
      allPncOffencesMatched = offenceMatcherOutcome.allPncOffencesMatched

      if (allPncOffencesMatched) {
        enrichCaseTypeFromPenaltyCase(aho.AnnotatedHearingOutcome.HearingOutcome.Case, courtCase)
      }
    } else {
      enrichOffencesFromMatcherOutcome(aho)
    }
  }

  if (allPncOffencesMatched) {
    enrichHearingDefendantFromPncResult(aho)
  } else if (!anyOffenceHasAmbiguousError(aho)) {
    addError(aho, ExceptionCode.HO100304, [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "ArrestSummonsNumber"
    ])
  }

  return aho
}

export default matchCourtCases
