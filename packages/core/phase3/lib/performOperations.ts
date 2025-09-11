import type { AnyOperation, Operation, PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import type { PromiseResult, Result } from "@moj-bichard7/common/types/Result"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"

import type PoliceGateway from "../../types/PoliceGateway"
import type PncUpdateRequestGenerator from "../types/PncUpdateRequestGenerator"
import type PoliceUpdateRequest from "../types/PoliceUpdateRequest"

import PncUpdateRequestError from "../types/PncUpdateRequestError"
import disposalUpdatedGenerator from "./pncUpdateRequestGenerators/disposalUpdatedGenerator"
import { normalDisposalGenerator } from "./pncUpdateRequestGenerators/normalDisposalGenerator"
import penaltyHearingGenerator from "./pncUpdateRequestGenerators/penaltyHearingGenerator"
import { remandGenerator } from "./pncUpdateRequestGenerators/remandGenerator"
import sentenceDeferredGenerator from "./pncUpdateRequestGenerators/sentenceDeferredGenerator"
import updatePnc from "./updatePnc"

const pncUpdateRequestGenerator: { [T in PncOperation]: PncUpdateRequestGenerator<T> } = {
  [PncOperation.DISPOSAL_UPDATED]: disposalUpdatedGenerator,
  [PncOperation.NORMAL_DISPOSAL]: normalDisposalGenerator,
  [PncOperation.PENALTY_HEARING]: penaltyHearingGenerator,
  [PncOperation.REMAND]: remandGenerator,
  [PncOperation.SENTENCE_DEFERRED]: sentenceDeferredGenerator
}

const generatePncUpdateRequest = <T extends PncOperation>(
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>
): Result<PoliceUpdateRequest> => {
  const pncUpdateRequest = pncUpdateRequestGenerator[operation.code as T](pncUpdateDataset, operation)
  if (isError(pncUpdateRequest)) {
    const index = pncUpdateDataset.PncOperations.indexOf(operation)
    return new Error(`Operation ${index}: ${pncUpdateRequest.message}`)
  }

  return pncUpdateRequest
}

type OperationWithPncUpdateRequest = { operation: AnyOperation; pncUpdateRequest: PoliceUpdateRequest }

const generatePncUpdateRequests = (
  pncUpdateDataset: PncUpdateDataset
): Result<OperationWithPncUpdateRequest[] | PncUpdateRequestError> => {
  const operationsWithPncUpdateRequest: OperationWithPncUpdateRequest[] = []
  const errors: Error[] = []

  const incompleteOperations = pncUpdateDataset.PncOperations.filter((operation) => operation.status !== "Completed")

  for (const operation of incompleteOperations) {
    const pncUpdateRequest = generatePncUpdateRequest(pncUpdateDataset, operation)

    if (isError(pncUpdateRequest)) {
      errors.push(pncUpdateRequest)
    } else {
      operationsWithPncUpdateRequest.push({ operation, pncUpdateRequest })
    }
  }

  if (errors.length > 0) {
    return new PncUpdateRequestError(errors.map((error) => error.message))
  }

  return operationsWithPncUpdateRequest
}

const performOperations = async (
  pncUpdateDataset: PncUpdateDataset,
  policeGateway: PoliceGateway
): PromiseResult<void> => {
  const pncUpdateRequests = generatePncUpdateRequests(pncUpdateDataset)
  if (isError(pncUpdateRequests)) {
    return pncUpdateRequests
  }

  for (const { operation, pncUpdateRequest } of pncUpdateRequests) {
    const pncUpdateResult = await updatePnc(pncUpdateDataset, pncUpdateRequest, policeGateway)

    if (isError(pncUpdateResult)) {
      operation.status = "Failed"

      return pncUpdateResult
    }

    operation.status = "Completed"
  }
}

export default performOperations
