import type { PncQueryResult } from "common/pnc/PncQueryResult"

interface PncGatewayInterface {
  query: (asn: string) => Promise<PncQueryResult | Error | undefined>
  queryTime: Date | undefined
}

export default PncGatewayInterface
