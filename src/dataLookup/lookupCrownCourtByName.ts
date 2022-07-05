import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"
import extractCodesFromOU from "./extractCodesFromOU"
import matchCourtNames from "./matchCourtNames"

const crownCourtTopLevelCode = "C"

const lookupCrownCourtByName = (courtName: string): OrganisationUnitCodes | undefined => {
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

  return extractCodesFromOU(found)
}

export default lookupCrownCourtByName
