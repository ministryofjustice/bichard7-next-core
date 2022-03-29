import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import logger from "src/utils/logging"

const populateOrganisationUnitFields = (organisationUnit: OrganisationUnit): OrganisationUnit => {
  const { OrganisationUnitCode, TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode } = organisationUnit
  if (!OrganisationUnitCode) {
    organisationUnit.OrganisationUnitCode = [TopLevelCode, SecondLevelCode, ThirdLevelCode, BottomLevelCode]
      .filter((x) => x)
      .join("")
  } else {
    let offset = 1
    if (OrganisationUnitCode.length > 6) {
      organisationUnit.TopLevelCode = OrganisationUnitCode.substring(0, 1)
      offset = 0
    }
    try {
      organisationUnit.SecondLevelCode = OrganisationUnitCode.substring(1 - offset, 3 - offset)
      organisationUnit.ThirdLevelCode = OrganisationUnitCode.substring(3 - offset, 5 - offset)
      organisationUnit.BottomLevelCode = OrganisationUnitCode.substring(5 - offset, 7 - offset)
    } catch (error) {
      logger.error(error)
    }
  }

  organisationUnit.TopLevelCode = organisationUnit.TopLevelCode?.toUpperCase()
  organisationUnit.SecondLevelCode = organisationUnit.SecondLevelCode?.toUpperCase()
  organisationUnit.ThirdLevelCode = organisationUnit.ThirdLevelCode?.toUpperCase()
  organisationUnit.BottomLevelCode = organisationUnit.BottomLevelCode?.toUpperCase()
  organisationUnit.OrganisationUnitCode = organisationUnit.OrganisationUnitCode?.toUpperCase()

  return organisationUnit
}

export default populateOrganisationUnitFields
