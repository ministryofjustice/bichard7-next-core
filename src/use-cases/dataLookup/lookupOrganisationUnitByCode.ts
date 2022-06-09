import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import type { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/types/types"
import type { OrganisationUnitCodes } from "src/types/AnnotatedHearingOutcome"

const lookupOrganisationUnitByCode = (orgUnit: OrganisationUnitCodes): OrganisationUnit | undefined => {
  if (!orgUnit) {
    return undefined
  }

  const result = organisationUnit.filter(
    (unit) =>
      unit.topLevelCode.toUpperCase() === (orgUnit.TopLevelCode?.toUpperCase() ?? "") &&
      unit.secondLevelCode.toUpperCase() === orgUnit.SecondLevelCode?.toUpperCase() &&
      unit.thirdLevelCode.toUpperCase() === orgUnit.ThirdLevelCode?.toUpperCase()
  )

  return result.find((unit) => unit.bottomLevelCode === orgUnit.BottomLevelCode) ?? result?.[0]
}

export default lookupOrganisationUnitByCode
