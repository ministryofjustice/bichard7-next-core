import type { PncQueryResult } from "pnc/PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string) => Promise<PncQueryResult | Error | undefined>
  queryTime: Date | undefined
}

export default PncGatewayInterface
