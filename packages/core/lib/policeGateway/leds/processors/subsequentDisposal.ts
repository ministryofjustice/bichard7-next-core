import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"
import type { SubsequentDisposalResultsRequest } from "../../../../types/leds/SubsequentDisposalResultsRequest"

import { subsequentDisposalResultsRequestSchema } from "../../../../schemas/leds/subsequentDisposalResultsRequest"
import PoliceApiError from "../../PoliceApiError"
import endpoints from "../endpoints"
import { findCourtCaseId } from "../mappers/mapToAddDisposalRequest/findCourtCaseId"
import mapToSubsequentDisposalRequest from "../mappers/mapToSubsequentDisposalRequest"

export const subsequentDisposal = (
  request: PoliceUpdateRequest,
  personId: string,
  pncUpdateDataset: PncUpdateDataset
): PoliceApiError | { endpoint: string; requestBody: SubsequentDisposalResultsRequest } => {
  if (request.operation !== PncOperation.DISPOSAL_UPDATED && request.operation !== PncOperation.SENTENCE_DEFERRED) {
    return new PoliceApiError(["mapToRemandRequest called with a non-disposal-updated request"])
  }

  const courtCaseId = findCourtCaseId(pncUpdateDataset, request.request.courtCaseReferenceNumber)

  if (!courtCaseId) {
    return new PoliceApiError(["Failed to update LEDS due to missing data."])
  }

  const endpoint = endpoints.subsequentDisposalResults(personId, courtCaseId)
  const requestBody = mapToSubsequentDisposalRequest(request.request, pncUpdateDataset)
  const validation = subsequentDisposalResultsRequestSchema.safeParse(requestBody)

  if (!validation.success) {
    return new PoliceApiError(["Failed to validate LEDS request."])
  }

  return { endpoint, requestBody }
}
