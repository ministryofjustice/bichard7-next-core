import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { PncApiError } from "../../lib/PncGateway"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import type PncUpdateRequestGenerator from "../types/PncUpdateRequestGenerator"

import { PncOperation } from "../../types/PncOperation"
import generatePncUpdateExceptionFromMessage from "../exceptions/generatePncUpdateExceptionFromMessage"
import disposalUpdatedGenerator from "./pncUpdateRequestGenerators/disposalUpdatedGenerator"
import normalDisposalGenerator from "./pncUpdateRequestGenerators/normalDisposalGenerator"
import penaltyHearingGenerator from "./pncUpdateRequestGenerators/penaltyHearingGenerator"
import remandGenerator from "./pncUpdateRequestGenerators/remandGenerator"
import sentenceDeferredGenerator from "./pncUpdateRequestGenerators/sentenceDeferredGenerator"

const pncUpdateRequestGenerator: { [T in PncOperation]: PncUpdateRequestGenerator<T> } = {
  [PncOperation.DISPOSAL_UPDATED]: disposalUpdatedGenerator,
  [PncOperation.NORMAL_DISPOSAL]: normalDisposalGenerator,
  [PncOperation.PENALTY_HEARING]: penaltyHearingGenerator,
  [PncOperation.REMAND]: remandGenerator,
  [PncOperation.SENTENCE_DEFERRED]: sentenceDeferredGenerator
}

const dispatch = async <T extends PncOperation>(
  pncUpdateDataset: PncUpdateDataset,
  operation: Operation<T>,
  pncGateway: PncGatewayInterface
): PromiseResult<void> => {
  const pncUpdateRequest = pncUpdateRequestGenerator[operation.code as T](pncUpdateDataset, operation)
  if (isError(pncUpdateRequest)) {
    return pncUpdateRequest
  }

  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const pncUpdateResult = await pncGateway.update(pncUpdateRequest, correlationId).catch((error: PncApiError) => error)

  if (isError(pncUpdateResult)) {
    for (const message of pncUpdateResult.messages) {
      pncUpdateDataset.Exceptions.push(generatePncUpdateExceptionFromMessage(message))
    }

    return pncUpdateResult
  }
}

export default dispatch
