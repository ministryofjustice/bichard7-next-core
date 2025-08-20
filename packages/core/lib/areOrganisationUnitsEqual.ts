import type { OrganisationUnitCodes } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

const areOrganisationUnitsEqual = (
  firstOrganisationUnit?: null | OrganisationUnitCodes,
  secondOrganisationUnit?: null | OrganisationUnitCodes
) =>
  (firstOrganisationUnit?.TopLevelCode || undefined) === (secondOrganisationUnit?.TopLevelCode || undefined) &&
  (firstOrganisationUnit?.SecondLevelCode || undefined) === (secondOrganisationUnit?.SecondLevelCode || undefined) &&
  (firstOrganisationUnit?.ThirdLevelCode || undefined) === (secondOrganisationUnit?.ThirdLevelCode || undefined) &&
  (firstOrganisationUnit?.BottomLevelCode || undefined) === (secondOrganisationUnit?.BottomLevelCode || undefined) &&
  (firstOrganisationUnit?.OrganisationUnitCode || undefined) ===
    (secondOrganisationUnit?.OrganisationUnitCode || undefined)

export default areOrganisationUnitsEqual
