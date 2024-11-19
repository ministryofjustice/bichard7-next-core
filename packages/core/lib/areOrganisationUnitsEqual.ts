import type { OrganisationUnitCodes } from "../types/AnnotatedHearingOutcome"

const areOrganisationUnitsEqual = (
  firstOrganisationUnit?: OrganisationUnitCodes | null,
  secondOrganisationUnit?: OrganisationUnitCodes | null
) =>
  (firstOrganisationUnit?.TopLevelCode || undefined) === (secondOrganisationUnit?.TopLevelCode || undefined) &&
  (firstOrganisationUnit?.SecondLevelCode || undefined) === (secondOrganisationUnit?.SecondLevelCode || undefined) &&
  (firstOrganisationUnit?.ThirdLevelCode || undefined) === (secondOrganisationUnit?.ThirdLevelCode || undefined) &&
  (firstOrganisationUnit?.BottomLevelCode || undefined) === (secondOrganisationUnit?.BottomLevelCode || undefined) &&
  (firstOrganisationUnit?.OrganisationUnitCode || undefined) ===
    (secondOrganisationUnit?.OrganisationUnitCode || undefined)

export default areOrganisationUnitsEqual
