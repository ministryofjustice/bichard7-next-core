import getCourtDetails from "src/lib/getCourtDetails"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import { lookupOrganisationUnitByCode, lookupOrganisationUnitByThirdLevelPsaCode } from "src/use-cases/dataLookup"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"

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
    const { courtName, courtType } = getCourtDetails(organisationUnitData)
    Hearing.CourtType = courtType
    Hearing.CourtHouseName = courtName
  }

  return hearingOutcome
}

export default enrichCourt
