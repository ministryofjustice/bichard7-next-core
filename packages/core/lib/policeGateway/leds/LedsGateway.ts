import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"
import type { AxiosError, AxiosResponse } from "axios"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"
import axios, { HttpStatusCode } from "axios"
import https from "https"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type AuditLogger from "../../../types/AuditLogger"
import type { AddDisposalRequest } from "../../../types/leds/AddDisposalRequest"
import type { AsnQueryRequest } from "../../../types/leds/AsnQueryRequest"
import type { ErrorResponse } from "../../../types/leds/ErrorResponse"
import type LedsApiConfig from "../../../types/leds/LedsApiConfig"
import type { RemandRequest } from "../../../types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "../../../types/leds/SubsequentDisposalResultsRequest"
import type PoliceGateway from "../../../types/PoliceGateway"

import { asnQueryResponseSchema } from "../../../schemas/leds/asnQueryResponse"
import LedsActionCode from "../../../types/leds/LedsActionCode"
import PoliceApiError from "../PoliceApiError"
import cleanObjectStrings from "./cleanObjectStrings"
import convertAsnToLedsFormat from "./convertAsnToLedsFormat"
import endpoints from "./endpoints"
import generateCheckName from "./generateCheckName"
import generateRequestHeaders from "./generateRequestHeaders"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"
import { normalDisposal } from "./processors/normalDisposal"
import { remand } from "./processors/remand"
import { subsequentDisposal } from "./processors/subsequentDisposal"

const jsonTransformer = (data: string): unknown => {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

const requestTypes = {
  [PncOperation.DISPOSAL_UPDATED]: "Subsequently Varied",
  [PncOperation.NORMAL_DISPOSAL]: "Disposal Results",
  [PncOperation.REMAND]: "Remand",
  [PncOperation.SENTENCE_DEFERRED]: "Sentence Deferred",
  AsnQuery: "ASN Query"
} as const
type RequestType = (typeof requestTypes)[keyof typeof requestTypes]

const generateAuditLogAttributes = (
  requestType: RequestType,
  url: string,
  headers: Record<string, unknown>,
  body: Record<string, unknown>,
  response: AxiosError | AxiosResponse,
  requestStartTime: Date
) => ({
  "Response Time": Date.now() - requestStartTime.getTime(),
  "Request Type": requestType,
  "Request URL": url,
  "Request Headers": { ...headers, Authorization: undefined },
  "Request Message": body,
  "Response Message": isError(response) ? response.response?.data || response.message : response.data,
  "Response Status": response.status,
  sensitiveAttributes: "Request Message,Response Message"
})

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
    const apiResponse = await axios
      .post(asnQueryUrl, requestBody, {
        headers: requestHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        transformResponse: [jsonTransformer]
      })
      .catch((error: AxiosError<ErrorResponse>) => error)

    this.auditLogger.info(
      EventCode.PncResponseReceived,
      generateAuditLogAttributes(
        requestTypes.AsnQuery,
        asnQueryUrl,
        requestHeaders,
        requestBody,
        apiResponse,
        this.queryTime
      )
    )

    if (isError(apiResponse)) {
      if (apiResponse.response?.data) {
        console.error(JSON.stringify(apiResponse.response.data, null, 2))
        const errors = apiResponse.response.data?.leds?.errors.map((error) => error.message) ?? [
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
    const body = cleanObjectStrings(requestBody)
    const requestHeaders = generateRequestHeaders(correlationId, actionCode, authToken)
    const apiResponse = await axios
      .post(updateUrl, body, {
        headers: requestHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        transformResponse: [jsonTransformer]
      })
      .catch((error: AxiosError<ErrorResponse>) => error)

    this.auditLogger.info(
      EventCode.PncResponseReceived,
      generateAuditLogAttributes(
        requestTypes[request.operation],
        updateUrl,
        requestHeaders,
        requestBody,
        apiResponse,
        updateTime
      )
    )

    if (isError(apiResponse)) {
      if (apiResponse.response?.data) {
        console.error(JSON.stringify(apiResponse.response.data, null, 2))
        const errors = apiResponse.response.data?.leds?.errors.map((error) => error.message) ?? [
          `LEDS update failed with status code ${apiResponse.status}.`
        ]
        return new PoliceApiError(errors)
      }

      return new PoliceApiError([apiResponse.message])
    }

    if (apiResponse.status !== HttpStatusCode.Created) {
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
