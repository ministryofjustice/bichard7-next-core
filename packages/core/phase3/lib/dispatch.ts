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
    // handleException(pncUpdateDataset, pncUpdateRequest)
    return pncUpdateRequest
  }

  const correlationId = pncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
  const pncUpdateResult = await pncGateway.update(pncUpdateRequest, correlationId).catch((error: Error) => error)

  if (isError(pncUpdateResult)) {
    // handleException(pncUpdateDataset, pncUpdateRequest)
    return pncUpdateResult
  }

  // TODO: Determine if we need this!
  // mapWarnings(pncUpdateDataset)
}

export default dispatch
