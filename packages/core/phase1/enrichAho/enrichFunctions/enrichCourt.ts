import type { EnrichAhoFunction } from "../../types/EnrichAhoFunction"

import { lookupOrganisationUnitByCode, lookupOrganisationUnitByThirdLevelPsaCode } from "../../../lib/dataLookup"
import getCourtDetails from "../../../lib/dataLookup/getCourtDetails"
import populateOrganisationUnitFields from "../../lib/organisationUnit/populateOrganisationUnitFields"

const enrichCourt: EnrichAhoFunction = (hearingOutcome) => {
  let { CourtHearingLocation } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const { Hearing } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome

  let organisationUnitData
  if (CourtHearingLocation) {
    CourtHearingLocation = populateOrganisationUnitFields(CourtHearingLocation)
    organisationUnitData = lookupOrganisationUnitByCode(CourtHearingLocation)
  }

  if (!organisationUnitData && Hearing.CourtHouseCode) {
    organisationUnitData = lookupOrganisationUnitByThirdLevelPsaCode(Hearing.CourtHouseCode)
  }

  if (organisationUnitData) {
    const { courtName, courtType } = getCourtDetails({
      BottomLevelCode: organisationUnitData.bottomLevelCode,
      OrganisationUnitCode: "",
      SecondLevelCode: organisationUnitData.secondLevelCode,
      ThirdLevelCode: organisationUnitData.thirdLevelCode,
      TopLevelCode: organisationUnitData.topLevelCode
    })
    Hearing.CourtType = courtType
    Hearing.CourtHouseName = courtName
  } else {
    Hearing.CourtType = null
  }

  return hearingOutcome
}

export default enrichCourt
