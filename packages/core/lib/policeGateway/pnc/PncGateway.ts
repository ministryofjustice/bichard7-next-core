import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type {
  PoliceAdjudication,
  PoliceCourtCase,
  PoliceDisposal,
  PoliceOffence,
  PolicePenaltyCase,
  PoliceQueryResult
} from "@moj-bichard7/common/types/PoliceQueryResult"
import type { AxiosInstance } from "axios"

import EventCode from "@moj-bichard7/common/types/EventCode"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"
import dateTransformer from "@moj-bichard7/common/utils/dateTransformer"
import axios from "axios"
import https from "https"

import type PoliceUpdateRequest from "../../../phase3/types/PoliceUpdateRequest"
import type AuditLogger from "../../../types/AuditLogger"
import type PncApiConfig from "../../../types/PncApiConfig"
import type { PncApiDisposal, PncApiOffence, PncApiResult } from "../../../types/PncApiResult"
import type PoliceGateway from "../../../types/PoliceGateway"

import { pncApiResultSchema } from "../../../schemas/pncApiResult"
import PoliceApiError from "../PoliceApiError"

const transform = (apiResponse: PncApiResult): PoliceQueryResult => {
  const getAdjudication = (offence: PncApiOffence): PoliceAdjudication | undefined => {
    if (
      offence.pleaStatus &&
      offence.numberOffencesTakenIntoAccount !== undefined &&
      offence.verdict &&
      offence.hearingDate
    ) {
      return {
        verdict: offence.verdict,
        sentenceDate: offence.hearingDate,
        plea: offence.pleaStatus,
        offenceTICNumber: offence.numberOffencesTakenIntoAccount
      }
    }
  }

  const getDisposals = (offence: PncApiOffence): PoliceDisposal[] | undefined => {
    if (offence.disposals.length === 0) {
      return undefined
    }

    return offence.disposals.map((d: PncApiDisposal): PoliceDisposal => ({
      qtyDate: d.disposalQuantityDate,
      qtyDuration: d.disposalQuantityDuration,
      qtyMonetaryValue: d.disposalQuantityMonetaryValue,
      qtyUnitsFined: undefined,
      qualifiers: d.disposalQualifiers,
      text: d.disposalText,
      type: Number(d.disposalType)
    }))
  }

  const getOffences = (o: PncApiOffence): PoliceOffence => ({
    offence: {
      acpoOffenceCode: o.acpoOffenceCode,
      cjsOffenceCode: o.cjsOffenceCode,
      startDate: o.startDate || undefined,
      startTime: o.startTime,
      endDate: o.endDate || undefined,
      endTime: o.endTime,
      qualifier1: o.offenceQualifier1,
      qualifier2: o.offenceQualifier2,
      title: o.title,
      sequenceNumber: Number(o.referenceNumber)
    },
    adjudication: getAdjudication(o),
    disposals: getDisposals(o)
  })
  return {
    forceStationCode: apiResponse.forceStationCode,
    croNumber: apiResponse.croNumber,
    checkName: apiResponse.pncCheckName,
    pncId: apiResponse.pncIdentifier,
    courtCases: apiResponse.courtCases.map((c): PoliceCourtCase => ({
      courtCaseReference: c.courtCaseRefNo,
      crimeOffenceReference: c.crimeOffenceRefNo,
      offences: c.offences.map(getOffences)
    })),
    penaltyCases: apiResponse.penaltyCases.map((c): PolicePenaltyCase => ({
      penaltyCaseReference: c.penaltyCaseRefNo,
      offences: c.offences.map(getOffences)
    }))
  }
}

const lookupPathFromOperation = (operation: PncOperation): string =>
  ({
    [PncOperation.DISPOSAL_UPDATED]: "disposal-update",
    [PncOperation.NORMAL_DISPOSAL]: "normal-disposal",
    [PncOperation.PENALTY_HEARING]: "penalty-notice-charge",
    [PncOperation.REMAND]: "remand",
    [PncOperation.SENTENCE_DEFERRED]: "sentence-deferred"
  })[operation]

export default class PncGateway implements PoliceGateway {
  pncAxios: AxiosInstance
  queryTime: Date | undefined

  constructor(
    private readonly config: PncApiConfig,
    private readonly auditLogger: AuditLogger
  ) {
    this.pncAxios = axios.create({
      transformResponse: [dateTransformer]
    })
  }

  async query(
    asn: string,
    correlationId: string,
    aho: AnnotatedHearingOutcome
  ): Promise<PoliceApiError | PoliceQueryResult> {
    this.queryTime = new Date()
    const pncResult = await this.pncAxios
      .get(`${this.config.url}/records/${asn}`, {
        headers: {
          "X-Api-Key": this.config.key,
          "x-correlation-id": correlationId,
          accept: "application/json"
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .then((result) => {
        const parsed = pncApiResultSchema.parse(result.data)
        return transform(parsed)
      })
      .catch((e) => {
        if (e.response?.data?.errors && e.response?.data?.errors.length > 0) {
          return new PoliceApiError(e.response?.data?.errors)
        }

        return new PoliceApiError([e.message])
      })

    const auditLogAttributes = {
      "PNC Response Time": Date.now() - this.queryTime.getTime(),
      "PNC Attempts Made": 1, // Retry is not implemented
      "PNC Request Type": "enquiry",
      "PNC Request Message": aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber,
      "PNC Response Message": isError(pncResult) ? pncResult.messages.join(", ") : pncResult,
      sensitiveAttributes: "PNC Request Message,PNC Response Message"
    }
    this.auditLogger.info(EventCode.PncResponseReceived, auditLogAttributes)

    return pncResult
  }

  update(request: PoliceUpdateRequest, correlationId: string): Promise<PoliceApiError | void> {
    const path = lookupPathFromOperation(request.operation)

    return this.pncAxios
      .post(`${this.config.url}/records/${path}`, request.request, {
        headers: {
          "X-Api-Key": this.config.key,
          "x-correlation-id": correlationId
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .then((result) => {
        if (result.status !== 204) {
          return new PoliceApiError(["Error updating PNC"])
        }
      })
      .catch((e) => {
        if (e.response?.data?.errors && e.response?.data?.errors.length > 0) {
          return new PoliceApiError(e.response?.data?.errors)
        }

        return new PoliceApiError([e.message])
      })
  }
}
