import type { Result } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequest from "./PncUpdateRequest"

type PncUpdateRequestGenerator = (pncUpdateDataset: PncUpdateDataset, operation: Operation) => Result<PncUpdateRequest>

export default PncUpdateRequestGenerator
