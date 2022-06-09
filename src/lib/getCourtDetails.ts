import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import type OrganisationUnitData from "src/types/OrganisationUnitData"
import { lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT, YOUTH_COURT } from "./properties"

type CourtDetailsResult = {
  courtType: string
  courtName: string
}

const getCourtName = (ouData: OrganisationUnitData): string => {
  const courtRecord = lookupOrganisationUnitByCode({
    TopLevelCode: ouData.topLevelCode,
    SecondLevelCode: ouData.secondLevelCode,
    ThirdLevelCode: ouData.thirdLevelCode,
    BottomLevelCode: ouData.bottomLevelCode
  } as OrganisationUnitCodes)
  return [
    courtRecord?.topLevelName,
    courtRecord?.secondLevelName,
    courtRecord?.thirdLevelName,
    courtRecord?.bottomLevelName
  ]
    .filter((x) => x)
    .join(" ")
}

const getCourtDetails = (organisationUnitData: OrganisationUnitData): CourtDetailsResult => {
  const { topLevelCode } = organisationUnitData
  const courtName = getCourtName(organisationUnitData)

  let courtType: string
  if (topLevelCode === TOP_LEVEL_MAGISTRATES_COURT) {
    courtType = courtName.toUpperCase().includes(YOUTH_COURT) ? MC_YOUTH : MC_ADULT
  } else {
    courtType = CROWN_COURT
  }

  return { courtType, courtName }
}

export default getCourtDetails
