import { asnQueryResponseSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { subsequentDisposalResultsRequestSchema } from "@moj-bichard7/core/schemas/leds/subsequentDisposalResultsRequest"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import { Operation } from "../../../types/Operation"
import convertAddDisposalRequestMockJsonToLeds from "./convertAddDisposalRequestMockJsonToLeds"
import convertRemandRequestMockJsonToLeds from "./convertRemandRequestMockJsonToLeds"

type LedsJson = AsnQueryResponse | RemandRequest | AddDisposalRequest | SubsequentDisposalResultsRequest

const convertMockJsonToLeds = (code: string, mockJson: object): LedsJson => {
  switch (code.toUpperCase()) {
    case Operation.AsnQueryResponse:
      return asnQueryResponseSchema.parse(mockJson)
    case Operation.Remand:
      return convertRemandRequestMockJsonToLeds(mockJson)
    case Operation.AddDisposal:
      return convertAddDisposalRequestMockJsonToLeds(mockJson)
    case Operation.SentenceDeferred:
    case Operation.SubsequentlyVaried:
      return subsequentDisposalResultsRequestSchema.parse(mockJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }
}

export default convertMockJsonToLeds
