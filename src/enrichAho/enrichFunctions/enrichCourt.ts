import { lookupOrganisationUnitByCode, lookupOrganisationUnitByThirdLevelPsaCode } from "src/dataLookup"
import getCourtDetails from "src/dataLookup/getCourtDetails"
import populateOrganisationUnitFields from "src/lib/organisationUnit/populateOrganisationUnitFields"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"

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
  }

  return hearingOutcome
}

export default enrichCourt
