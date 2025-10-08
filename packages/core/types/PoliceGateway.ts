import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"

import type PoliceApiError from "../lib/policeGateway/PoliceApiError"
import type PoliceUpdateRequest from "../phase3/types/PoliceUpdateRequest"

interface PoliceGateway {
  query: (
    asn: string,
    correlationId: string,
    aho?: AnnotatedHearingOutcome
  ) => Promise<PoliceApiError | PoliceQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PoliceUpdateRequest, correlationId: string) => Promise<PoliceApiError | void>
}

export default PoliceGateway
