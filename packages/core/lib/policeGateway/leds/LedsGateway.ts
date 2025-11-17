import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"
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
import type { SubsequentDisposalResultsRequest } from "../../../types/leds/SubsequentDisposalResultsRequest"
import type PoliceGateway from "../../../types/PoliceGateway"

import { addDisposalRequestSchema } from "../../../schemas/leds/addDisposalRequest"
import { asnQueryResponseSchema } from "../../../schemas/leds/asnQueryResponse"
import { remandRequestSchema } from "../../../schemas/leds/remandRequest"
import { subsequentDisposalResultsRequestSchema } from "../../../schemas/leds/subsequentDisposalResultsRequest"
import Asn from "../../Asn"
import PoliceApiError from "../PoliceApiError"
import endpoints from "./endpoints"
import generateCheckName from "./generateCheckName"
import generateRequestHeaders from "./generateRequestHeaders"
import { mapToAddDisposalRequest } from "./mapToAddDisposalRequest"
import { findCourtCaseId } from "./mapToAddDisposalRequest/findCourtCaseId"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"
import mapToRemandRequest from "./mapToRemandRequest"
import mapToSubsequentDisposalRequest from "./mapToSubsequentDisposalRequest/mapToSubsequentDisposalRequest"

export default class LedsGateway implements PoliceGateway {
  queryTime: Date | undefined

  constructor(private config: LedsApiConfig) {}

  async query(
    asn: string,
    correlationId: string,
    aho: AnnotatedHearingOutcome
  ): Promise<PoliceApiError | PoliceQueryResult | undefined> {
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

  async update(
    request: PoliceUpdateRequest,
    correlationId: string,
    pncUpdateDataset: PncUpdateDataset
  ): Promise<PoliceApiError | void> {
    let endpoint: string
    let requestBody: AddDisposalRequest | RemandRequest | SubsequentDisposalResultsRequest
    const personId = pncUpdateDataset.PncQuery?.personId
    const reportId = pncUpdateDataset.PncQuery?.reportId

    if (!personId || !reportId) {
      return new PoliceApiError(["Failed to update LEDS due to missing data."])
    }

    if (request.operation === PncOperation.REMAND) {
      endpoint = endpoints.remand(personId, reportId)
      requestBody = mapToRemandRequest(request.request)
      const validationResult = remandRequestSchema.safeParse(requestBody)

      if (!validationResult.success) {
        console.error(validationResult.error)
        return new PoliceApiError(["Failed to validate LEDS request."])
      }
    } else if (request.operation === PncOperation.NORMAL_DISPOSAL) {
      const courtCaseId = findCourtCaseId(pncUpdateDataset, request.request.courtCaseReferenceNumber)

      if (!courtCaseId) {
        console.error("Couldn't find courtCaseId.")
        return new PoliceApiError(["Failed to update LEDS due to missing data."])
      }

      endpoint = endpoints.addDisposal(personId, courtCaseId)
      requestBody = mapToAddDisposalRequest(request.request, pncUpdateDataset)
      const validationResult = addDisposalRequestSchema.safeParse(requestBody)

      if (!validationResult.success) {
        console.error(validationResult.error)
        return new PoliceApiError(["Failed to validate LEDS request."])
      }
    } else if (
      request.operation === PncOperation.DISPOSAL_UPDATED ||
      request.operation === PncOperation.SENTENCE_DEFERRED
    ) {
      const courtCaseId = findCourtCaseId(pncUpdateDataset, request.request.courtCaseReferenceNumber)

      if (!courtCaseId) {
        console.error("Couldn't find courtCaseId.")
        return new PoliceApiError(["Failed to update LEDS due to missing data."])
      }

      requestBody = mapToSubsequentDisposalRequest(request.request, pncUpdateDataset)

      const validationResult = subsequentDisposalResultsRequestSchema.safeParse(requestBody)

      if (!validationResult.success) {
        console.error(validationResult.error)
        return new PoliceApiError(["Failed to validate LEDS request."])
      }

      endpoint = endpoints.subsequentDisposalResults(personId, courtCaseId)
    } else {
      return new PoliceApiError(["Invalid LEDS update operation."])
    }

    const apiResponse = await axios
      .post(`${this.config.url}${endpoint}`, requestBody, {
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
          `LEDS update failed with status code ${apiResponse.status}.`
        ]
        return new PoliceApiError(errors)
      }

      return new PoliceApiError([apiResponse.message])
    }

    if (apiResponse.status !== HttpStatusCode.Ok) {
      const errors = (apiResponse.data as ErrorResponse)?.leds?.errors.map((error) => error.message) ?? [
        `Update failed with status code ${apiResponse.status}.`
      ]

      return new PoliceApiError(errors)
    }
  }
}
