import type { OrganisationUnitCodes } from "../../../types/AnnotatedHearingOutcome"

const safeSubstring = (input: string, start: number, end: number): string | null =>
  input.length >= end ? input.substring(start, end) : null

const populateOrganisationUnitFields = (organisationUnit: OrganisationUnitCodes): OrganisationUnitCodes => {
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

    organisationUnit.SecondLevelCode = safeSubstring(OrganisationUnitCode, 1 - offset, 3 - offset)
    organisationUnit.ThirdLevelCode = safeSubstring(OrganisationUnitCode, 3 - offset, 5 - offset)
    organisationUnit.BottomLevelCode = safeSubstring(OrganisationUnitCode, 5 - offset, 7 - offset)
  }

  organisationUnit.TopLevelCode = organisationUnit.TopLevelCode?.toUpperCase()
  organisationUnit.SecondLevelCode = organisationUnit.SecondLevelCode?.toUpperCase() ?? null
  organisationUnit.ThirdLevelCode = organisationUnit.ThirdLevelCode?.toUpperCase() ?? null
  organisationUnit.BottomLevelCode = organisationUnit.BottomLevelCode?.toUpperCase() ?? null
  organisationUnit.OrganisationUnitCode = organisationUnit.OrganisationUnitCode?.toUpperCase() ?? null

  return organisationUnit
}

export default populateOrganisationUnitFields
