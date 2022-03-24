import { CROWN_COURT, MC_ADULT, MC_YOUTH, TOP_LEVEL_MAGISTRATES_COURT, YOUTH_COURT } from "src/lib/properties"
import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type { EnrichAhoFunction } from "src/types/EnrichAhoFunction"
import { lookupOrganisationUnitByCode, lookupOrganisationUnitByThirdLevelPsaCode } from "src/use-cases/dataLookup"
import logger from "src/utils/logging"

const populateOrganisation = (organisationUnit: OrganisationUnit): OrganisationUnit => {
  const { OrganisationUnitCode, TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode } = organisationUnit
  if (!OrganisationUnitCode) {
    organisationUnit.OrganisationUnitCode = [TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode]
      .filter((x) => x)
      .join()
  } else {
    let offset = 1
    if (OrganisationUnitCode.length > 6) {
      organisationUnit.TopLevelCode = OrganisationUnitCode.substring(0, 1)
      offset = 0
    }
    try {
      organisationUnit.SecondLevelCode = OrganisationUnitCode.substring(1 - offset, 3 - offset)
      organisationUnit.ThirdLevelCode = OrganisationUnitCode.substring(3 - offset, 5 - offset)
      organisationUnit.BottomLevelCode = OrganisationUnitCode.substring(5 - offset, 7 - offset)
    } catch (error) {
      logger.error(error)
    }
  }

  organisationUnit.TopLevelCode = organisationUnit.TopLevelCode?.toUpperCase()
  organisationUnit.SecondLevelCode = organisationUnit.SecondLevelCode?.toUpperCase()
  organisationUnit.ThirdLevelCode = organisationUnit.ThirdLevelCode?.toUpperCase()
  organisationUnit.BottomLevelCode = organisationUnit.BottomLevelCode?.toUpperCase()
  organisationUnit.OrganisationUnitCode = organisationUnit.OrganisationUnitCode?.toUpperCase()

  return organisationUnit
}

const enrichCourt: EnrichAhoFunction = (hearingOutcome) => {
  let { CourtHearingLocation } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing
  const { Hearing } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome

  let organisationUnitData
  if (CourtHearingLocation) {
    CourtHearingLocation = populateOrganisation(CourtHearingLocation)
    organisationUnitData = lookupOrganisationUnitByCode(CourtHearingLocation)
  }

  if (!organisationUnitData && Hearing.CourtHouseCode) {
    organisationUnitData = lookupOrganisationUnitByThirdLevelPsaCode(Hearing.CourtHouseCode)
  }

  if (organisationUnitData) {
    const { topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode } = organisationUnitData
    const courtName = [topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode].filter((x) => x).join(" ")

    if (topLevelCode === TOP_LEVEL_MAGISTRATES_COURT) {
      Hearing.CourtType = courtName.toUpperCase().includes(YOUTH_COURT) ? MC_YOUTH : MC_ADULT
    } else {
      Hearing.CourtType = CROWN_COURT
    }

    Hearing.CourtHouseName = courtName
  }

  return hearingOutcome
}

export default enrichCourt
