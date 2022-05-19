import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "src/types/PncQueryResult"

type CaseMatcherOutcome = {
  courtCaseMatches: string[]
  penaltyCaseMatches: string[]
}

const matchCases = (hoOffences: Offence[], pncResponse: PncQueryResult): CaseMatcherOutcome => {
  const result = {
    courtCaseMatches: [],
    penaltyCaseMatches: []
  }
  const courtCases = pncResponse.cases

  if (courtCases && courtCases.length > 0) {
  }

  console.log(hoOffences, pncResponse)
  return result
}

export default matchCases
