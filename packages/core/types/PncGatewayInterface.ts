import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequest from "../phase3/types/PncUpdateRequest"
import type { PncQueryResult } from "./PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string, correlationId: string) => PromiseResult<PncQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => PromiseResult<void>
}

export default PncGatewayInterface
