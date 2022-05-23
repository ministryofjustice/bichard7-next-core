import type { AnnotatedHearingOutcome, Case, Offence } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import type { PncCase } from "src/types/PncQueryResult"
import matchCases from "./caseMatcher/caseMatcher"
import type { MultipleCaseMatcherOutcome } from "./matchMultipleCases"
import matchMultipleCases from "./matchMultipleCases"
import type { OffenceMatcherOutcome } from "./offenceMatcher/offenceMatcher"

const nonRecordableOffenceCategories = [
  "B7",
  "EF",
  "EM",
  "EX",
  "FC",
  "FL",
  "FO",
  "FP",
  "FV",
  "LB",
  "LC",
  "LG",
  "LL",
  "LM",
  "VA",
  "VP"
]

const offenceCategoryIsNonRecordable = (offence: Offence): boolean =>
  !!offence.OffenceCategory && nonRecordableOffenceCategories.includes(offence.OffenceCategory)

const getFirstMatchingCourtCaseWith2060Result = (
  pncCases: PncCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
): string | undefined => {
  for (const pncCase of pncCases) {
    for (const pncOffence of pncCase.offences) {
      for (const matchedOffence of matcherOutcome.matchedOffences.keys()) {
        if (matcherOutcome.matchedOffences.get(matchedOffence) === pncOffence) {
          for (const result of matchedOffence.Result) {
            if (result.CJSresultCode === 2060) {
              return pncCase.courtCaseReference
            }
          }
        }
      }
    }
  }
}

const enrichOffencesFromCourtCasesAndMatcherOutcome = (
  aho: AnnotatedHearingOutcome,
  cases: PncCase[],
  matcherOutcome: MultipleCaseMatcherOutcome
) => {
  const hoOffences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
  let matchingCCR: string

  hoOffences.forEach((hoOffence) => {
    let offenceHasError = false

    const pncOffence = matcherOutcome.matchedOffences.get(hoOffence)

    if (!pncOffence) {
      const duplicateCases = matcherOutcome.duplicateHoOffences.get(hoOffence)
      if (duplicateCases && duplicateCases.length === 1) {
        addError(aho, ExceptionCode.HO100310, ["path", "to", "duplicate"])
        offenceHasError = true
      } else if (
        matcherOutcome.ambiguousHoOffences.includes(hoOffence) ||
        (duplicateCases && duplicateCases.length > 1)
      ) {
        addError(aho, ExceptionCode.HO100332, ["path", "to", "duplicate"])
        offenceHasError = true
      } else if (!duplicateCases) {
        if (offenceCategoryIsNonRecordable(hoOffence)) {
          const courtCase = cases[0]
          const courtCaseRef = courtCase.courtCaseReference
          hoOffence.CourtCaseReferenceNumber = courtCaseRef
          hoOffence.AddedByTheCourt = true
          hoOffence.CriminalProsecutionReference.OffenceReasonSequence = undefined
        } else {
          if (!matchingCCR) {
            // TODO
            // matchingCCR =
          }
        }
      }
    }
  })
}

const enrichOffencesFromMatcherOutcome = (hoOffences: Offence[], matcherOutcome: OffenceMatcherOutcome) => {}

const enrichCaseTypeFromCourtCase = (hoCase: Case, pncCase: PncCase) => {
  console.log(hoCase, pncCase)
}

const enrichCaseTypeFromPenaltyCase = (hoCase: Case, pncCase: PncCase) => {
  console.log(hoCase, pncCase)
}

const enrichHearingDefendantFromPncResult = (aho: AnnotatedHearingOutcome) => {
  console.log(aho)
}

const addError = (aho: AnnotatedHearingOutcome, code: ExceptionCode, path: string[]) =>
  aho.Exceptions?.push({ code, path })

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
