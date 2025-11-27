import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"
import type { RemandRequest } from "../../../../types/leds/RemandRequest"

import { remandRequestSchema } from "../../../../schemas/leds/remandRequest"
import PoliceApiError from "../../PoliceApiError"
import endpoints from "../endpoints"
import mapToRemandRequest from "../mappers/mapToRemandRequest"

export const remand = (
  request: PoliceUpdateRequest,
  personId: string,
  reportId: string
): PoliceApiError | { endpoint: string; requestBody: RemandRequest } => {
  if (request.operation !== PncOperation.REMAND) {
    return new PoliceApiError(["mapToRemandRequest called with a non-remand request"])
  }

  const requestBody = mapToRemandRequest(request.request)
  const validation = remandRequestSchema.safeParse(requestBody)

  if (!validation.success) {
    return new PoliceApiError(["Failed to validate LEDS request."])
  }

  const endpoint = endpoints.remand(personId, reportId)

  return { endpoint, requestBody }
}
