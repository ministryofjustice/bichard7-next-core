import type { AnnotatedHearingOutcome, Result } from "../../../../types/AnnotatedHearingOutcome"

import { lookupOrganisationUnitByCode } from "../../../../lib/dataLookup"
import getCourtDetails from "../../../../lib/dataLookup/getCourtDetails"
import populateOrganisationUnitFields from "../../../lib/organisationUnit/populateOrganisationUnitFields"
import populateSourceOrganisation from "./populateSourceOrganisation"

const populateCourt = (result: Result, hearingOutcome: AnnotatedHearingOutcome) => {
  populateSourceOrganisation(result, hearingOutcome)

  const { NextHearingDate, SourceOrganisation } = result
  const sourceOrganisationUnitData = lookupOrganisationUnitByCode(SourceOrganisation)
  result.CourtType = sourceOrganisationUnitData
    ? getCourtDetails({
        BottomLevelCode: sourceOrganisationUnitData.bottomLevelCode,
        OrganisationUnitCode: "",
        SecondLevelCode: sourceOrganisationUnitData.secondLevelCode,
        ThirdLevelCode: sourceOrganisationUnitData.thirdLevelCode,
        TopLevelCode: sourceOrganisationUnitData.topLevelCode
      }).courtType
    : undefined

  result.NextCourtType = undefined
  if (result.NextResultSourceOrganisation && result.NextResultSourceOrganisation.OrganisationUnitCode !== null) {
    populateOrganisationUnitFields(result.NextResultSourceOrganisation)

    if (!result.NextResultSourceOrganisation.OrganisationUnitCode && !NextHearingDate) {
      result.NextResultSourceOrganisation = undefined
    } else {
      const nextResultSourceOrganisationUnitData = lookupOrganisationUnitByCode(result.NextResultSourceOrganisation)
      if (nextResultSourceOrganisationUnitData) {
        result.NextCourtType = getCourtDetails({
          BottomLevelCode: nextResultSourceOrganisationUnitData.bottomLevelCode,
          OrganisationUnitCode: "",
          SecondLevelCode: nextResultSourceOrganisationUnitData.secondLevelCode,
          ThirdLevelCode: nextResultSourceOrganisationUnitData.thirdLevelCode,
          TopLevelCode: nextResultSourceOrganisationUnitData.topLevelCode
        }).courtType
      }
    }
  }
}

export default populateCourt
