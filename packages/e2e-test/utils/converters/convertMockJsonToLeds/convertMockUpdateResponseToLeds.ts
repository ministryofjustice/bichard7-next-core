import errorResponseSchema from "@moj-bichard7/core/schemas/leds/errorResponseSchema"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type { UpdateResponse } from "@moj-bichard7/core/types/leds/UpdateResponse"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"

type MockUpdateResponse = UpdateResponse | ErrorResponse | string
type Response = { mockResponse: MockUpdateResponse; statusCode: number }

const isErrorResponse = (mockUpdateResponse?: MockUpdateResponse): mockUpdateResponse is ErrorResponse =>
  !!mockUpdateResponse && typeof mockUpdateResponse === "object" && "status" in mockUpdateResponse

const convertMockUpdateResponseToLeds = (mockResponse?: MockUpdateResponse): Response => {
  if (isErrorResponse(mockResponse)) {
    const ledsErrorResponse = errorResponseSchema.parse(mockResponse)
    return { mockResponse: ledsErrorResponse, statusCode: HttpStatusCode.BadRequest }
  }

  return { mockResponse: { id: randomUUID() }, statusCode: HttpStatusCode.Created }
}

export default convertMockUpdateResponseToLeds
