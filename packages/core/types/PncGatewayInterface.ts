import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { PncUpdateRequest } from "../phase3/types/PncUpdateRequestGenerator"
import type { PncOperation } from "./PncOperation"
import type { PncQueryResult } from "./PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string, correlationId: string) => PromiseResult<PncQueryResult | undefined>
  queryTime: Date | undefined
  update: (operationCode: PncOperation, request: PncUpdateRequest, correlationId: string) => PromiseResult<void>
}

export default PncGatewayInterface
