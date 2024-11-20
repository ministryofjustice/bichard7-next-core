import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { PncQueryResult } from "./PncQueryResult"
import type PncUpdateRequest from "../phase3/types/PncUpdateRequest"
import type { PncApiError } from "../lib/PncGateway"

interface PncGatewayInterface {
  query: (asn: string, correlationId: string) => Promise<PncQueryResult | PncApiError | undefined>
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => PromiseResult<void>
}

export default PncGatewayInterface
