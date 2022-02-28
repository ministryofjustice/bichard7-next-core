import type { PncQueryResult } from "./PncQueryResult"

interface PncGateway {
  query: (asn: string) => PncQueryResult
}

export default PncGateway
