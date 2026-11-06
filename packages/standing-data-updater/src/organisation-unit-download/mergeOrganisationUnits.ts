import type { OrganisationUnit } from "../types/OrganisationUnit"

const matchingValues = (firstValue: string, secondValue: string): boolean =>
  firstValue.trim().toLowerCase() === secondValue.trim().toLowerCase()

const mergeOrganisationUnits = (newData: OrganisationUnit[], existingData: OrganisationUnit[]): OrganisationUnit[] => {
  newData.forEach((record) => {
    const existingRecord = existingData.find(
      (oldR) =>
        matchingValues(oldR.topLevelCode, record.topLevelCode) &&
        matchingValues(oldR.secondLevelCode, record.secondLevelCode) &&
        matchingValues(oldR.thirdLevelCode, record.thirdLevelCode) &&
        matchingValues(oldR.bottomLevelCode, record.bottomLevelCode)
    )
    if (existingRecord) {
      existingRecord.topLevelName = record.topLevelName || existingRecord.topLevelName
      existingRecord.secondLevelName = record.secondLevelName || existingRecord.secondLevelName
      existingRecord.thirdLevelName = record.thirdLevelName || existingRecord.thirdLevelName
      existingRecord.bottomLevelName = record.bottomLevelName || existingRecord.bottomLevelName
      existingRecord.thirdLevelPsaCode = record.thirdLevelPsaCode || existingRecord.thirdLevelPsaCode
    } else {
      existingData.push(record)
    }
  })

  return existingData
}

export default mergeOrganisationUnits
