import type { OrganisationUnitCodes } from "types/AnnotatedHearingOutcome"
import requireStandingData from "phase1/lib/requireStandingData"
import { lookupOrganisationUnitByThirdLevelPsaCode } from "phase1/dataLookup/dataLookup"
import extractCodesFromOU from "phase1/dataLookup/extractCodesFromOU"
import matchCourtNames from "phase1/dataLookup/matchCourtNames"

const crownCourtTopLevelCode = "C"

const lookupCrownCourtByNameAndFirstPsaCode = (courtName: string): OrganisationUnitCodes | undefined => {
  const trimmedCourtName = courtName.split("Crown Court")[0].trim()
  const found = requireStandingData().organisationUnit.find(
    (unit) =>
      unit.topLevelCode.toLowerCase() === crownCourtTopLevelCode.toLowerCase() &&
      unit.thirdLevelName &&
      matchCourtNames((unit.thirdLevelName ?? "").trim(), trimmedCourtName)
  )

  if (!found) {
    return undefined
  }

  const psaCode = found.thirdLevelPsaCode
  const firstResult = lookupOrganisationUnitByThirdLevelPsaCode(psaCode)

  if (!firstResult) {
    return undefined
  }

  return extractCodesFromOU(firstResult)
}

export default lookupCrownCourtByNameAndFirstPsaCode
