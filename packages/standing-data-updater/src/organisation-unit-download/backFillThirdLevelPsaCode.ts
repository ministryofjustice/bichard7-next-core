import type { OrganisationUnit } from "../types/OrganisationUnit"

const matchingValues = (firstValue: string, secondValue: string): boolean =>
  firstValue.trim().toLowerCase() === secondValue.trim().toLowerCase()

export const backFillThirdLevelPsaCode = (
  newData: OrganisationUnit[],
  oldData: OrganisationUnit[]
): OrganisationUnit[] => {
  const matchNotFoundForRecords: OrganisationUnit[] = []

  newData.forEach((record) => {
    const match = oldData.find(
      (oldRecord) =>
        matchingValues(oldRecord.topLevelCode, record.topLevelCode) &&
        matchingValues(oldRecord.secondLevelCode, record.secondLevelCode) &&
        matchingValues(oldRecord.thirdLevelCode, record.thirdLevelCode) &&
        matchingValues(oldRecord.bottomLevelCode, record.bottomLevelCode)
    )
    if (match) {
      record.thirdLevelPsaCode = match.thirdLevelPsaCode
    } else {
      matchNotFoundForRecords.push(record)
    }
  })

  if (matchNotFoundForRecords.length > 0) {
    throw new Error(`Missing thirdLevelPsaCode for record(s): ${JSON.stringify(matchNotFoundForRecords, null, 2)}`)
  }

  return newData
}
