import { lookupOrganisationUnitByCode } from "src/dataLookup"
import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT, YOUTH_COURT } from "src/lib/properties"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"

type CourtDetailsResult = {
  courtType: string
  courtName: string
}

const getCourtName = (ouData: OrganisationUnitCodes): string => {
  const courtRecord = lookupOrganisationUnitByCode({
    TopLevelCode: ouData.TopLevelCode,
    SecondLevelCode: ouData.SecondLevelCode,
    ThirdLevelCode: ouData.ThirdLevelCode,
    BottomLevelCode: ouData.BottomLevelCode
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

const getCourtDetails = (organisationUnitData: OrganisationUnitCodes): CourtDetailsResult => {
  const { TopLevelCode } = organisationUnitData
  const courtName = getCourtName(organisationUnitData)

  let courtType: string
  if (TopLevelCode === TOP_LEVEL_MAGISTRATES_COURT) {
    courtType = courtName.toUpperCase().includes(YOUTH_COURT) ? MC_YOUTH : MC_ADULT
  } else {
    courtType = CROWN_COURT
  }

  return { courtType, courtName }
}

export default getCourtDetails
