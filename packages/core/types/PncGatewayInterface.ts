import type { PncQueryResult } from "./PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string, correlationId: string) => Promise<PncQueryResult | Error | undefined>
  queryTime: Date | undefined
}

export default PncGatewayInterface
