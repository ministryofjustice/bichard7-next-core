import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncOperation } from "../../types/PncOperation"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequest from "../types/PncUpdateRequest"

import generatePncUpdateExceptionFromMessage from "../exceptions/generatePncUpdateExceptionFromMessage"

const performOperation = async <T extends PncOperation>(
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>,
  pncUpdateRequest: PncUpdateRequest,
  pncGateway: PncGatewayInterface
): PromiseResult<void> => {
  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const pncUpdateResult = await pncGateway.update(pncUpdateRequest, correlationId)

  if (isError(pncUpdateResult)) {
    for (const message of pncUpdateResult.messages) {
      pncUpdateDataset.Exceptions.push(generatePncUpdateExceptionFromMessage(message))
    }

    operation.status = "Failed"

    return pncUpdateResult
  }

  operation.status = "Completed"
}

export default performOperation
