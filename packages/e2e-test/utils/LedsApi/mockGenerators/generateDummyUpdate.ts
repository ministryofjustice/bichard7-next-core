import type { UpdateResponse } from "@moj-bichard7/core/types/leds/UpdateResponse"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import type { LedsMock } from "../../../types/LedsMock"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

export const generateDummyUpdate = (): LedsMock => {
  const request = createMockRequest({ path: "/people/.*" })
  const response = createMockResponse<UpdateResponse>(
    {
      id: randomUUID()
    },
    HttpStatusCode.Created
  )

  return {
    id: randomUUID(),
    request,
    response,
    receivedRequests: []
  }
}
