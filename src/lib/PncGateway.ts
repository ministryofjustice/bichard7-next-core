import axios from "axios"
import https from "https"
import { pncApiResultSchema } from "src/schemas/pncApiResult"
import type PncApiConfig from "src/types/PncApiConfig"
import type { PncApiOffence, PncApiResult } from "src/types/PncApiResult"
import type PncGatewayInterface from "src/types/PncGatewayInterface"
import type { PncAdjudication, PncCourtCase, PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import axiosDateTransformer from "./axiosDateTransformer"

axios.defaults.transformResponse = [axiosDateTransformer]

const transform = (apiResponse: PncApiResult): PncQueryResult => {
  const getAdjudication = (offence: PncApiOffence): PncAdjudication | undefined => {
    if (
      offence.pleaStatus &&
      offence.numberOffencesTakenIntoAccount !== undefined &&
      offence.verdict &&
      offence.sentenceDate
    ) {
      return {
        verdict: offence.verdict,
        sentenceDate: offence.sentenceDate,
        plea: offence.pleaStatus,
        offenceTICNumber: offence.numberOffencesTakenIntoAccount
      }
    }
  }
  return {
    forceStationCode: apiResponse.forceStationCode,
    croNumber: apiResponse.croNumber,
    checkName: apiResponse.pncCheckName,
    pncId: apiResponse.pncIdentifier,
    courtCases: apiResponse.courtCases.map(
      (c): PncCourtCase => ({
        courtCaseReference: c.courtCaseRefNo,
        crimeOffenceReference: c.crimeOffenceRefNo,
        offences: c.offences.map(
          (o): PncOffence => ({
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
            adjudication: getAdjudication(o)
            // disposals: []
          })
        )
      })
    )
  }
}

export default class PncGateway implements PncGatewayInterface {
  constructor(private config: PncApiConfig) {}

  queryTime: Date | undefined

  query(asn: string): Promise<PncQueryResult | Error | undefined> {
    this.queryTime = new Date()
    return axios
      .get(`${this.config.url}/records/${asn}`, {
        headers: {
          "X-Api-Key": this.config.key,
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
      .catch((e) => e)
  }
}
