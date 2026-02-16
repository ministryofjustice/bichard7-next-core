import Asn from "@moj-bichard7/core/lib/Asn"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import type { LedsMock } from "../../../types/LedsMock"
import { convertPncJsonToLedsAsnQueryResponse } from "../../converters/convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"
import { convertPncXmlToJson } from "../../converters/convertPncXmlToJson"
import type { PncAsnQueryJson } from "../../converters/convertPncXmlToJson/convertPncXmlToJson"
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
    path: "/find-disposals-by-asn",
    exactBodyMatch: true,
    body: {
      asn: new Asn(asn).toPncFormat(),
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
