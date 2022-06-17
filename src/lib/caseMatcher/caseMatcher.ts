import type { OffenceMatcherOutcome } from "src/lib/offenceMatcher/offenceMatcher"
import { matchOffences } from "src/lib/offenceMatcher/offenceMatcher"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncCourtCase, PncPenaltyCase, PncQueryResult } from "src/types/PncQueryResult"
import sortCourtCasesByAge from "./sortCourtCasesByAge"

type CourtCaseMatch = {
  courtCase: PncCourtCase
  offenceMatcherOutcome: OffenceMatcherOutcome
}
type PenaltyCaseMatch = {
  penaltyCase: PncPenaltyCase
  offenceMatcherOutcome: OffenceMatcherOutcome
}

export type CaseMatcherOutcome = {
  courtCaseMatches: CourtCaseMatch[]
  penaltyCaseMatches: PenaltyCaseMatch[]
}

const matchCases = (hoOffences: Offence[], pncResponse: PncQueryResult): CaseMatcherOutcome => {
  let nonMatchingExplicitMatch: CourtCaseMatch | undefined = undefined
  const result: CaseMatcherOutcome = {
    courtCaseMatches: [],
    penaltyCaseMatches: []
  }
  const { courtCases, penaltyCases } = pncResponse

  if (courtCases) {
    const sortedCases = sortCourtCasesByAge(courtCases)

    sortedCases.forEach((courtCase) => {
      const matchingOutcome1 = matchOffences(hoOffences, courtCase.offences, {
        caseReference: courtCase.courtCaseReference,
        attemptManualMatch: true
      })

      if (matchingOutcome1.pncOffencesMatchedIncludingDuplicates.length > 0) {
        result.courtCaseMatches.push({ courtCase, offenceMatcherOutcome: matchingOutcome1 })
      } else {
        if (matchingOutcome1.nonMatchingExplicitMatches.length > 0) {
          if (!nonMatchingExplicitMatch) {
            const matchingOutcome2 = matchOffences(hoOffences, courtCase.offences, {
              caseReference: courtCase.courtCaseReference,
              attemptManualMatch: false
            })
            if (matchingOutcome2.pncOffencesMatchedIncludingDuplicates.length > 0) {
              nonMatchingExplicitMatch = { courtCase, offenceMatcherOutcome: matchingOutcome1 }
            }
          }
        }
      }
    })

    if (result.courtCaseMatches.length === 0 && nonMatchingExplicitMatch) {
      result.courtCaseMatches.push(nonMatchingExplicitMatch)
    }
  } else if (penaltyCases) {
    penaltyCases.forEach((penaltyCase) => {
      const pncOffences = penaltyCase.offences
      const caseReference = penaltyCase.penaltyCaseReference
      const matchingOutcome1 = matchOffences(hoOffences, pncOffences, { caseReference, attemptManualMatch: true })
      if (matchingOutcome1.pncOffencesMatchedIncludingDuplicates.length > 0) {
        result.penaltyCaseMatches.push({ penaltyCase: penaltyCase, offenceMatcherOutcome: matchingOutcome1 })
      } else if (matchingOutcome1.nonMatchingExplicitMatches.length > 0) {
        const matchingOutcome2 = matchOffences(hoOffences, pncOffences, { caseReference, attemptManualMatch: false })
        if (matchingOutcome2.pncOffencesMatchedIncludingDuplicates.length > 0) {
          result.penaltyCaseMatches.push({ penaltyCase: penaltyCase, offenceMatcherOutcome: matchingOutcome1 })
        }
      }
    })
  }

  return result
}

export default matchCases
