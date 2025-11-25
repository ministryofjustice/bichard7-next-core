import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"
import type { AddDisposalRequest } from "../../../../types/leds/AddDisposalRequest"

import { addDisposalRequestSchema } from "../../../../schemas/leds/addDisposalRequest"
import PoliceApiError from "../../PoliceApiError"
import endpoints from "../endpoints"
import { mapToAddDisposalRequest } from "../mappers/mapToAddDisposalRequest"
import { findCourtCaseId } from "../mappers/mapToAddDisposalRequest/findCourtCaseId"

export const normalDisposal = (
  request: PoliceUpdateRequest,
  personId: string,
  pncUpdateDataset: PncUpdateDataset
): PoliceApiError | { endpoint: string; requestBody: AddDisposalRequest } => {
  if (request.operation !== PncOperation.NORMAL_DISPOSAL) {
    return new PoliceApiError(["mapToRemandRequest called with a non-normal-disposal request"])
  }

  const courtCaseId = findCourtCaseId(pncUpdateDataset, request.request.courtCaseReferenceNumber)

  if (!courtCaseId) {
    return new PoliceApiError(["Failed to update LEDS due to missing data."])
  }

  const endpoint = endpoints.addDisposal(personId, courtCaseId)
  const requestBody = mapToAddDisposalRequest(request.request, pncUpdateDataset)
  const validation = addDisposalRequestSchema.safeParse(requestBody)

  if (!validation.success) {
    return new PoliceApiError(["Failed to validate LEDS request."])
  }

  return { endpoint, requestBody }
}
