import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import areOrganisationUnitsEqual from "../../lib/areOrganisationUnitsEqual"

const areRemandOperationsEqual = (
  firstRemand: Operation<PncOperation.REMAND>,
  secondRemand: Operation<PncOperation.REMAND>
) =>
  firstRemand.data?.nextHearingDate?.getTime() === secondRemand.data?.nextHearingDate?.getTime() &&
  areOrganisationUnitsEqual(firstRemand.data?.nextHearingLocation, secondRemand.data?.nextHearingLocation)

export default areRemandOperationsEqual
