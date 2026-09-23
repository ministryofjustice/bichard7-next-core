import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"

type EventDetailsCommon = {
  errors: string[]
  timestamp: string
}

type EventDetails = {
  queryResponse?: EventDetailsCommon & { response: AsnQueryResponse | ErrorResponse }
  addDisposal?: EventDetailsCommon & { request: AddDisposalRequest }
  remand?: EventDetailsCommon & { request: RemandRequest }
  subsequentlyVaried?: EventDetailsCommon & { request: SubsequentDisposalResultsRequest }
  sentenceDeferred?: EventDetailsCommon & { request: SubsequentDisposalResultsRequest }
  penaltyHearing?: EventDetailsCommon & { request: string }
}

export default EventDetails
