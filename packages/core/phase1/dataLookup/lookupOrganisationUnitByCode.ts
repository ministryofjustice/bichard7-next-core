import type { OrganisationUnit } from "bichard7-next-data-latest/types/types"
import type { OrganisationUnitCodes } from "../../types/AnnotatedHearingOutcome"
import requireStandingData from "../lib/requireStandingData"

const lookupOrganisationUnitByCode = (orgUnit: OrganisationUnitCodes): OrganisationUnit | undefined => {
  if (!orgUnit) {
    return undefined
  }

  const result = requireStandingData().organisationUnit.filter(
    (unit) =>
      unit.topLevelCode.toUpperCase() === (orgUnit.TopLevelCode?.toUpperCase() ?? "") &&
      unit.secondLevelCode.toUpperCase() === orgUnit.SecondLevelCode?.toUpperCase() &&
      unit.thirdLevelCode.toUpperCase() === orgUnit.ThirdLevelCode?.toUpperCase()
  )

  return result.find((unit) => unit.bottomLevelCode === orgUnit.BottomLevelCode) ?? result?.[0]
}

export default lookupOrganisationUnitByCode
