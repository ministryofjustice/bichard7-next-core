import type { PncQueryResult } from "./PncQueryResult"

interface PncGateway {
  query: (asn: string) => PncQueryResult | undefined
}

export default PncGateway
