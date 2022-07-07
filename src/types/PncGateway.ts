import type { PncQueryResult } from "./PncQueryResult"

interface PncGateway {
  query: (asn: string) => PncQueryResult | Error | undefined
  queryTime: Date | undefined
}

export default PncGateway
