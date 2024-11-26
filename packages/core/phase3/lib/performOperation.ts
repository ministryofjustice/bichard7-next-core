import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import dispatch from "./dispatch"
import type PncGatewayInterface from "../../types/PncGatewayInterface"

const performOperation = async (
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation,
  pncGateway: PncGatewayInterface
): PromiseResult<void> => {
  const dispatchResult = await dispatch(pncUpdateDataset, operation, pncGateway).catch((error) => error)

  if (isError(dispatchResult)) {
    operation.status = "Failed"
    return dispatchResult
  }

  operation.status = "Completed"

  // TODO: Implement PNCUpdateProcessor.java:99-106
}

export default performOperation
