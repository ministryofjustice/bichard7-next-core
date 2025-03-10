import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"

import { lookupOrganisationUnitByCode } from "."

const topLevelMagistratesCourtCode = "B"
const youthCourt = "YOUTH"
const mcYouth = "MCY"
const mcAdult = "MCA"
const crownCourt = "CC"

type CourtDetailsResult = {
  courtName: string
  courtType: string
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
  if (TopLevelCode === topLevelMagistratesCourtCode) {
    courtType = courtName.toUpperCase().includes(youthCourt) ? mcYouth : mcAdult
  } else {
    courtType = crownCourt
  }

  return { courtType, courtName }
}

export default getCourtDetails
