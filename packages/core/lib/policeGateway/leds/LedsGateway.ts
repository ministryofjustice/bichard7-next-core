import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type LedsApiConfig from "../../../types/leds/LedsApiConfig"
import type PoliceGateway from "../../../types/PoliceGateway"
import type PoliceApiError from "../PoliceApiError"

export default class LedsGateway implements PoliceGateway {
  query: (asn: string, correlationId: string) => Promise<PoliceApiError | PoliceQueryResult | undefined>
  queryTime: Date | undefined
  update: (request: PoliceUpdateRequest, correlationId: string) => Promise<PoliceApiError | void>
  constructor(private config: LedsApiConfig) {}
}
