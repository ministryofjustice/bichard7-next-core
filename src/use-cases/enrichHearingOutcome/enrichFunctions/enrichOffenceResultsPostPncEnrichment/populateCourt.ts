import getCourtDetails from "src/lib/getCourtDetails"
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import { lookupOrganisationUnitByCode } from "src/use-cases/dataLookup"
import populateSourceOrganisation from "./populateSourceOrganisation"
import populateOrganisationUnitFields from "src/use-cases/populateOrganisationUnitFields"

const populateCourt = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  populateSourceOrganisation(result, hearingOutcome)

  const sourceOrganisationUnitData = lookupOrganisationUnitByCode(result.SourceOrganisation)
  result.CourtType = sourceOrganisationUnitData ? getCourtDetails(sourceOrganisationUnitData).courtType : undefined

  result.NextCourtType = undefined
  if (result.NextResultSourceOrganisation) {
    populateOrganisationUnitFields(result.NextResultSourceOrganisation)

    if (result.NextResultSourceOrganisation.OrganisationUnitCode || result.NextHearingDate) {
      const nextResultSourceOrganisationUnitData = lookupOrganisationUnitByCode(result.NextResultSourceOrganisation)
      if (nextResultSourceOrganisationUnitData) {
        result.NextCourtType = getCourtDetails(nextResultSourceOrganisationUnitData).courtType
      }
    }
  }
}

export default populateCourt
