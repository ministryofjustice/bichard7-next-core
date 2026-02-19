import convertLongAsnToLedsFormat from "@moj-bichard7/core/lib/policeGateway/leds/convertLongAsnToLedsFormat"
import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import type { LedsMock } from "../../../types/LedsMock"
import { convertPncJsonToLedsAsnQueryResponse } from "../../convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"
import { convertPncXmlToJson } from "../../convertPncXmlToJson"
import type { PncAsnQueryJson } from "../../convertPncXmlToJson/convertPncXmlToJson"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

export const generateAsnQuery = (
  responseXml: string,
  count: number,
  asn: string,
  personId: string,
  reportId: string,
  courtCaseId: string
): LedsMock => {
  const pncJson = convertPncXmlToJson<PncAsnQueryJson>(responseXml)
  const ledsAsnQueryResponse = convertPncJsonToLedsAsnQueryResponse(pncJson, {
    asn,
    personId,
    reportId,
    courtCaseId
  })

  const request = createMockRequest({
    path: endpoints.asnQuery,
    exactBodyMatch: true,
    body: {
      asn: convertLongAsnToLedsFormat(asn),
      caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
    }
  })

  const responseStatus = ("status" in ledsAsnQueryResponse && ledsAsnQueryResponse.status) || HttpStatusCode.Ok
  const response = createMockResponse(ledsAsnQueryResponse, responseStatus)

  return {
    id: randomUUID(),
    request,
    response,
    count,
    receivedRequests: []
  }
}
