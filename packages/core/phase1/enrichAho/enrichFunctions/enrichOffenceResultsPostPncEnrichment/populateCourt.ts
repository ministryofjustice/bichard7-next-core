import type { AnnotatedHearingOutcome, Result } from "types/AnnotatedHearingOutcome"
import { lookupOrganisationUnitByCode } from "phase1/dataLookup"
import getCourtDetails from "phase1/dataLookup/getCourtDetails"
import populateOrganisationUnitFields from "phase1/lib/organisationUnit/populateOrganisationUnitFields"
import populateSourceOrganisation from "phase1/enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/populateSourceOrganisation"

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
