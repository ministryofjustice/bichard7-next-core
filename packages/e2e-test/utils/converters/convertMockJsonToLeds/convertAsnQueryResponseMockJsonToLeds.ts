import convertAsnToLedsFormat from "@moj-bichard7/core/lib/policeGateway/leds/convertAsnToLedsFormat"
import { asnQueryResponseSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type { MockAsnQueryErrorResponse } from "../../../types/MockAsnQueryErrorResponse"
import type { MockAsnQueryResponse } from "../../../types/MockAsnQueryResponse"
import { mapPncErrorToLeds } from "../convertPncJsonToLeds/convertPncJsonToLedsAsnQueryResponse"

const convertAsnQueryResponseMockJsonToLeds = (
  mockJson: MockAsnQueryResponse | MockAsnQueryErrorResponse,
  personId: string,
  reportId: string,
  courtCaseId: string
): AsnQueryResponse | ErrorResponse => {
  if ("txt" in mockJson) {
    return {
      status: 404,
      title: "string",
      type: "conflict/version",
      details: "string",
      instance: "string",
      leds: {
        errors: [
          {
            errorDetailType: "unknown",
            message: mapPncErrorToLeds(mockJson.txt)
          }
        ]
      }
    }
  }

  mockJson.asn = convertAsnToLedsFormat(mockJson.asn)
  mockJson.personId = personId
  mockJson.reportId = reportId
  mockJson.disposals.forEach((disposal) => (disposal.courtCaseId = courtCaseId))

  return asnQueryResponseSchema.parse(mockJson)
}

export default convertAsnQueryResponseMockJsonToLeds
