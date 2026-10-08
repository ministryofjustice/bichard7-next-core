import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"
import { Agent, fetch } from "undici"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type AuditLogger from "../../../types/AuditLogger"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"
import type { AsnQueryRequest } from "../../../types/leds/AsnQueryRequest"
import type { ErrorResponse } from "../../../types/leds/ErrorResponse"
import type LedsApiConfig from "../../../types/leds/LedsApiConfig"
import type { RemandRequest } from "../../../types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "../../../types/leds/SubsequentDisposalResultsRequest"
import type LedsOperation from "../../../types/LedsOperation"
import type PoliceGateway from "../../../types/PoliceGateway"

import { asnQueryResponseSchema } from "../../../schemas/leds/asnQueryResponse"
import LedsActionCode from "../../../types/leds/LedsActionCode"
import { ledsOperations, pncToLedsOperations } from "../../../types/LedsOperation"
import PoliceApiError from "../PoliceApiError"
import convertAsnToLedsFormat from "./convertAsnToLedsFormat"
import endpoints from "./endpoints"
import generateCheckName from "./generateCheckName"
import generateRequestHeaders from "./generateRequestHeaders"
import logApiMetric from "./logApiMetric"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"
import { normalDisposal } from "./processors/normalDisposal"
import { remand } from "./processors/remand"
import { subsequentDisposal } from "./processors/subsequentDisposal"

const generateAuditLogAttributes = (
  requestType: LedsOperation,
  url: string,
  headers: Record<string, unknown>,
  body: Record<string, unknown>,
  response: Error | (Response & { data?: unknown }),
  requestStartTime: Date
) => {
  const isNetworkError = response instanceof Error

  return {
    "Response Time": Date.now() - requestStartTime.getTime(),
    "Request Type": requestType,
    "Request URL": url,
    "Request Headers": { ...headers, Authorization: undefined },
    "Request Message": body,
    "Response Message": isNetworkError ? response.message : response.data,
    "Response Status": isNetworkError ? undefined : response.status,
    sensitiveAttributes: "Request Message,Response Message"
  }
}

export default class LedsGateway implements PoliceGateway {
  queryTime: Date | undefined

  constructor(
    private readonly config: LedsApiConfig,
    private readonly auditLogger: AuditLogger
  ) {}

