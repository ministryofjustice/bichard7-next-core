import type { AnnotatedHearingOutcome, Result } from "../../../../types/AnnotatedHearingOutcome"

import { lookupOrganisationUnitByThirdLevelPsaCode } from "../../../../lib/dataLookup"
import populateOrganisationUnitFields from "../../../lib/organisationUnit/populateOrganisationUnitFields"

const populateSourceOrganisation = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  const { CourtHearingLocation, CourtHouseCode } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  if (result.SourceOrganisation) {
    populateOrganisationUnitFields(result.SourceOrganisation)
  }

  if (!result.SourceOrganisation?.OrganisationUnitCode && CourtHearingLocation) {
    result.SourceOrganisation = { ...CourtHearingLocation }
  }

  if (!result.SourceOrganisation && CourtHouseCode) {
    const organisationUnitData = lookupOrganisationUnitByThirdLevelPsaCode(CourtHouseCode)
    if (organisationUnitData) {
      const { bottomLevelCode, secondLevelCode, thirdLevelCode, topLevelCode } = organisationUnitData
      result.SourceOrganisation = {
        BottomLevelCode: bottomLevelCode,
        OrganisationUnitCode: [topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode]
          .filter((x) => x)
          .join(""),
        SecondLevelCode: secondLevelCode,
        ThirdLevelCode: thirdLevelCode,
        TopLevelCode: topLevelCode
      }
    }
  }

  populateOrganisationUnitFields(result.SourceOrganisation)
}

export default populateSourceOrganisation
