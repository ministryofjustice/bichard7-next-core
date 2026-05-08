import convertAsnToLedsFormat from "@moj-bichard7/core/lib/policeGateway/leds/convertAsnToLedsFormat"
import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import type { LedsMock } from "../../../types/LedsMock"
import type { MockAsnQueryErrorResponse } from "../../../types/MockAsnQueryErrorResponse"
import type { MockAsnQueryResponse } from "../../../types/MockAsnQueryResponse"
import convertAsnQueryResponseMockJsonToLeds from "../../converters/convertMockJsonToLeds/convertAsnQueryResponseMockJsonToLeds"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

export const generateAsnQuery = (
  mockJson: MockAsnQueryResponse | MockAsnQueryErrorResponse,
  count: number,
  asn: string
): LedsMock => {
  const ledsAsnQueryResponse = convertAsnQueryResponseMockJsonToLeds(mockJson)

  const request = createMockRequest({
    path: endpoints.asnQuery,
    exactBodyMatch: true,
    body: {
      asn: convertAsnToLedsFormat(asn),
      caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
    }
  })

  const responseStatus = ("status" in ledsAsnQueryResponse && ledsAsnQueryResponse.status) || HttpStatusCode.Ok
  const response = createMockResponse(ledsAsnQueryResponse, responseStatus)

  return {
    id: randomUUID(),
    request,
    response,
    count
  }
}
