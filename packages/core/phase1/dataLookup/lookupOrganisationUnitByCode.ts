import { organisationUnit } from "bichard7-next-data-latest"
import type { OrganisationUnit } from "bichard7-next-data-latest/types/types"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"

const topLevelCodeMatches = (unit: OrganisationUnit, orgUnit: OrganisationUnitCodes): boolean => {
  return !orgUnit.TopLevelCode || unit.topLevelCode.toUpperCase() === orgUnit.TopLevelCode?.toUpperCase()
}

const lookupOrganisationUnitByCode = (orgUnit: OrganisationUnitCodes): OrganisationUnit | undefined => {
  if (!orgUnit) {
    return undefined
  }

  const result = organisationUnit.filter(
    (unit) =>
      topLevelCodeMatches(unit, orgUnit) &&
      unit.secondLevelCode.toUpperCase() === orgUnit.SecondLevelCode?.toUpperCase() &&
      unit.thirdLevelCode.toUpperCase() === orgUnit.ThirdLevelCode?.toUpperCase()
  )

  return result.find((unit) => unit.bottomLevelCode === orgUnit.BottomLevelCode) ?? result?.[0]
}

export default lookupOrganisationUnitByCode
