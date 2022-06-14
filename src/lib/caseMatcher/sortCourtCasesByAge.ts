import type { PncCourtCase } from "src/types/PncQueryResult"

export const getCourtCaseSortKey = (pncCase: PncCourtCase): string => {
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

const sortCourtCasesByAge = (cases: PncCourtCase[]): PncCourtCase[] => {
  return [...cases].sort((case1: PncCourtCase, case2: PncCourtCase) => {
    const case1SortKey = getCourtCaseSortKey(case1)
    const case2SortKey = getCourtCaseSortKey(case2)
    return case1SortKey.localeCompare(case2SortKey)
  })
}

export default sortCourtCasesByAge
