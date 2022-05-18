import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncQueryResult } from "src/types/PncQueryResult"

type CaseMatcherOutcome = {
  courtCaseMatches: string[]
  penaltyCaseMatches: string[]
}

const caseMatcher = (hoOffences: Offence[], pncResponse: PncQueryResult): CaseMatcherOutcome => {
  console.log(hoOffences, pncResponse)
  return {
    courtCaseMatches: [],
    penaltyCaseMatches: []
  }
}

export default caseMatcher
