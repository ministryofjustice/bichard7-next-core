import { lookupOrganisationUnitByThirdLevelPsaCode } from "../../../dataLookup"
import populateOrganisationUnitFields from "../../../lib/organisationUnit/populateOrganisationUnitFields"
import type { AnnotatedHearingOutcome, Result } from "../../../types/AnnotatedHearingOutcome"

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
      const { topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode } = organisationUnitData
      result.SourceOrganisation = {
        TopLevelCode: topLevelCode,
        SecondLevelCode: secondLevelCode,
        ThirdLevelCode: thirdLevelCode,
        BottomLevelCode: bottomLevelCode,
        OrganisationUnitCode: [topLevelCode, secondLevelCode, thirdLevelCode, bottomLevelCode].filter((x) => x).join("")
      }
    }
  }

  populateOrganisationUnitFields(result.SourceOrganisation)
}

export default populateSourceOrganisation
