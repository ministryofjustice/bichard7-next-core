import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import type { AxiosError } from "axios"

import { isError } from "@moj-bichard7/common/types/Result"
import axios, { HttpStatusCode } from "axios"
import https from "https"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type { AsnQueryRequest } from "../../../types/leds/AsnQueryRequest"
import type { ErrorResponse } from "../../../types/leds/ErrorResponse"
import type LedsApiConfig from "../../../types/leds/LedsApiConfig"
import type PoliceGateway from "../../../types/PoliceGateway"

import { asnQueryResponseSchema } from "../../../schemas/leds/asnQueryResponse"
import Asn from "../../Asn"
import PoliceApiError from "../PoliceApiError"
import endpoints from "./endpoints"
import generateCheckName from "./generateCheckName"
import generateRequestHeaders from "./generateRequestHeaders"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"

export default class LedsGateway implements PoliceGateway {
  queryTime: Date | undefined
  update: (request: PoliceUpdateRequest, correlationId: string) => Promise<PoliceApiError | void>

  constructor(private config: LedsApiConfig) {}

  async query(
    asn: string,
    correlationId: string,
    aho?: AnnotatedHearingOutcome
  ): Promise<PoliceApiError | PoliceQueryResult | undefined> {
    if (!aho) {
      return new PoliceApiError(["Annotated hearing outcome is missing."])
    }

    this.queryTime = new Date()
    const requestBody: AsnQueryRequest = {
      asn: new Asn(asn).toPncFormat(),
      caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
    }

    const response = await axios
      .post(`${this.config.url}${endpoints.asnQuery}`, requestBody, {
        headers: generateRequestHeaders(correlationId),
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        transformResponse: [(data) => JSON.parse(data)]
      })
      .catch((error: AxiosError) => error)

    if (isError(response)) {
      return new PoliceApiError([response.message])
    }

    if (response.status !== HttpStatusCode.Ok) {
      const errors = (response.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
        `ASN query failed with status code ${response.status}.`
      ]
      return new PoliceApiError(errors)
    }

    const queryResponse = asnQueryResponseSchema.safeParse(response.data)
    if (!queryResponse.success) {
      return new PoliceApiError(["Couldn't parse LEDS query response."])
    }

    const checkName = generateCheckName(aho)
    return mapToPoliceQueryResult(queryResponse.data, checkName)
  }
}
