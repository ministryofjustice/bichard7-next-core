import { addDisposalRequestSchema } from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import { asnQueryResponseSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { remandRequestSchema } from "@moj-bichard7/core/schemas/leds/remandRequest"
import { subsequentDisposalResultsRequestSchema } from "@moj-bichard7/core/schemas/leds/subsequentDisposalResultsRequest"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import { Operation } from "../../types/Operation"

type ledsJson = AsnQueryResponse | RemandRequest | AddDisposalRequest | SubsequentDisposalResultsRequest

const convertMockJsonToLeds = (code: string, mockJson: object): ledsJson => {
  switch (code.toUpperCase()) {
    case Operation.AsnQueryResponse:
      return asnQueryResponseSchema.parse(mockJson)
    case Operation.Remand:
      return remandRequestSchema.parse(mockJson)
    case Operation.AddDisposal:
      return addDisposalRequestSchema.parse(mockJson)
    case Operation.SentenceDeferred:
    case Operation.SubsequentlyVaried:
      return subsequentDisposalResultsRequestSchema.parse(mockJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }
}

export default convertMockJsonToLeds
