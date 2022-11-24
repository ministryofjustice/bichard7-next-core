import matchCases from "../../../enrichAho/enrichFunctions/enrichCourtCases/caseMatcher/caseMatcher"
import matchMultipleCases from "../../../enrichAho/enrichFunctions/enrichCourtCases/matchMultipleCases"
import errorPaths from "../../../lib/errorPaths"
import type { AnnotatedHearingOutcome, Case } from "../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../types/ExceptionCode"
import type { PncCourtCase, PncPenaltyCase } from "../../../types/PncQueryResult"
import addExceptionsToAho from "../../../exceptions/addExceptionsToAho"
import enrichOffencesFromCourtCasesAndMatcherOutcome from "./enrichOffencesFromCourtCasesAndMatcherOutcome"
import enrichOffencesFromMatcherOutcome from "./enrichOffencesFromMatcherOutcome"

const enrichCaseTypeFromCourtCase = (hoCase: Case, pncCase: PncCourtCase) => {
  const cprCourtCaseRef = pncCase.courtCaseReference
  if (cprCourtCaseRef) {
    hoCase.CourtCaseReferenceNumber = cprCourtCaseRef
  }
}

const enrichCaseFromPenaltyCase = (hoCase: Case, pncCase: PncPenaltyCase) => {
  const cprCourtCaseRef = pncCase.penaltyCaseReference
  if (cprCourtCaseRef) {
    hoCase.PenaltyNoticeCaseReferenceNumber = cprCourtCaseRef
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
    addExceptionsToAho(aho, ExceptionCode.HO100328, errorPaths.case.asn)
    return aho
  }

  if (outcome.penaltyCaseMatches.length > 1) {
    addExceptionsToAho(aho, ExceptionCode.HO100329, errorPaths.case.asn)
    return aho
  }

  if (outcome.courtCaseMatches.length > 1) {
    const hearingDate = aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
    // matchMultipleCases can mutate the case matching outcome by removing matches
    // this means that the following if statement (=== 1) can also subsequently run
    const multipleMatchingOutcome = matchMultipleCases(hoOffences, outcome, hearingDate)
    if (outcome.courtCaseMatches.length > 1) {
      enrichOffencesFromCourtCasesAndMatcherOutcome(aho, pncQueryResult.courtCases ?? [], multipleMatchingOutcome)
      allPncOffencesMatched = !multipleMatchingOutcome.unmatchedPNCOffences
    }
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
      const { penaltyCase, offenceMatcherOutcome } = outcome.penaltyCaseMatches[0]
      enrichOffencesFromMatcherOutcome(aho, offenceMatcherOutcome)
      allPncOffencesMatched = offenceMatcherOutcome.allPncOffencesMatched

      if (allPncOffencesMatched) {
        enrichCaseFromPenaltyCase(aho.AnnotatedHearingOutcome.HearingOutcome.Case, penaltyCase)
      }
    } else {
      enrichOffencesFromMatcherOutcome(aho)
    }
  }

  if (allPncOffencesMatched) {
    enrichHearingDefendantFromPncResult(aho)
  } else if (!anyOffenceHasAmbiguousError(aho)) {
    addExceptionsToAho(aho, ExceptionCode.HO100304, errorPaths.case.asn)
  }

  return aho
}

export default matchCourtCases
