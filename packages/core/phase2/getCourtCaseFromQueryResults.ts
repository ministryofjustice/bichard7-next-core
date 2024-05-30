import type { PncCourtCase, PncQueryResult } from "../types/PncQueryResult"

function getCourtCaseFromQueryResults(
  courtCaseRef: string,
  PncQuery: PncQueryResult | undefined
): PncCourtCase | undefined {
  const cases = PncQuery?.courtCases
  if (!cases) {
    return
  }

  const matchingCase = cases.find((x) => x.courtCaseReference === courtCaseRef)

  return matchingCase
}

export default getCourtCaseFromQueryResults
