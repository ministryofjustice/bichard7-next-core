import axios from "axios"
import https from "https"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type LedsApiConfig from "../../types/LedsApiConfig"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../types/PncQueryResult"
import type { PncApiError } from "../pnc/PncGateway"

import { ledsApiResultSchema } from "../../schemas/ledsApiResult"
import Asn from "../Asn"

export default class LedsGateway implements PncGatewayInterface {
  queryTime: Date | undefined
  update: (request: PncUpdateRequest, correlationId: string) => Promise<PncApiError | void>

  constructor(private config: LedsApiConfig) {}

  query(asn: string, correlationId: string): Promise<PncApiError | PncQueryResult | undefined> {
    this.queryTime = new Date()
    return axios
      .post(
        `${this.config.url}/find-disposals-by-asn`,
        {
          asn: new Asn(asn).toPncFormat(),
          caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "result-unobtainable", "court-case"]
        },
        {
          headers: {
            "X-Leds-Correlation-Id": correlationId,
            Accept: "application/json"
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        }
      )
      .then((result) => {
        const ledsApiResult = ledsApiResultSchema.parse(result.data)

        return {
          forceStationCode: ledsApiResult.ownerCode,
          checkName: "TRTHREE",
          pncId: "2000/0410769X",
          courtCases: ledsApiResult.disposals.map((disposal) => ({
            courtCaseReference: disposal.courtCaseReference,
            offences: disposal.offences.map((offence) => ({
              offence: {
                acpoOffenceCode: "12:15:24:1",
                cjsOffenceCode: offence.cjsOffenceCode,
                startDate: offence.offenceStartDate,
                endDate: offence.offenceEndDate,
                title: offence.offenceDescription[0],
                sequenceNumber: offence.courtOffenceSequenceNumber
              },
              adjudication:
                offence.adjudications.length > 0
                  ? {
                      verdict: offence.adjudications[0].adjudication.toUpperCase(),
                      plea: offence.plea?.toUpperCase(),
                      sentenceDate: offence.adjudications[0].disposalDate,
                      offenceTICNumber: 0
                    }
                  : undefined,
              disposals: offence.disposalResults.map((disposalResult) => {
                let qtyDuration = undefined
                if (disposalResult.disposalDuration) {
                  const unit = disposalResult.disposalDuration.units
                  const unitShortened = unit.charAt(0).toUpperCase()
                  const count = disposalResult.disposalDuration.count
                  qtyDuration = unitShortened.concat(count.toString())
                }

                return {
                  type: disposalResult.disposalCode,
                  qtyDuration
                }
              })
            }))
          }))
        }
      })
      .catch((e) => {
        console.log(e)
        return undefined
      })
  }
}
