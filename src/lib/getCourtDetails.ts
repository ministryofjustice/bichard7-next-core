import type OrganisationUnitData from "src/types/OrganisationUnitData"
import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT, YOUTH_COURT } from "./properties"

type CourtDetailsResult = {
  courtType: string
  courtName: string
}

const getCourtDetails = (organisationUnitData: OrganisationUnitData): CourtDetailsResult => {
  const { topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode } = organisationUnitData
  const courtName = [topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode].filter((x) => x).join(" ")

  let courtType: string
  if (topLevelCode === TOP_LEVEL_MAGISTRATES_COURT) {
    courtType = courtName.toUpperCase().includes(YOUTH_COURT) ? MC_YOUTH : MC_ADULT
  } else {
    courtType = CROWN_COURT
  }

  return { courtType, courtName }
}

export default getCourtDetails
