import type { PncCourtCase } from "src/types/PncQueryResult"

const getFullYear = (year: string): string => (year >= "70" ? `19${year}` : `20${year}`)

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

  return getFullYear(year) + sequenceNumber
}

// Sorts by age ascending
// i.e. youngest (highest year+sequence) first
const sortCourtCasesByAge = (cases: PncCourtCase[]): PncCourtCase[] => {
  return [...cases].sort((case1: PncCourtCase, case2: PncCourtCase) => {
    const case1SortKey = getCourtCaseSortKey(case1)
    const case2SortKey = getCourtCaseSortKey(case2)
    return case2SortKey.localeCompare(case1SortKey)
  })
}

export default sortCourtCasesByAge
