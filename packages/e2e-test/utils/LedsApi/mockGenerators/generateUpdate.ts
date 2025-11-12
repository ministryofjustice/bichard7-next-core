import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import type { LedsMock, LedsMockOptions } from "../../../types/LedsMock"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

enum Operation {
  Remand = "CXU01", // NEWREM
  AddDisposal = "CXU02", // DISARR
  Subsequently_Varied = "CXU03", // SUBVAR
  Sentence_Deferred = "CXU04" // SENDEF
}

export const generateUpdate = (code: string, options: LedsMockOptions): LedsMock => {
  const personId = options.personId ?? randomUUID()
  let endpoint = ""

  switch (code.toUpperCase()) {
    case Operation.Remand:
      const reportId = options.reportId ?? randomUUID()
      endpoint = endpoints.remand(personId, reportId)
      break
    case Operation.AddDisposal:
      endpoint = endpoints.addDisposal(personId, "NOT-IMPLEMENTED-disposalId")
      break
    case Operation.Subsequently_Varied:
    case Operation.Sentence_Deferred:
      endpoint = endpoints.subsequentDisposalResults(personId, "NOT-IMPLEMENTED-disposalId")
      break
    default:
      throw Error(`Unknown operation code: ${code}`)
  }

  const request = createMockRequest({
    path: endpoint,
    exactBodyMatch: false,
    body: undefined
  })

  const mockResponse = { id: randomUUID() }
  const response = createMockResponse(mockResponse, HttpStatusCode.Created)

  return {
    id: randomUUID(),
    request,
    response,
    count: options?.count,
    receivedRequests: []
  }
}
