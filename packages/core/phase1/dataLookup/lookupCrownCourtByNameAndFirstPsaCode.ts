import { organisationUnit } from "bichard7-next-data-latest"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import { lookupOrganisationUnitByThirdLevelPsaCode } from "./dataLookup"
import extractCodesFromOU from "./extractCodesFromOU"
import matchCourtNames from "./matchCourtNames"

const crownCourtTopLevelCode = "C"

const lookupCrownCourtByNameAndFirstPsaCode = (courtName: string): OrganisationUnitCodes | undefined => {
  const trimmedCourtName = courtName.split("Crown Court")[0].trim()
  const found = organisationUnit.find(
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
