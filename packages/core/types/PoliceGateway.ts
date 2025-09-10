import type { PncQueryResult } from "@moj-bichard7/common/types/PncQueryResult"

import type { PncApiError } from "../lib/pnc/PncGateway"
import type PncUpdateRequest from "../phase3/types/PncUpdateRequest"

interface PoliceGateway {
  query: (asn: string, correlationId: string) => Promise<PncApiError | PncQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => Promise<PncApiError | void>
}

export default PoliceGateway
