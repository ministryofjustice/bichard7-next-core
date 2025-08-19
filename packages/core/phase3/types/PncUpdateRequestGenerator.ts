import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import type { Operation, PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import type { Result } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequest from "./PncUpdateRequest"

type PncUpdateRequestGenerator<T extends PncOperation> = (
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>
) => Result<PncUpdateRequest>

export default PncUpdateRequestGenerator
