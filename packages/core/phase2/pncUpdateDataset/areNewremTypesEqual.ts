import type { NewremOperation } from "../../types/PncUpdateDataset"

const areNewremTypesEqual = (firstNewrem: NewremOperation, secondNewrem: NewremOperation) => {
  const firstOrganisationUnit = firstNewrem.data?.nextHearingLocation
  const secondOrganisationUnit = secondNewrem.data?.nextHearingLocation

  return (
    firstNewrem.data?.nextHearingDate?.getTime() === secondNewrem.data?.nextHearingDate?.getTime() &&
    (firstOrganisationUnit?.TopLevelCode || undefined) === (secondOrganisationUnit?.TopLevelCode || undefined) &&
    (firstOrganisationUnit?.SecondLevelCode || undefined) === (secondOrganisationUnit?.SecondLevelCode || undefined) &&
    (firstOrganisationUnit?.ThirdLevelCode || undefined) === (secondOrganisationUnit?.ThirdLevelCode || undefined) &&
    (firstOrganisationUnit?.BottomLevelCode || undefined) === (secondOrganisationUnit?.BottomLevelCode || undefined) &&
    (firstOrganisationUnit?.OrganisationUnitCode || undefined) ===
      (secondOrganisationUnit?.OrganisationUnitCode || undefined)
  )
}

export default areNewremTypesEqual
