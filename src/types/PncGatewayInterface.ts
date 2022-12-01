import type { PncQueryResult } from "./PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string) => PncQueryResult | Error | undefined
  queryTime: Date | undefined
}

export default PncGatewayInterface
