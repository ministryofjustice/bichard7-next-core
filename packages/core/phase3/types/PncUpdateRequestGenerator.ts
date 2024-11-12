import type { Result } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"

export type PncUpdateRequest = Record<string, unknown>

type PncUpdateRequestGenerator = (pncUpdateDataset: PncUpdateDataset, operation: Operation) => Result<PncUpdateRequest>

export default PncUpdateRequestGenerator
