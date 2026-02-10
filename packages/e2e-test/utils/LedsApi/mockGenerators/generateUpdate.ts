import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import { randomUUID } from "crypto"
import type { LedsMock, LedsMockOptions } from "../../../types/LedsMock"
import convertPncUpdateResponseToLeds from "../../convertPncJsonToLeds/convertPncUpdateResponseToLeds"
import createMockRequest from "./createMockRequest"
import createMockResponse from "./createMockResponse"

enum Operation {
  Remand = "CXU01", // NEWREM
  AddDisposal = "CXU02", // DISARR
  SubsequentlyVaried = "CXU03", // SUBVAR
  SentenceDeferred = "CXU04" // SENDEF
}

export const generateUpdate = (code: string, options: LedsMockOptions): LedsMock => {
  const personId = options.personId ?? randomUUID()
  const reportId = options.reportId ?? randomUUID()
  const courtCaseId = options.courtCaseId ?? randomUUID()
  let endpoint = ""

  switch (code.toUpperCase()) {
    case Operation.Remand:
      endpoint = endpoints.remand(personId, reportId)
      break
    case Operation.AddDisposal:
      endpoint = endpoints.addDisposal(personId, courtCaseId)
      break
    case Operation.SubsequentlyVaried:
    case Operation.SentenceDeferred:
      endpoint = endpoints.subsequentDisposalResults(personId, courtCaseId)
      break
    default:
      throw Error(`Unsupported operation code: ${code}`)
  }

  const request = createMockRequest({
    path: endpoint,
    exactBodyMatch: false,
    body: undefined
  })

  const { mockResponse, statusCode } = convertPncUpdateResponseToLeds(options.response)
  const response = createMockResponse(mockResponse, statusCode)

  return {
    id: randomUUID(),
    request,
    response,
    count: options?.count,
    receivedRequests: []
  }
}