  async query(
    asn: string,
    correlationId: string,
    aho: AnnotatedHearingOutcome
  ): Promise<PoliceApiError | PoliceQueryResult | undefined> {
    this.queryTime = new Date()
    const requestBody: AsnQueryRequest = {
      asn: convertAsnToLedsFormat(asn),
      caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
    }

    const authToken = await this.config.authentication.generateBearerToken()
    if (isError(authToken)) {
      console.error(`Failed to generate LEDS auth token. ${authToken.message}`)
      return new PoliceApiError(["Failed to query LEDS"])
    }

    const asnQueryUrl = this.generateUrl(endpoints.asnQuery)
    const requestHeaders = generateRequestHeaders(correlationId, LedsActionCode.QueryByAsn, authToken)
    const startTime = performance.now()
    const apiResponse = await fetch(asnQueryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requestHeaders
      },
      body: JSON.stringify(requestBody),
      dispatcher: new Agent({
        connect: { rejectUnauthorized: false }
      })
    }).catch((error) => error)
    if (!(apiResponse instanceof Error)) {
      ;(apiResponse as Response & { data?: unknown }).data = await apiResponse.json().catch(() => null)
    }

    const durationMs = performance.now() - startTime

    logApiMetric(asnQueryUrl, durationMs, correlationId, ledsOperations.AsnQuery, apiResponse.status)

    this.auditLogger.info(
      EventCode.PncResponseReceived,
      generateAuditLogAttributes(
        ledsOperations.AsnQuery,
        asnQueryUrl,
        requestHeaders,
        requestBody,
        apiResponse,
        this.queryTime
      )
    )

    if (apiResponse instanceof Error) {
      return new PoliceApiError([apiResponse.message])
    }

    if (apiResponse.status !== 200) {
      const errors = (apiResponse.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
        `ASN query failed with status code ${apiResponse.status}.`
      ]
      return new PoliceApiError(errors)
    }

    const queryResponse = asnQueryResponseSchema.safeParse(apiResponse.data)
    if (!queryResponse.success) {
      console.error(queryResponse.error)
      return new PoliceApiError(["Couldn't parse LEDS query response."])
    }

    const checkName = generateCheckName(aho)
    return mapToPoliceQueryResult(queryResponse.data, checkName)
  }

  async update(
    request: PoliceUpdateRequest,
    correlationId: string,
    pncUpdateDataset: PncUpdateDataset
  ): Promise<PoliceApiError | void> {
    const updateTime = new Date()
    const personId = pncUpdateDataset.PncQuery?.personId
    const reportId = pncUpdateDataset.PncQuery?.reportId

    if (!personId || !reportId) {
      return new PoliceApiError(["Failed to update LEDS due to missing data."])
    }

    let result:
      | PoliceApiError
      | { endpoint: string; requestBody: AddDisposalRequest | RemandRequest | SubsequentDisposalResultsRequest }
    let actionCode: LedsActionCode

    switch (request.operation) {
      case PncOperation.DISPOSAL_UPDATED:
      case PncOperation.SENTENCE_DEFERRED:
        actionCode = LedsActionCode.AddSubsequentDisposalResults
        result = subsequentDisposal(request, personId, pncUpdateDataset)
        break
      case PncOperation.NORMAL_DISPOSAL:
        actionCode = LedsActionCode.AddDisposalResults
        result = normalDisposal(request, personId, pncUpdateDataset)
        break
      case PncOperation.REMAND:
        actionCode = LedsActionCode.AddRemand
        result = remand(request, personId, reportId, pncUpdateDataset)
        break
      default:
        return new PoliceApiError(["Invalid LEDS update operation."])
    }

    if (result instanceof PoliceApiError) {
      return result
    }

    const { endpoint, requestBody } = result

    const authToken = await this.config.authentication.generateBearerToken()
    if (isError(authToken)) {
      console.error(`Failed to generate LEDS auth token. ${authToken.message}`)
      return new PoliceApiError(["Failed to update LEDS"])
    }

    const updateUrl = this.generateUrl(endpoint)
    const requestHeaders = generateRequestHeaders(correlationId, actionCode, authToken)
    const startTime = performance.now()
    const apiResponse = await fetch(updateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...requestHeaders
      },
      body: JSON.stringify(requestBody),
      dispatcher: new Agent({
        connect: { rejectUnauthorized: false }
      })
    }).catch((error) => error)
    if (!(apiResponse instanceof Error)) {
      ;(apiResponse as any).data = await apiResponse.json().catch(() => null)
    }

    const durationMs = performance.now() - startTime

    logApiMetric([request.operation], apiResponse.status)

    this.auditLogger.info(
      EventCode.PncResponseReceived,
      generateAuditLogAttributes(
        pncToLedsOperations[request.operation],
        updateUrl,
        requestHeaders,
        requestBody,
        apiResponse,
        updateTime
      )
    )

    if (apiResponse instanceof Error) {
      return new PoliceApiError([apiResponse.message])
    }

    if (apiResponse.status !== 201) {
      const errors = (apiResponse.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
        `Update failed with status code ${apiResponse.status}.`
      ]
      return new PoliceApiError(errors)
    }
  }

  private generateUrl(endpoint: string): string {
    const baseUrlWithTrailingSlash = this.config.url.concat(this.config.url.endsWith("/") ? "" : "/")
    const endpointWithoutLeadingSlash = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint

    return new URL(endpointWithoutLeadingSlash, baseUrlWithTrailingSlash).href
  }
}
