import type { PromiseResult, Result } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequest from "../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../types/PncUpdateRequestGenerator"

import { PncOperation } from "../../types/PncOperation"
import generatePncUpdateExceptionFromMessage, {
  isPncLockError
} from "../exceptions/generatePncUpdateExceptionFromMessage"
import PncUpdateRequestError from "../types/PncUpdateRequestError"
import disposalUpdatedGenerator from "./pncUpdateRequestGenerators/disposalUpdatedGenerator"
import { normalDisposalGenerator } from "./pncUpdateRequestGenerators/normalDisposalGenerator"
import penaltyHearingGenerator from "./pncUpdateRequestGenerators/penaltyHearingGenerator"
import { remandGenerator } from "./pncUpdateRequestGenerators/remandGenerator"
import sentenceDeferredGenerator from "./pncUpdateRequestGenerators/sentenceDeferredGenerator"

export const MAXIMUM_PNC_LOCK_ERROR_RETRIES = 3
const DELAY_FOR_PNC_LOCK_ERROR_RETRY = parseInt(process.env.DELAY_FOR_PNC_LOCK_ERROR_RETRY ?? "10000")

const delayForPncLockErrorRetry = () => new Promise((resolve) => setTimeout(resolve, DELAY_FOR_PNC_LOCK_ERROR_RETRY))

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
): Result<PncUpdateRequest> => {
  const pncUpdateRequest = pncUpdateRequestGenerator[operation.code as T](pncUpdateDataset, operation)
  if (isError(pncUpdateRequest)) {
    const index = pncUpdateDataset.PncOperations.indexOf(operation)
    return new Error(`Operation ${index}: ${pncUpdateRequest.message}`)
  }

  return pncUpdateRequest
}

const updatePnc = async (
  pncUpdateDataset: PncUpdateDataset,
  pncUpdateRequest: PncUpdateRequest,
  pncGateway: PncGatewayInterface
) => {
  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID

  for (let pncLockErrorRetries = 0; pncLockErrorRetries < MAXIMUM_PNC_LOCK_ERROR_RETRIES; pncLockErrorRetries++) {
    const pncUpdateResult = await pncGateway.update(pncUpdateRequest, correlationId)

    if (isError(pncUpdateResult)) {
      const pncExceptions = pncUpdateResult.messages.map(generatePncUpdateExceptionFromMessage)

      if (pncExceptions.some(isPncLockError) && pncLockErrorRetries !== MAXIMUM_PNC_LOCK_ERROR_RETRIES - 1) {
        await delayForPncLockErrorRetry()
      } else {
        pncUpdateDataset.Exceptions.push(...pncExceptions)

        return pncUpdateResult
      }
    } else {
      return pncUpdateResult
    }
  }
}

const performOperations = async (
  pncUpdateDataset: PncUpdateDataset,
  pncGateway: PncGatewayInterface
): PromiseResult<void> => {
  const incompleteOperations = pncUpdateDataset.PncOperations.filter((operation) => operation.status !== "Completed")

  const pncUpdateRequests = incompleteOperations.map((operation) =>
    generatePncUpdateRequest(pncUpdateDataset, operation)
  )
  const pncUpdateRequestErrors = pncUpdateRequests.filter((pncUpdateRequest) => isError(pncUpdateRequest))
  if (pncUpdateRequestErrors.length > 0) {
    return new PncUpdateRequestError(pncUpdateRequestErrors.map((error) => error.message))
  }

  for (const [index, pncUpdateRequest] of (pncUpdateRequests as PncUpdateRequest[]).entries()) {
    const operation = incompleteOperations[index]

    const pncUpdateResult = await updatePnc(pncUpdateDataset, pncUpdateRequest, pncGateway)

    if (isError(pncUpdateResult)) {
      operation.status = "Failed"

      return pncUpdateResult
    }

    operation.status = "Completed"
  }
}

export default performOperations
