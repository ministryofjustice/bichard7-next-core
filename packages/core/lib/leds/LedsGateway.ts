import type { PncQueryResult } from "@moj-bichard7/common/types/PncQueryResult"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type PoliceGateway from "../../types/PoliceGateway"
import type { PncApiError } from "../pnc/PncGateway"

export default class LedsGateway implements PoliceGateway {
  query: (asn: string, correlationId: string) => Promise<PncApiError | PncQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => Promise<PncApiError | void>
}
