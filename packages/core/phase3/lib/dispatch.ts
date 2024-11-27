import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"
import { PncOperation } from "../../types/PncOperation"
import type PncUpdateRequestGenerator from "../types/PncUpdateRequestGenerator"
import normalDisposalGenerator from "./pncUpdateRequestGenerators/normalDisposalGenerator"
import disposalUpdateGenerator from "./pncUpdateRequestGenerators/disposalUpdateGenerator"
import penaltyNoticeChargeGenerator from "./pncUpdateRequestGenerators/penaltyNoticeChargeGenerator"
import remandGenerator from "./pncUpdateRequestGenerators/remandGenerator"
import sentenceDeferredGenerator from "./pncUpdateRequestGenerators/sentenceDeferredGenerator"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncApiError } from "../../lib/PncGateway"
import generatePncUpdateExceptionFromMessage from "../exceptions/generatePncUpdateExceptionFromMessage"

const pncUpdateRequestGenerator: { [T in PncOperation]: PncUpdateRequestGenerator<T> } = {
  [PncOperation.DISPOSAL_UPDATED]: disposalUpdateGenerator,
  [PncOperation.NORMAL_DISPOSAL]: normalDisposalGenerator,
  [PncOperation.PENALTY_HEARING]: penaltyNoticeChargeGenerator,
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
