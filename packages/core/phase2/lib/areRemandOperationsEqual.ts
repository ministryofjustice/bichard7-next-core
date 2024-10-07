import type { RemandOperation } from "../../types/PncUpdateDataset"

const areRemandOperationsEqual = (firstRemand: RemandOperation, secondRemand: RemandOperation) => {
  const firstOrganisationUnit = firstRemand.data?.nextHearingLocation
  const secondOrganisationUnit = secondRemand.data?.nextHearingLocation

  return (
    firstRemand.data?.nextHearingDate?.getTime() === secondRemand.data?.nextHearingDate?.getTime() &&
    (firstOrganisationUnit?.TopLevelCode || undefined) === (secondOrganisationUnit?.TopLevelCode || undefined) &&
    (firstOrganisationUnit?.SecondLevelCode || undefined) === (secondOrganisationUnit?.SecondLevelCode || undefined) &&
    (firstOrganisationUnit?.ThirdLevelCode || undefined) === (secondOrganisationUnit?.ThirdLevelCode || undefined) &&
    (firstOrganisationUnit?.BottomLevelCode || undefined) === (secondOrganisationUnit?.BottomLevelCode || undefined) &&
    (firstOrganisationUnit?.OrganisationUnitCode || undefined) ===
      (secondOrganisationUnit?.OrganisationUnitCode || undefined)
  )
}

export default areRemandOperationsEqual
