import { lookupOrganisationUnitByCode } from "src/dataLookup"
import getCourtDetails from "src/dataLookup/getCourtDetails"
import populateOrganisationUnitFields from "src/lib/organisationUnit/populateOrganisationUnitFields"
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import populateSourceOrganisation from "./populateSourceOrganisation"

const populateCourt = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  populateSourceOrganisation(result, hearingOutcome)

  const { SourceOrganisation, NextHearingDate } = result
  const sourceOrganisationUnitData = lookupOrganisationUnitByCode(SourceOrganisation)
  result.CourtType = sourceOrganisationUnitData
    ? getCourtDetails({
        TopLevelCode: sourceOrganisationUnitData.topLevelCode,
        SecondLevelCode: sourceOrganisationUnitData.secondLevelCode,
        ThirdLevelCode: sourceOrganisationUnitData.thirdLevelCode,
        BottomLevelCode: sourceOrganisationUnitData.bottomLevelCode,
        OrganisationUnitCode: ""
      }).courtType
    : undefined

  result.NextCourtType = undefined
  if (result.NextResultSourceOrganisation) {
    populateOrganisationUnitFields(result.NextResultSourceOrganisation)

    if (!result.NextResultSourceOrganisation.OrganisationUnitCode && !NextHearingDate) {
      result.NextResultSourceOrganisation = undefined
    } else {
      const nextResultSourceOrganisationUnitData = lookupOrganisationUnitByCode(result.NextResultSourceOrganisation)
      if (nextResultSourceOrganisationUnitData) {
        result.NextCourtType = getCourtDetails({
          TopLevelCode: nextResultSourceOrganisationUnitData.topLevelCode,
          SecondLevelCode: nextResultSourceOrganisationUnitData.secondLevelCode,
          ThirdLevelCode: nextResultSourceOrganisationUnitData.thirdLevelCode,
          BottomLevelCode: nextResultSourceOrganisationUnitData.bottomLevelCode,
          OrganisationUnitCode: ""
        }).courtType
      }
    }
  }
}

export default populateCourt
