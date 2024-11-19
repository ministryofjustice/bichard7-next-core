import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import dispatch from "./dispatch"
import handleError from "./handleError"
import type PncGatewayInterface from "../../types/PncGatewayInterface"

const performOperation = async (
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation,
  pncGateway: PncGatewayInterface
): PromiseResult<void> => {
  const dispatchResult = await dispatch(pncUpdateDataset, operation, pncGateway).catch((error) => error)

  if (isError(dispatchResult)) {
    handleError(pncUpdateDataset, operation, dispatchResult)
    return
  }

  // TODO: Implement PNCUpdateProcessor.java:99-106
}

export default performOperation
