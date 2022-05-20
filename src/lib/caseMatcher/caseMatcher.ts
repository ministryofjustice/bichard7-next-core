import type { OffenceMatcherOutcome } from "src/lib/offenceMatcher/offenceMatcher"
import { matchOffences } from "src/lib/offenceMatcher/offenceMatcher"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncCase, PncQueryResult } from "src/types/PncQueryResult"
import sortCourtCasesByAge from "./sortCourtCasesByAge"

type CaseMatch = {
  courtCase: PncCase
  offenceMatcherOutcome: OffenceMatcherOutcome
}

type CaseMatcherOutcome = {
  courtCaseMatches: CaseMatch[]
  penaltyCaseMatches: CaseMatch[]
}

const matchCases = (hoOffences: Offence[], pncResponse: PncQueryResult): CaseMatcherOutcome => {
  let nonMatchingExplicitMatch: CaseMatch | undefined = undefined
  const result: CaseMatcherOutcome = {
    courtCaseMatches: [],
    penaltyCaseMatches: []
  }
  const courtCases = pncResponse.cases

  if (!courtCases || courtCases.length === 0) {
    return result
  }

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
            nonMatchingExplicitMatch = { courtCase, offenceMatcherOutcome: matchingOutcome2 }
          }
        }
      }
    }
  })

  if (result.courtCaseMatches.length === 0 && nonMatchingExplicitMatch) {
    result.courtCaseMatches.push(nonMatchingExplicitMatch)
  }
  return result
}

export default matchCases
