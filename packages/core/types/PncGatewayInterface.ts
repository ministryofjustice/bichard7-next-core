import type { PncApiError } from "../lib/pnc/PncGateway"
import type PncUpdateRequest from "../phase3/types/PncUpdateRequest"
import type { PncQueryResult } from "./PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string, correlationId: string) => Promise<PncApiError | PncQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => Promise<PncApiError | void>
}

export default PncGatewayInterface
