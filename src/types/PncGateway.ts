import type { PncQueryResult } from "./PncQueryResult"

interface PncGateway {
  query: (asn: string) => PncQueryResult | undefined
  queryTime: Date
}

export default PncGateway
