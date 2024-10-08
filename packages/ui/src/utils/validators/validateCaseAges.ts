import { DateRange } from "types/CaseListQueryParams"
import { CaseAgeOptions } from "utils/caseAgeOptions"

export const mapCaseAges = (caseAge: string | string[] | undefined): DateRange[] | undefined => {
  if (!caseAge) {
    return undefined
  }

  const allCaseAgeKeys = Object.keys(CaseAgeOptions)
  const validCaseAgeKeys = [caseAge].flat().filter((caseAgeKey) => allCaseAgeKeys.includes(caseAgeKey))
  if (!validCaseAgeKeys.length) {
    return undefined
  }

  return validCaseAgeKeys.map((caseAgeKey) => CaseAgeOptions[caseAgeKey]())
}
