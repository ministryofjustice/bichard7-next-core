import axiosDateTransformer from "@moj-bichard7/common/axiosDateTransformer"
import type {
  PncAdjudication,
  PncApiConfig,
  PncApiDisposal,
  PncApiOffence,
  PncApiResult,
  PncCourtCase,
  PncDisposal,
  PncGatewayInterface,
  PncOffence,
  PncPenaltyCase,
  PncQueryResult
} from "@moj-bichard7/common/pnc"
import axios from "axios"
import https from "https"
import { pncApiResultSchema } from "phase1/schemas/pncApiResult"

axios.defaults.transformResponse = [axiosDateTransformer]

const transform = (apiResponse: PncApiResult): PncQueryResult => {
  const getAdjudication = (offence: PncApiOffence): PncAdjudication | undefined => {
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
  const getDisposals = (offence: PncApiOffence): PncDisposal[] | undefined => {
    if (offence.disposals.length === 0) {
      return undefined
    }
    return offence.disposals.map(
      (d: PncApiDisposal): PncDisposal => ({
        qtyDate: d.disposalQuantityDate,
        qtyDuration: d.disposalQuantityDuration,
        qtyMonetaryValue: d.disposalQuantityMonetaryValue,
        qtyUnitsFined: undefined,
        qualifiers: d.disposalQualifiers,
        text: d.disposalText,
        type: Number(d.disposalType)
      })
    )
  }
  const getOffences = (o: PncApiOffence): PncOffence => ({
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
    courtCases: apiResponse.courtCases.map(
      (c): PncCourtCase => ({
        courtCaseReference: c.courtCaseRefNo,
        crimeOffenceReference: c.crimeOffenceRefNo,
        offences: c.offences.map(getOffences)
      })
    ),
    penaltyCases: apiResponse.penaltyCases.map(
      (c): PncPenaltyCase => ({
        penaltyCaseReference: c.penaltyCaseRefNo,
        offences: c.offences.map(getOffences)
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
