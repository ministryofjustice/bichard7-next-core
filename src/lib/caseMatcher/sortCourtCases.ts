import type { PncCase } from "src/types/PncQueryResult"

export const getCourtCaseSortKey = (pncCase: PncCase): string => {
  if (!pncCase.courtCaseReference) {
    return ""
  }

  const referenceParts = pncCase.courtCaseReference.split("/")

  if (referenceParts.length !== 3) {
    return ""
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [year, _, sequenceNumber] = referenceParts

  return year + sequenceNumber
}

export const sortCourtCasesByAge = (cases: PncCase[]): PncCase[] => {
  return cases.sort((case1: PncCase, case2: PncCase) => {
    const case1SortKey = getCourtCaseSortKey(case1)
    const case2SortKey = getCourtCaseSortKey(case2)
    return case1SortKey.localeCompare(case2SortKey)
  })
}
