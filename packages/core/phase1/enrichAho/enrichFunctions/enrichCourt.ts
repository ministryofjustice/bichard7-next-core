import getCourtDetails from "@moj-bichard7/common/aho/dataLookup/getCourtDetails"
import {
  lookupOrganisationUnitByCode,
  lookupOrganisationUnitByThirdLevelPsaCode
} from "@moj-bichard7/common/aho/dataLookup/index"

import type { EnrichAhoFunction } from "../../types/EnrichAhoFunction"

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
      TopLevelCode: organisationUnitData.topLevelCode,
      SecondLevelCode: organisationUnitData.secondLevelCode,
      ThirdLevelCode: organisationUnitData.thirdLevelCode,
      BottomLevelCode: organisationUnitData.bottomLevelCode,
      OrganisationUnitCode: ""
    })
    Hearing.CourtType = courtType
    Hearing.CourtHouseName = courtName
  } else {
    Hearing.CourtType = null
  }

  return hearingOutcome
}

export default enrichCourt
