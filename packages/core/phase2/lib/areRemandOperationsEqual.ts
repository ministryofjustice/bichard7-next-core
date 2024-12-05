import type { PncOperation } from "../../types/PncOperation"
import type { Operation } from "../../types/PncUpdateDataset"

import areOrganisationUnitsEqual from "../../lib/areOrganisationUnitsEqual"

const areRemandOperationsEqual = (
  firstRemand: Operation<PncOperation.REMAND>,
  secondRemand: Operation<PncOperation.REMAND>
) =>
  firstRemand.data?.nextHearingDate?.getTime() === secondRemand.data?.nextHearingDate?.getTime() &&
  areOrganisationUnitsEqual(firstRemand.data?.nextHearingLocation, secondRemand.data?.nextHearingLocation)

export default areRemandOperationsEqual
