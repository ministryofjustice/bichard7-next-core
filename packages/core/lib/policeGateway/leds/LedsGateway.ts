import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import type { AxiosError } from "axios"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"
import axios, { HttpStatusCode } from "axios"
import https from "https"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"
import type { AsnQueryRequest } from "../../../types/leds/AsnQueryRequest"
import type { ErrorResponse } from "../../../types/leds/ErrorResponse"
import type LedsApiConfig from "../../../types/leds/LedsApiConfig"
import type { RemandRequest } from "../../../types/leds/RemandRequest"
import type PoliceGateway from "../../../types/PoliceGateway"

import { asnQueryResponseSchema } from "../../../schemas/leds/asnQueryResponse"
import Asn from "../../Asn"
import PoliceApiError from "../PoliceApiError"
import endpoints from "./endpoints"
import generateCheckName from "./generateCheckName"
import generateRequestHeaders from "./generateRequestHeaders"
import mapToNormalDisposalRequest from "./mapToNormalDisposalRequest"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"
import mapToRemandRequest from "./mapToRemandRequest"

export default class LedsGateway implements PoliceGateway {
  queryTime: Date | undefined

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

    const apiResponse = await axios
      .post(`${this.config.url}${endpoints.asnQuery}`, requestBody, {
        headers: generateRequestHeaders(correlationId),
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        transformResponse: [(data) => JSON.parse(data)]
      })
      .catch((error: AxiosError) => error)

    if (isError(apiResponse)) {
      if (apiResponse.response?.data) {
        const errors = (apiResponse.response?.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
          `ASN query failed with status code ${apiResponse.status}.`
        ]
        return new PoliceApiError(errors)
      }

      return new PoliceApiError([apiResponse.message])
    }

    if (apiResponse.status !== HttpStatusCode.Ok) {
      const errors = (apiResponse.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
        `ASN query failed with status code ${apiResponse.status}.`
      ]
      return new PoliceApiError(errors)
    }

    const queryResponse = asnQueryResponseSchema.safeParse(apiResponse.data)
    if (!queryResponse.success) {
      return new PoliceApiError(["Couldn't parse LEDS query response."])
    }

    const checkName = generateCheckName(aho)
    return mapToPoliceQueryResult(queryResponse.data, checkName)
  }

  async update(request: PoliceUpdateRequest, correlationId: string): Promise<PoliceApiError | void> {
    let endpoint: string
    let requestBody: AddDisposalRequest | RemandRequest

    if (request.operation === PncOperation.REMAND && request.personId && request.reportId) {
      requestBody = mapToRemandRequest(request.request)
      endpoint = endpoints.remand(request.personId, request.reportId)
    } else if (request.operation === PncOperation.NORMAL_DISPOSAL) {
      requestBody = mapToNormalDisposalRequest(request.request)
      endpoint = ""
    } else {
      return new PoliceApiError(["Invalid LEDS update operation."])
    }

    const apiResponse = await axios
      .post(endpoint, requestBody, {
        headers: generateRequestHeaders(correlationId),
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        transformResponse: [(data) => JSON.parse(data)]
      })
      .catch((error: AxiosError) => error)

    if (isError(apiResponse)) {
      if (apiResponse.response?.data) {
        const errors = (apiResponse.response?.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
          `ASN query failed with status code ${apiResponse.status}.`
        ]
        return new PoliceApiError(errors)
      }

      return new PoliceApiError([apiResponse.message])
    }
  }
}
