import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import { CROWN_COURT_TOP_LEVEL_CODE } from "src/lib/properties"

const matchCourtNamesRegex = (courtNameA: string, courtNameB: string): boolean => {
  const notAlphabetic = /[^\\p{L}]+/i
  const courtNameARegex = new RegExp(`^${courtNameA.split(notAlphabetic).join("[^\\p{L}]*")}\b`, "i")
  return courtNameARegex.test(courtNameB)
}

const matchCourtNames = (courtNameA: string, courtNameB: string): boolean =>
  !!courtNameA &&
  !!courtNameB &&
  (matchCourtNamesRegex(courtNameA, courtNameB) || matchCourtNamesRegex(courtNameB, courtNameA))

export default (courtName: string): string | undefined => {
  const trimmedCourtName = courtName.split(/\s*Crown Court\z/)[0].trim()
  return organisationUnit.find(
    (unit) =>
      unit.topLevelCode.toLowerCase() === CROWN_COURT_TOP_LEVEL_CODE.toLowerCase() &&
      matchCourtNames(unit.thirdLevelName.trim(), trimmedCourtName)
  )?.thirdLevelPsaCode
}
