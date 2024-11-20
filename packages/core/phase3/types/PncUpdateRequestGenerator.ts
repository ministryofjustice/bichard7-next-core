import type { Result } from "@moj-bichard7/common/types/Result"

import type { PncOperation } from "../../types/PncOperation"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequest from "./PncUpdateRequest"

type PncUpdateRequestGenerator<T extends PncOperation> = (
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>
) => Result<PncUpdateRequest>

export default PncUpdateRequestGenerator
